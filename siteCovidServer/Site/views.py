import datetime

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from Site.models import *
import json


def index(request):
  return render(request, 'index.html')


def initUser(request):
  args = {
    'username': '',
    'phone': '',
    'group': '',
    'is_control': False
  }

  user = Profile.objects.filter(user_id=request.user.id).first()

  if user is not None:
    args = {
      'username': user.user.username,
      'phone': user.phone,
      'group': user.group.name,
      'is_control': user.is_control
    }
  return HttpResponse(json.dumps(args))


def login_view(request):
  args = {}
  post_data = json.loads(request.body.decode("utf-8"))
  username = post_data['username']
  password = post_data['password']

  if username and password:
    user = authenticate(username=username, password=password)
    if user is not None:
      login(request, user)
      user = Profile.objects.filter(user_id=user.id).first()
      if user is not None:
        args = {
          'username': user.user.username,
          'phone': user.phone,
          'group': user.group.name,
          'is_control': user.is_control
        }
      else:
        args['error'] = True
    else:
      args['error'] = True
  return HttpResponse(json.dumps(args))


def logout_view(request):
  args = {}
  logout(request)
  return JsonResponse(args)


def getListOfCity(request):
  cities = list(City.objects.all().values())
  return HttpResponse(json.dumps(cities))


def getListOfRank(request):
  ranks = list(Rank.objects.all().values())
  return HttpResponse(json.dumps(ranks))


def getListOfGroup(request):
  user = request.user
  groups = UserGroup.objects.all()
  if user.profile.is_control:
    groups = groups.filter(parent=None).order_by('position')
  if not user.profile.is_control:
    groups_user = user.profile.group.get_children()
    groups = groups.filter(pk__in=groups_user).order_by('position')
  return HttpResponse(json.dumps(list(groups.values())))


def getListOfPost(request):
  user = request.user
  if not user.profile.is_control:
    groups_user = user.profile.group.get_children()
    posts = UserPost.objects.filter(group_id__in=groups_user).order_by('group__position', 'position')
  return HttpResponse(json.dumps(list(posts.values())))


def setListOfPost(request):
  user = request.user
  data = json.loads(request.body)
  posts = data['data']
  list_id = []
  for elem in posts:
    post = UserPost.objects.filter(pk=elem['id']).first()
    group_id = elem['group_id'] if elem['group_id'] != 0 else user.group_id
    if post is not None:
      post.name = elem['name']
      post.group_id = group_id
      post.position = elem['position']
      post.save()
    else:
      post = UserPost.objects.create(
        name=elem['name'],
        group_id=group_id,
        position=elem['position'],
      )
    list_id.append(post.pk)

  groups = user.profile.group.get_children()
  UserPost.objects.filter(group_id__in=groups).exclude(pk__in=list_id).delete()
  return HttpResponse(json.dumps({'status': 'ok'}))


def getListOfPerson(request):
  user = request.user
  persons = UserForControl.objects.all().order_by('-is_military', 'name')

  if not user.profile.is_control:
    groups = user.profile.group.get_children()
    persons = persons.filter(group_id__in=groups)
  persons_mass = []
  for p in persons:
    group = p.group.get_main_parent() if user.profile.is_control else p.group
    persons_mass.append({
      'id': p.id,
      'name': p.name,
      'post_id': p.post_id,
      'group_id': group.id,
      'group_id__name': group.name,
      'rank_id': p.rank_id,
      'rank_id__name': p.rank.name if p.rank is not None else '',
      'is_military': p.is_military,
      'is_woman_with_children': p.is_woman_with_children,
      'city_id': p.city_id,
    })
  persons = persons_mass
  return HttpResponse(json.dumps(persons))


def setListOfPerson(request):
  user = request.user
  data = json.loads(request.body)
  persons = data['data']
  list_id = []

  for elem in persons:
    person = UserForControl.objects.filter(pk=elem['id']).first()
    rank_id = elem['rank_id'] if elem['rank_id'] != 0 else None
    city_id = elem['city_id'] if elem['city_id'] != 0 else None
    group_id = elem['group_id'] if elem['group_id'] != 0 else user.group_id
    post_id = elem['post_id'] if elem['post_id'] != 0 else None
    if person is not None:
      person.name = elem['name']
      person.rank_id = rank_id
      person.city_id = city_id
      person.group_id = group_id
      person.post_id = post_id
      person.is_woman_with_children = elem['is_woman_with_children']
      person.is_military = elem['is_military']
      person.save()
    else:
      person = UserForControl.objects.create(
        name=elem['name'],
        rank_id=rank_id,
        group_id=group_id,
        city_id=city_id,
        post_id=post_id,
        is_woman_with_children=elem['is_woman_with_children'],
        is_military=elem['is_military']
      )
    list_id.append(person.pk)

  groups = user.profile.group.get_children()
  UserForControl.objects.filter(group_id__in=groups).exclude(pk__in=list_id).delete()
  return HttpResponse(json.dumps({'status': 'ok'}))


def getListOfStatus(request):
  status = list(Status.objects.order_by('name').values())
  return HttpResponse(json.dumps(status))


def changePassword(request):
  user = request.user
  data = json.loads(request.body)
  password = data['password']
  user.set_password(password)
  user.save()
  return HttpResponse(json.dumps({}))


def setListOfReport(request):
  user = request.user
  data = json.loads(request.body)
  persons = data['data']
  date = data['date'].split('T')[0] if 'date' in data else None
  date_begin = data['date_begin'].split('T')[0] if 'date_begin' in data else None
  date_end = data['date_end'].split('T')[0] if 'date_end' in data else None
  if date is not None:
    list_id = []
    for person in persons:
      obj = DayData.objects.filter(date=date).filter(userForControl_id=person['id']).first()
      comment = person['comment'] if 'comment' in person else ''
      status = Status.objects.filter(pk=person['status_id']).first() if 'status_id' in person else None
      if obj is not None:
        obj.status = status
        obj.comment = comment
        obj.save()
      else:
        obj = DayData.objects.create(
          date=date,
          comment=comment,
          status=status,
          userForControl_id=person['id']
        )
      list_id.append(obj.pk)
    groups = user.profile.group.get_children()
    DayData.objects.filter(date=date).filter(userForControl_id__group_id__in=groups).exclude(pk__in=list_id).delete()
  if date_begin is not None and date_end is not None:
    for p in persons:
      date_list = date_end.split('-')
      date = datetime.datetime.date(datetime.datetime(int(date_list[0]), int(date_list[1]), int(p['date'])))
      person = DayData.objects.filter(userForControl_id=p['userForControl_id']).filter(date=date).first()
      if person is not None:
        person.status = Status.objects.filter(pk=p['status_id']).first()
        person.comment = p['comment'] if 'comment' in p else ''
        person.save()
      else:
        DayData.objects.create(
          status=Status.objects.filter(pk=p['status_id']).first(),
          comment=p['comment'] if 'comment' in p else '',
          date=date,
          userForControl=UserForControl.objects.filter(pk=p['userForControl_id']).first()
        )
  return HttpResponse(json.dumps({'ok': True}))


def setOneReport(request):
  data = json.loads(request.body)
  report = data['data']
  date = data['date'] if 'date' in data else None
  date_end = data['date_end'].split('T')[0] if 'date_end' in data and data['date_end'] is not None else None
  extraFields = data['extraFields'] if 'extraFields' in data else None
  comment = report['comment'] if 'comment' in report else ''
  status = Status.objects.filter(pk=report['status_id']).first() if 'status_id' in report else None

  if date is not None:
    date = date.split('-')
    date = datetime.date(int(date[0]), int(date[1]), int(date[2]))
    date_temp = date
    if date_end is not None:
      date_end = date_end.split('-')
      date_end = datetime.date(int(date_end[0]), int(date_end[1]), int(date_end[2]))
    else:
      date_end = date
    while date_end >= date:
      obj = DayData.objects.filter(date=date).filter(userForControl_id=report['userForControl_id']).first()
      if obj is not None:
        obj.status = status
        obj.save()
      else:
        obj = DayData.objects.create(
          date=date,
          status=status,
          userForControl_id=report['userForControl_id']
        )
      if date == date_temp:
        obj.comment = comment
        obj.save()
        if extraFields is not None:
          ExtraDataForDayData.objects.filter(data_id=obj.id).delete()
          for key in extraFields:
            ExtraDataForDayData.objects.create(data=obj, name=key, value=extraFields[key])
      date = date + datetime.timedelta(days=1)
  return HttpResponse(json.dumps({'ok': True}))


def getListOfReport(request):
  user = request.user
  data = json.loads(request.body)
  date = data['date'].split('T')[0] if 'date' in data else None
  date_begin = data['date_begin'].split('T')[0] if 'date_begin' in data else None
  date_end = data['date_end'].split('T')[0] if 'date_end' in data else None
  obj = DayData.objects.all()
  includeExtraFields = data['includeExtraFields'] if 'includeExtraFields' in data else None

  if date is not None:
    obj = obj.filter(date=date)
  if date_begin is not None and date_end is not None:
    obj = obj.filter(date__range=[date_begin, date_end])

  if not user.profile.is_control:
    groups = user.profile.group.get_children()
    obj = obj.filter(userForControl_id__group_id__in=groups)
  resp = []
  for o in obj:
    answer = {
      'id': o.id,
      'comment': o.comment,
      'status_id': o.status_id,
      'status_id__name': o.status.name if o.status is not None else '',
      'status_id__abbr': o.status.abbr if o.status is not None else '',
      'userForControl_id': o.userForControl_id,
      'date': o.get_date_day()
    }
    if includeExtraFields:
      dict = {}
      for el in ExtraDataForDayData.objects.filter(data_id=o.id):
        dict[el.name] = el.value
      answer['extraFields'] = dict
    resp.append(answer)
  return HttpResponse(json.dumps(resp))


def getExtraFieldsForStatus(request):
  data = json.loads(request.body)
  day_data_id = data['day_data_id'] if 'day_data_id' in data else None

  resp = {}
  if day_data_id is not None:
    for obj in ExtraDataForDayData.objects.filter(data_id=day_data_id):
      resp[obj.name] = obj.value
  return HttpResponse(json.dumps(resp))
