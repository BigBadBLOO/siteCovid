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
  groups = list(UserGroup.objects.filter(parent=None).values())
  return HttpResponse(json.dumps(groups))


def getListOfPerson(request):
  user = request.user
  persons = UserForControl.objects.all().order_by('group_id').order_by('name')

  if not user.profile.is_control:
    groups = user.profile.group.get_children()
    persons = persons.filter(group_id__in=groups)
  persons_mass = []
  for p in persons:
    group = p.group.get_main_parent()
    persons_mass.append({
      'id': p.id,
      'name': p.name,
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
    if person is not None:
      person.name = elem['name']
      person.rank_id = rank_id
      person.city_id = city_id
      person.is_woman_with_children = elem['is_woman_with_children']
      person.is_military = elem['is_military']
      person.save()
    else:
      person = UserForControl.objects.create(
        name=elem['name'],
        rank_id=rank_id,
        group=user.profile.group,
        city_id=city_id,
        is_woman_with_children=elem['is_woman_with_children'],
        is_military=elem['is_military']
      )
    list_id.append(person.pk)

  groups = user.profile.group.get_children()
  UserForControl.objects.filter(group_id__in=groups).exclude(pk__in=list_id).delete()
  return HttpResponse(json.dumps({'status': 'ok'}))


def getListOfStatus(request):
  status = list(Status.objects.all().values())
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
        person.comment = p['comment']
        person.save()
      else:
        person = DayData.objects.create(
          status=Status.objects.filter(pk=p['status_id']).first(),
          comment=p['comment'],
          date=date,
          userForControl=UserForControl.objects.filter(pk=p['userForControl_id']).first()
        )
  return HttpResponse(json.dumps({'ok': True}))


def getListOfReport(request):
  user = request.user
  data = json.loads(request.body)
  date = data['date'].split('T')[0] if 'date' in data else None
  date_begin = data['date_begin'].split('T')[0] if 'date_begin' in data else None
  date_end = data['date_end'].split('T')[0] if 'date_end' in data else None
  obj = DayData.objects.all()

  if date is not None:
    obj = obj.filter(date=date)
  if date_begin is not None and date_end is not None:
    obj = obj.filter(date__range=[date_begin, date_end])

  if not user.profile.is_control:
    groups = user.profile.group.get_children()
    obj = obj.filter(userForControl_id__group_id__in=groups)
  resp = []
  for o in obj:
    resp.append({
      'comment': o.comment,
      'status_id': o.status_id,
      'status_id__name': o.status.name if o.status is not None else '',
      'userForControl_id': o.userForControl_id,
      'date': o.get_date_day()
    })
  # obj = list(obj.values('comment', 'status_id', 'status_id__name', 'userForControl_id', 'get_date()'))
  return HttpResponse(json.dumps(resp))
