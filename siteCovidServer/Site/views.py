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
  persons = UserForControl.objects.all().order_by('group_id')

  if user.profile.is_control:
    persons = [{
      'id': p.id,
      'name': p.name,
      'group_id': p.group.get_main_parent().id,
      'group_id__name': p.group.get_main_parent().name
    } for p in persons]
  else:
    groups = user.profile.group.get_children()
    persons = persons.filter(group_id__in=groups)
    persons = list(persons.values(
      'id', 'group_id', 'group_id__name', 'name', 'rank_id', 'rank_id__name', 'is_military', 'is_woman_with_children',
      'city_id'
    ))
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


# TODO не сохранять всех пользователей с подразделений а только тех кто имеет статус
def setListOfReport(request):
  user = request.user
  data = json.loads(request.body)
  persons = data['data']
  date = data['date']
  date = date.split('T')[0]
  list_id = []
  for person in persons:
    obj = DayData.objects.filter(date=date).filter(userForControl_id=person['id']).first()
    comment = person['comment'] if 'comment' in person else ''
    status_id = person['status_id'] if 'status_id' in person else None
    if obj is not None:
      obj.status_id = status_id
      obj.comment = comment
      obj.save()
    else:
      obj = DayData.objects.create(
        date=date,
        comment=comment,
        status_id=status_id,
        userForControl_id=person['id']
      )
    list_id.append(obj.pk)
  groups = user.profile.group.get_children()
  DayData.objects.filter(date=date).filter(userForControl_id__group_id__in=groups).exclude(pk__in=list_id).delete()
  return HttpResponse(json.dumps({'ok': True}))


def getListOfReport(request):
  user = request.user
  data = json.loads(request.body)
  date = data['date'].split('T')[0]
  obj = DayData.objects.filter(date=date)
  if not user.profile.is_control:
    groups = user.profile.group.get_children()
    obj = obj.filter(userForControl_id__group_id__in=groups)
  obj = list(obj.values('comment', 'status_id', 'status_id__name', 'userForControl_id'))
  return HttpResponse(json.dumps(obj))
