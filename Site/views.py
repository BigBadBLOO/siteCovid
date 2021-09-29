from datetime import datetime, date, timedelta
import os
from random import random

import xlwt
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.conf import settings
from django_auth_ldap.backend import LDAPBackend, _LDAPUser

from Site.models import *
from Site.apps import *
from django.db.models import Q
import json

from django.template.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from xlwt import easyxf, Workbook

from siteCovidServer.settings import BASE_DIR


@csrf_exempt
def index(request):
    return render(request, 'index.html')


@csrf_exempt
def initUser(request):
    user = User.objects.filter(Q(id=request.user.id))
    groups = UserGroup.objects.all()

    user_profile(request.user)
    profile = []
    if not request.user.is_anonymous and request.user.profile is not None:
        profile = request.user.profile.user_for_work if request.user.profile.user_for_work is not None else request.user.profile
        profile = Profile.objects.filter(Q(pk=profile.id))

    profile_type = ProfileType.objects.filter(Q(profiletypeselect__profile__in=profile))
    delegation_user = request.user.profile.user_for_work
    if delegation_user:
        delegation_user = {
            'profile_id': delegation_user.id,
            'user_id': delegation_user.user.id,
            'username': delegation_user.user.first_name + ' ' + delegation_user.user.last_name,
            'other_user': list(Profile.objects.filter(Q(user_for_work__user_id=delegation_user.user.id)).values('id', 'user', 'user__last_name', 'user__first_name', 'user__username'))
        }

    delegations_user = Profile.objects.filter(group_id__in=request.user.profile.group.get_children())
    delegated_users = Profile.objects.filter(user_for_work__user_id=request.user.id)
    return HttpResponse(json.dumps({
        'user': list(user.values()),
        'user_profile': list(profile.values()),
        'delegation_user': delegation_user,
        'delegations_user': list(delegations_user.values('id', 'user', 'user__last_name', 'user__first_name', 'user__username')),
        'delegated_users': list(delegated_users.values('id', 'user', 'user__last_name', 'user__first_name', 'user__username')),
        'profile_type': list(profile_type.values()),
        'group': list(groups.values())
    }, default=my_convert_date))


@csrf_exempt
def getListOfGroup(request):
    groups = UserGroup.objects.all()
    return HttpResponse(json.dumps(list(groups.values())))


@csrf_exempt
def initMainInfo(request):
    ranks = Rank.objects.all()
    typeRanks = TypeRank.objects.all()
    holidays = Holidays.objects.all()
    posts = UserPost.objects.all()
    status = Status.objects.all()

    return HttpResponse(json.dumps({
        'ranks': list(ranks.values()),
        'typeRanks': list(typeRanks.values()),
        'posts': list(posts.values()),
        'holidays': list(holidays.values()),
        'status': list(status.values()),
    }, default=my_convert_date))


@csrf_exempt
def getListOfRank(request):
    ranks = Rank.objects.all()
    return HttpResponse(json.dumps(list(ranks.values())))


@csrf_exempt
def getListOfHolidays(request):
    holidays = Holidays.objects.all()
    return HttpResponse(json.dumps(list(holidays.values())))


@csrf_exempt
def getListOfPerson(request):
    user = User.objects.filter(id=request.user.id).first()
    result = []

    if user is not None and user.profile is not None and user.profile.group is not None:
        persons = UserForControl.objects.all()

        profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
        profile_type = ProfileType.objects.filter(Q(profiletypeselect__profile=profile))

        if profile_type.count() == 0:
            persons = persons.filter(Q(email__iexact=user.username + '@cnii.local'))
        if profile_type.filter(Q(action='get_all_user')).count() == 0:
            groups = profile.group.get_children()
            persons = persons.filter(Q(group_id__in=groups) | Q(real_group_id__in=groups))

        result = persons.values()

    return HttpResponse(json.dumps(list(result)))


@csrf_exempt
def getListOfAllPerson(request):
    persons = UserForControl.objects.all()
    return HttpResponse(json.dumps(list(persons.values())))


@csrf_exempt
def getListOfStatus(request):
    status = Status.objects.all()
    return HttpResponse(json.dumps(list(status.values())))


@csrf_exempt
def getListOfReport(request):
    extraDataForDayData = []

    user = request.user

    data = json.loads(request.body.decode("utf-8"))

    date_start = data['date'].split('T')[0] if 'date' in data else None
    with_disease = data['with_disease'] if 'with_disease' in data else False
    date_begin = data['date_begin'].split('T')[0] if 'date_begin' in data else None
    date_end = data['date_end'].split('T')[0] if 'date_end' in data else None
    includeExtraFields = data['includeExtraFields'] if 'includeExtraFields' in data else False

    obj = DayData.objects.exclude(status__id=-1).exclude(status__id=None)
    vaccine = Vaccine.objects.order_by('first_date', 'second_date', 'pk')
    antitela = Antitela.objects.filter(date__gte=date.today() - timedelta(days=183))
    corona_daydata = DayData.objects \
        .filter(Q(status__name='Коронавирус, стационарно') |
                Q(status__name='Коронавирус, амбулаторно')) \
        .filter(date__gte=date.today() - timedelta(days=183))

    if with_disease:
        obj = obj.filter(status__with_disease=True)
    if date_start is not None:
        obj = obj.filter(date=date_start)
        vaccine = vaccine.filter(first_date__lte=date_start)
    if date_begin is not None and date_end is not None:
        obj = obj.filter(date__range=[date_begin, date_end])
        if with_disease:
            date_begin = date_begin.split('-')
            date_begin = date(int(date_begin[0]), int(date_begin[1]), int(date_begin[2])) + timedelta(days=1)
            date_end = date_end.split('-')
            date_end = date(int(date_end[0]), int(date_end[1]), int(date_end[2]))
            vaccine = vaccine.filter(first_date__range=[date_begin, date_end])

    elif date_end is not None:
        obj = obj.filter(date__lte=date_end)
        vaccine = vaccine.filter(first_date__lte=date_end)

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(Q(profiletypeselect__profile=profile))

    if profile_type.count() == 0:
        obj = obj.filter(Q(userForControl__email__iexact=user.username + '@cnii.local'))
        vaccine = vaccine.filter(Q(userForControl__email__iexact=user.username + '@cnii.local'))
        antitela = antitela.filter(Q(userForControl__email__iexact=user.username + '@cnii.local'))
        corona_daydata = corona_daydata.filter(Q(userForControl__email__iexact=user.username + '@cnii.local'))

    if profile_type.filter(Q(action='get_all_user')).count() == 0:
        groups = profile.group.get_children()
        obj = obj.filter(Q(userForControl_id__group_id__in=groups) |
                         Q(userForControl__real_group_id__in=groups))

        vaccine = vaccine.filter(Q(userForControl_id__group_id__in=groups) |
                                 Q(userForControl__real_group_id__in=groups))

        antitela = antitela.filter(Q(userForControl_id__group_id__in=groups) |
                                   Q(userForControl__real_group_id__in=groups))
        corona_daydata = corona_daydata.filter(Q(userForControl_id__group_id__in=groups) |
                                               Q(userForControl__real_group_id__in=groups))

    if includeExtraFields:
        extraDataForDayData = list(ExtraDataForDayData.objects.filter(data__in=obj).values())

    return HttpResponse(json.dumps({
        'report': list(obj.order_by('date').values()),
        'extraDataForDayData': extraDataForDayData,
        'vaccine': list(vaccine.order_by('id').values()),
        'antitela': list(antitela.values()),
        'corona_daydata': list(corona_daydata.values())
    }, default=my_convert_date))


@csrf_exempt
def login_view(request):
    args = {}
    post_data = json.loads(request.body.decode("utf-8"))
    username = post_data['username']
    password = post_data['password']

    if username and password:
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            user_profile(request.user)
            args['refresh'] = True
        else:
            args['error'] = True
    return HttpResponse(json.dumps(args, default=my_convert_date))


@csrf_exempt
def logout_view(request):
    args = {}
    logout(request)
    return JsonResponse(args)


@csrf_exempt
def getListOfCity(request):
    cities = list(City.objects.order_by('name').values())
    return HttpResponse(json.dumps(cities))


@csrf_exempt
def getListOfPost(request):
    posts = list(UserPost.objects.all().values())
    return HttpResponse(json.dumps(posts))


@csrf_exempt
def setCountByGroup(request):
    user = request.user
    result = 0

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='listOfRecords') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        group_id = data['id']
        group_value = data['value']
        group_type = data['type']
        group = UserGroup.objects.filter(pk=group_id).first()
        if group is not None:
            if group_type == 1:
                group.countMilByGroup = group_value
            if group_type == 0:
                group.countByGroup = group_value
            group.save()
        result = group_value
    return HttpResponse(json.dumps(result))


@csrf_exempt
def setOneVaccine(request):
    user = request.user
    result = []

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='mainPageForCenter') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))

        _data = data['data']
        print(_data)
        user_id = _data['userForControl_id'] if 'userForControl_id' in _data else None
        id = _data['id'] if 'id' in _data else None
        remove = _data['remove'] if 'remove' in _data else None
        countComponent = _data['countComponent'] if 'countComponent' in _data else None
        first_date = _data['first_date'].split('T')[0] if 'first_date' in _data and _data[
            'first_date'] is not None else None
        second_date = _data['second_date'].split('T')[0] if 'second_date' in _data and _data[
            'second_date'] is not None else None
        comment = _data['comment'] if 'comment' in _data else ''

        if first_date is not None:
            first_date = first_date.split('-')
            first_date = date(int(first_date[0]), int(first_date[1]), int(first_date[2]))
        if second_date is not None:
            second_date = second_date.split('-')
            second_date = date(int(second_date[0]), int(second_date[1]), int(second_date[2]))

        if id is not None:
            vac = Vaccine.objects.filter(id=id)
            if remove is not None:
                vac.delete()
            else:
                if first_date is not None:

                    vac = vac.first()
                    vac.countComponent = countComponent
                    vac.first_date = first_date
                    vac.second_date = second_date
                    vac.comment = comment

                    vac.save()
        else:
            if first_date is not None:
                Vaccine.objects.create(
                    userForControl_id=user_id,
                    first_date=first_date,
                    second_date=second_date,
                    comment=comment
                )

        vaccine = Vaccine.objects.all()

        groups = profile.group.get_children()

        vaccine = vaccine.filter(
            Q(userForControl_id__group_id__in=groups) | Q(userForControl__real_group_id__in=groups))

        result = list(vaccine.order_by('id').values())

    return HttpResponse(json.dumps({
        'vaccine': result
    }, default=my_convert_date))


@csrf_exempt
def setOneAntitela(request):
    user = request.user
    result = []

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='mainPageForCenter') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        _data = data['data']

        user_id = _data['userForControl_id'] if 'userForControl_id' in _data else None
        id = _data['id'] if 'id' in _data else None
        remove = data['remove'] if 'remove' in data else None
        date_elem = _data['date'].split('T')[0] if 'date' in _data and _data['date'] is not None else None
        comment = _data['comment'] if 'comment' in _data else ''
        comment2 = _data['comment2'] if 'comment2' in _data else ''

        if date_elem is not None:
            date_elem = date_elem.split('-')
            date_elem = date(int(date_elem[0]), int(date_elem[1]), int(date_elem[2]))

        if id is not None:
            antitela = Antitela.objects.filter(id=id)
            if remove is not None:
                antitela.delete()
            else:
                if date_elem is not None:
                    antitela = antitela.first()
                    antitela.date = date_elem
                    antitela.comment = comment
                    antitela.comment2 = comment2
                    antitela.save()
        else:
            if date_elem is not None:
                Antitela.objects.create(
                    userForControl_id=user_id,
                    date=date_elem,
                    comment=comment,
                    comment2=comment2
                )

        antitela = Antitela.objects.filter(date__gte=date.today() - timedelta(days=183))

        groups = profile.group.get_children()

        antitela = antitela.filter(
            Q(userForControl_id__group_id__in=groups) | Q(userForControl__real_group_id__in=groups))

        result = list(antitela.values())

    return HttpResponse(json.dumps({
        'antitela': result
    }, default=my_convert_date))


@csrf_exempt
def setListOfPost(request):
    user = request.user
    # if user.profile.is_editor:
    #     data = json.loads(request.body.decode("utf-8"))
    #     posts = data['data']
    #     list_id = []
    #     for elem in posts:
    #         post = UserPost.objects.filter(pk=elem['id']).first()
    #         group_id = elem['group_id'] if elem['group_id'] != 0 else user.profile.group_id
    #         if post is not None:
    #             post.name = elem['name']
    #             post.group_id = group_id
    #             post.position = elem['position']
    #             post.save()
    #         else:
    #             post = UserPost.objects.create(
    #                 name=elem['name'],
    #                 group_id=group_id,
    #                 position=elem['position'],
    #             )
    #         list_id.append(post.pk)
    #
    #     UserPost.objects.exclude(pk__in=list_id).delete()
    return HttpResponse(json.dumps({'status': 'ok'}))


@csrf_exempt
def setListOfPerson(request):
    user = request.user
    result = []

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='listOfPerson') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        persons = data['data']
        list_wrong = []
        list_del_id = []

        for elem in persons:
            uni_name = True
            if elem.__contains__('is_worked'):
                person = UserForControl.objects.filter(pk=elem['id']).first()

                rank_id = elem['rank_id']
                city_id = elem['city_id']
                group_id = elem['group_id'] if elem['group_id'] is not None else profile.group_id
                real_group_id = elem['real_group_id'] if elem['real_group_id'] is not None else group_id
                post_id = elem['post_id']
                if person is not None:
                    if person.name != elem['name']:
                        uni_name = UserForControl.objects.filter(name=elem['name']).exclude(
                            pk=person.pk if person is not None else None).count() == 0
                    if uni_name:
                        person.name = elem['name']
                        person.email = elem['email']
                        # person.phone = elem['phone']
                        person.rank_id = rank_id
                        person.city_id = city_id
                        person.group_id = group_id
                        person.real_group_id = real_group_id
                        person.post_id = post_id
                        person.is_woman_with_children = elem['is_woman_with_children']
                        person.is_military = elem['is_military']
                        person.is_gender = elem['is_gender']
                        person.save()
                else:
                    uni_name = UserForControl.objects.filter(name=elem['name']).count() == 0
                    if uni_name:
                        person = UserForControl.objects.create(
                            name=elem['name'],
                            email=elem['email'],
                            # phone=elem['phone'],
                            rank_id=rank_id,
                            group_id=group_id,
                            real_group_id=real_group_id,
                            city_id=city_id,
                            post_id=post_id,
                            is_woman_with_children=elem['is_woman_with_children'],
                            is_military=elem['is_military'],
                            is_gender=elem['is_gender']
                        )
                if not uni_name:
                    list_wrong.append(person.pk)

            if elem.__contains__('is_deleted'):
                list_del_id.append(elem['id'])

        groups = profile.group.get_children()
        UserForControl.objects.filter(group_id__in=groups).filter(pk__in=list_del_id).delete()

        persons = UserForControl.objects.filter(Q(group_id__in=groups) | Q(real_group_id__in=groups))

        result = list(persons.values())
    return HttpResponse(json.dumps(result))


@csrf_exempt
def getNameStatus(request):
    data = json.loads(request.body.decode("utf-8"))
    person = UserForControl.objects.exclude(pk=data['id']).filter(name=data['name'])
    return HttpResponse(json.dumps(person.count() == 0))


@csrf_exempt
def getEmailStatus(request):
    data = json.loads(request.body.decode("utf-8"))
    person = UserForControl.objects.exclude(pk=data['id']).filter(email__iexact=data['email'])
    return HttpResponse(json.dumps(person.count() == 0))


@csrf_exempt
def changePassword(request):
    user = request.user
    data = json.loads(request.body.decode("utf-8"))
    password = data['password']
    user.set_password(password)
    user.save()
    return HttpResponse(json.dumps({}))


@csrf_exempt
def setListOfReport(request):
    user = request.user
    # if user.profile.is_editor:
    #     data = json.loads(request.body.decode("utf-8"))
    #     persons = data['data']
    #     date_start = data['date'].split('T')[0] if 'date' in data else None
    #     date_begin = data['date_begin'].split('T')[0] if 'date_begin' in data else None
    #     date_end = data['date_end'].split('T')[0] if 'date_end' in data else None
    #     if date_start is not None:
    #         list_id = []
    #         for person in persons:
    #             obj = DayData.objects.filter(date=date_start).filter(userForControl_id=person['id']).first()
    #             comment = person['comment'] if 'comment' in person else ''
    #             status = Status.objects.filter(pk=person['status_id']).first() if 'status_id' in person else None
    #             if obj is not None:
    #                 obj.status = status
    #                 obj.comment = comment
    #                 obj.save()
    #             else:
    #                 obj = DayData.objects.create(
    #                     date=date_start,
    #                     comment=comment,
    #                     status=status,
    #                     userForControl_id=person['id']
    #                 )
    #             list_id.append(obj.pk)
    #         groups = user.profile.group.get_children()
    #         DayData.objects.filter(date=date_start).filter(Q(userForControl_id__group_id__in=groups) |
    #                                                        Q(userForControl__real_group_id__in=groups)).exclude(
    #             pk__in=list_id).delete()
    #     if date_begin is not None and date_end is not None:
    #         for p in persons:
    #             date_list = date_end.split('-')
    #             date_start = date(int(date_list[0]), int(date_list[1]), int(p['date']))
    #             person = DayData.objects.filter(userForControl_id=p['userForControl_id']).filter(
    #                 date=date_start).first()
    #             if person is not None:
    #                 person.status = Status.objects.filter(pk=p['status_id']).first()
    #                 person.comment = p['comment'] if 'comment' in p else ''
    #                 person.save()
    #             else:
    #                 DayData.objects.create(
    #                     status=Status.objects.filter(pk=p['status_id']).first(),
    #                     comment=p['comment'] if 'comment' in p else '',
    #                     date=date_start,
    #                     userForControl=UserForControl.objects.filter(pk=p['userForControl_id']).first()
    #                 )
    return HttpResponse(json.dumps({'ok': True}))


@csrf_exempt
def setOneReport(request):
    user = request.user
    result = []

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='mainPageForCenter') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        report = data['data']
        date_start = data['date'] if 'date' in data else None
        date_end = data['date_end'].split('T')[0] if 'date_end' in data and data['date_end'] is not None else None
        extraFields = data['extraFields'] if 'extraFields' in data else None
        comment = report['comment'] if 'comment' in report else ''
        status = Status.objects.filter(pk=report['status_id']).first() if 'status_id' in report else None

        main_date_begin = data['main_date_begin'].split('T')[0] if 'main_date_begin' in data else None
        main_date_end = data['main_date_end'].split('T')[0] if 'main_date_end' in data else None

        if date_start is not None:
            date_start = date_start.split('-')
            date_start = date(int(date_start[0]), int(date_start[1]), int(date_start[2]))
            date_temp = date_start
            if date_end is not None:
                date_end = date_end.split('-')
                date_end = date(int(date_end[0]), int(date_end[1]), int(date_end[2]))
            else:
                date_end = date_start

            obj_global = DayData.objects.filter(userForControl_id=report['userForControl_id'])

            while date_end >= date_start:
                obj = obj_global.filter(date=date_start)
                ExtraDataForDayData.objects.filter(data__in=obj).exclude(name='fromDiseaseDate').delete()

                if status is None:
                    obj.delete()
                else:
                    obj = obj.first()
                    if obj is not None:
                        obj.status = status
                        obj.comment = comment
                        obj.save()
                    else:
                        obj = DayData.objects.create(
                            date=date_start,
                            status=status,
                            comment=comment,
                            userForControl_id=report['userForControl_id']
                        )

                    if date_start != date_temp:
                        ExtraDataForDayData.objects.create(data=obj, name='fromDiseaseDate',
                                                           value=date_temp.strftime("%Y-%m-%d"))
                    if extraFields is not None:
                        for key in extraFields:
                            if key != 't' or date_start == date_temp:
                                ExtraDataForDayData.objects.create(data=obj, name=key, value=extraFields[key])
                date_start = date_start + timedelta(days=1)

        day_data = DayData.objects.exclude(status__id=-1).exclude(status__id=None)
        if main_date_begin is not None and main_date_end is not None:
            day_data = day_data.filter(date__range=[main_date_begin, main_date_end])

        groups = profile.group.get_children()
        day_data = day_data.filter(Q(userForControl_id__group_id__in=groups) |
                                   Q(userForControl__real_group_id__in=groups))

        result = list(day_data.order_by('date').values())
    return HttpResponse(json.dumps({
        'report': result
    }, default=my_convert_date))


@csrf_exempt
def getExtraFieldsForStatus(request):
    resp = {}

    data = json.loads(request.body.decode("utf-8"))
    day_data_id = data['day_data_id'] if 'day_data_id' in data else None

    if day_data_id is not None:
        for obj in ExtraDataForDayData.objects.filter(data_id=day_data_id):
            resp[obj.name] = obj.value

    return HttpResponse(json.dumps(resp))


@csrf_exempt
def db_load(request):
    user = request.user

    # if user.profile.group.out:
    #
    #     is_error = False
    #
    #     my_file = request.FILES['file']
    #     des = FileSystemStorage()
    #     filename = my_convert_date(datetime.now()) + '.json'
    #
    #     des.save(settings.DB_ROOT + '/' + filename, my_file)
    #     f = open(settings.DB_ROOT + '/' + filename, 'r')
    #     in_data = f.read()
    #     f.close()
    #     os.remove(settings.DB_ROOT + '/' + filename)
    #
    #     if not is_error:
    #         users_list = []
    #         day_data_list = {}
    #
    #         in_data = json.loads(in_data)
    #
    #         for elem in in_data['user_for_control']:
    #             users_list.append(elem['id'])
    #             person_id = OutUserConnect.objects.filter(out_id=elem['id']).first()
    #
    #             person = person_id.user if person_id is not None else None
    #
    #             rank_id = elem['rank_id'] if elem['rank_id'] != 0 else None
    #             city_id = elem['city_id'] if elem['city_id'] != 0 else None
    #             group_id = elem['group_id'] if elem['group_id'] != 0 else user.profile.group_id
    #             real_group_id = elem['real_group_id'] if elem['real_group_id'] != 0 else group_id
    #             post_id = elem['post_id'] if elem['post_id'] != 0 else None
    #
    #             if person is not None:
    #                 person.name = elem['name']
    #                 person.email = elem['email']
    #                 person.rank_id = rank_id
    #                 person.city_id = city_id
    #                 person.group_id = group_id
    #                 person.real_group_id = real_group_id
    #                 person.post_id = post_id
    #                 person.is_woman_with_children = elem['is_woman_with_children']
    #                 person.is_military = elem['is_military']
    #                 person.save()
    #
    #                 person_id.delete()
    #             else:
    #                 person = UserForControl.objects.create(
    #                     name=elem['name'],
    #                     email=elem['email'],
    #                     rank_id=rank_id,
    #                     group_id=group_id,
    #                     real_group_id=real_group_id,
    #                     city_id=city_id,
    #                     post_id=post_id,
    #                     is_woman_with_children=elem['is_woman_with_children'],
    #                     is_military=elem['is_military']
    #                 )
    #
    #             OutUserConnect.objects.create(
    #                 user_id=person.id,
    #                 out_id=elem['id']
    #             )
    #
    #         out_users_list_del = OutUserConnect.objects.exclude(out_id__in=users_list)
    #         user_for_control_list_del = UserForControl.objects.filter(
    #             pk__in=out_users_list_del.values_list('user__pk', flat=True))
    #
    #         out_users_list_del.delete()
    #         user_for_control_list_del.delete()
    #
    #         DayData.objects.filter(
    #             userForControl__pk__in=OutUserConnect.objects.values_list('user__pk', flat=True)).delete()
    #
    #         for elem in in_data['day_data']:
    #             person_id = OutUserConnect.objects.filter(out_id=elem['userForControl_id']).first()
    #             person = person_id.user if person_id is not None else None
    #             if person is not None:
    #                 date_start = elem['date'].split('-')
    #                 date_start = date(int(date_start[0]), int(date_start[1]), int(date_start[2]))
    #                 day_data = DayData.objects.create(
    #                     userForControl_id=person.id,
    #                     status_id=elem['status_id'],
    #                     comment=elem['comment'],
    #                     date=date_start
    #                 )
    #                 day_data_list[elem['id']] = day_data.pk
    #
    #         for elem in in_data['extra_data']:
    #             day_data_id = day_data_list[elem['data_id']]
    #             if True:
    #                 ExtraDataForDayData.objects.create(
    #                     data_id=day_data_id,
    #                     name=elem['name'],
    #                     value=elem['value']
    #                 )

    return HttpResponse(json.dumps({'status': 'ok'}))


@csrf_exempt
def db_dump(request):
    user = request.user
    args = {}
    # if not user.profile.group.out:
    #
    #     is_error = False
    #
    #     user_for_control = UserForControl.objects
    #     day_data = DayData.objects
    #     extra_data = ExtraDataForDayData.objects
    #
    #     filename = my_convert_date(datetime.now()) + '.json'
    #     try:
    #         user_for_control = user_for_control.filter(group__pk=user.profile.group.pk)
    #         day_data = day_data.filter(userForControl__pk__in=user_for_control.values_list('pk', flat=True))
    #         extra_data = extra_data.filter(data__pk__in=day_data.values_list('pk', flat=True))
    #
    #         output = open(settings.DB_ROOT + '/' + filename, 'w')
    #         out_data = {
    #             'user_for_control': list(user_for_control.values()),
    #             'day_data': list(day_data.values()),
    #             'extra_data': list(extra_data.values())
    #         }
    #         output.write(json.dumps(out_data, default=my_convert_date))
    #         output.close()
    #     except Exception as e:
    #         is_error = True
    #         print(e)
    #
    #     args = {'is_error': is_error, 'filename': settings.DB_URL + filename}
    return HttpResponse(json.dumps(args))


@csrf_exempt
def test(request):
    is_control = Profile.objects.filter(Q(is_control=True))
    is_duty = Profile.objects.filter(Q(is_duty=True))
    is_duty_control = Profile.objects.filter(Q(is_duty_control=True))
    is_editor = Profile.objects.filter(Q(is_editor=True))

    for_control = ProfileType.objects.filter(Q(name_in_ldap='main') | Q(name_in_ldap='entering') |
                                             Q(name_in_ldap='report') | Q(name_in_ldap='get_all_user'))
    for_duty = ProfileType.objects.filter(Q(name_in_ldap='get_all_user') | Q(name_in_ldap='main') |
                                          Q(name_in_ldap='duty_control'))
    for_duty_control = ProfileType.objects.filter(Q(name_in_ldap='main') | Q(name_in_ldap='duty_edit'))
    for_editor = ProfileType.objects.filter(Q(name_in_ldap='main_edit') | Q(name_in_ldap='person_edit') |
                                            Q(name_in_ldap='records_edit') | Q(name_in_ldap='duty') |
                                            Q(name_in_ldap='entering') | Q(name_in_ldap='report') |
                                            Q(name_in_ldap='overtime'))

    ProfileTypeSelect.objects.all().delete()
    for i in is_control:
        # ProfileTypeSelect.objects.filter(Q(profile=i)).delete()
        for f in for_control:
            ProfileTypeSelect.objects.create(
                profile=i,
                type=f
            )
    for i in is_duty:
        # ProfileTypeSelect.objects.filter(Q(profile=i)).delete()
        for f in for_duty:
            ProfileTypeSelect.objects.create(
                profile=i,
                type=f
            )
    for i in is_duty_control:
        # ProfileTypeSelect.objects.filter(Q(profile=i)).delete()
        for f in for_duty_control:
            ProfileTypeSelect.objects.create(
                profile=i,
                type=f
            )
    for i in is_editor:
        # ProfileTypeSelect.objects.filter(Q(profile=i)).delete()
        for f in for_editor:
            ProfileTypeSelect.objects.create(
                profile=i,
                type=f
            )

    return HttpResponse(json.dumps({}))


@csrf_exempt
def getDutyInfo(request):
    user = request.user
    response = {}

    data = json.loads(request.body.decode("utf-8"))
    data = data['data']
    date_start = data['date'].split('T')[0] if 'date' in data else None
    response = {
        'policeman': 0,
        # 'patrol2': 0,
        'policeman_skip': [],
        # 'patrol2_skip': [],
        'nameByDay': {},
        'prev_nameByDay': {},
        'countDutyInHolidays': list(CountDutyInHolidays.objects.all().values())
    }

    if date_start is not None:
        date_start = date_start.split('-')
        date_start = date(int(date_start[0]), int(date_start[1]), int(date_start[2]))
        prev_month = date_start.month - 1
        prev_year = date_start.year
        if prev_month == 0:
            prev_month = 12
            prev_year = date_start.year - 1

        prev_duty = DutyByMonth.objects.filter(date__month=prev_month).filter(date__year=prev_year).first()
        if prev_duty:
            response["prev_nameByDay"] = json.loads(prev_duty.nameByDay)

        duty = DutyByMonth.objects.filter(date__month=date_start.month).filter(date__year=date_start.year).first()

        if duty is not None:
            response['policeman'] = duty.policeman
            # response['patrol2'] = duty.patrol2
            response['policeman_skip'] = json.loads(duty.policeman_skip)
            # response['patrol2_skip'] = json.loads(duty.patrol2_skip)
            response['nameByDay'] = json.loads(duty.nameByDay)

            response['zsspdOfDuty'] = duty.zsspdOfDuty
            response['corOfDuty'] = duty.corOfDuty
            response['warehouseOfDuty'] = duty.warehouseOfDuty
            response['buildingOfDuty'] = duty.buildingOfDuty

            if len(duty.personArray) > 2:
                response['personArray'] = json.loads(duty.personArray)
    return HttpResponse(json.dumps(response))


@csrf_exempt
def setDutyInfo(request):
    user = request.user

    data = json.loads(request.body.decode("utf-8"))
    data = data['data']
    date_start = data['date'].split('T')[0] if 'date' in data else None
    if date_start is not None:
        date_start = date_start.split('-')
        date_start = date(int(date_start[0]), int(date_start[1]), int(date_start[2]))
        duty = DutyByMonth.objects.filter(date__month=date_start.month).filter(date__year=date_start.year).first()
        policeman = data['policeman'] if 'policeman' in data else 0

        zsspdOfDuty = data['zsspdOfDuty'] if 'zsspdOfDuty' in data else 0
        corOfDuty = data['corOfDuty'] if 'corOfDuty' in data else 0
        warehouseOfDuty = data['warehouseOfDuty'] if 'warehouseOfDuty' in data else 0
        buildingOfDuty = data['buildingOfDuty'] if 'buildingOfDuty' in data else 0
        # patrol2 = data['patrol2'] if 'patrol2' in data else 0
        policeman_skip = json.dumps(data['policeman_skip']) if 'policeman_skip' in data else []
        # patrol2_skip = json.dumps(data['patrol2_skip']) if 'patrol2_skip' in data else []

        personArray = json.dumps(data['personArray']) if 'personArray' in data else {}

        if duty is not None:
            nameByDay = data['nameByDay'] if 'nameByDay' in data else {}
            profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
            profile_type = ProfileType.objects.filter(
                Q(profiletypeselect__profile=profile) & Q(page='listOfDuty') & Q(action='edit'))
            if profile_type.count() != 0:
                prev_nameByDay = json.loads(duty.nameByDay)

                for type in prev_nameByDay.keys():
                    for day in prev_nameByDay[type].keys():
                        prev_data = prev_nameByDay[type][day]
                        curr_data = nameByDay[type][day]
                        if 'group' in prev_data and prev_data['group'] == user.profile.group.name:
                            if 'name' in curr_data:
                                prev_data['name'] = curr_data['name']
                                prev_data['rank'] = curr_data['rank']
                nameByDay = prev_nameByDay
            duty.policeman = policeman
            duty.zsspdOfDuty = zsspdOfDuty
            duty.corOfDuty = corOfDuty
            duty.warehouseOfDuty = warehouseOfDuty
            duty.buildingOfDuty = buildingOfDuty
            # duty.patrol2 = patrol2
            duty.policeman_skip = policeman_skip
            # duty.patrol2_skip = patrol2_skip
            duty.nameByDay = json.dumps(nameByDay)
            duty.personArray = personArray
            duty.save()
        else:
            nameByDay = json.dumps(data['nameByDay']) if 'nameByDay' in data else {}
            DutyByMonth.objects.create(date=date_start, policeman=policeman, zsspdOfDuty=zsspdOfDuty,
                                       corOfDuty=corOfDuty, buildingOfDuty=buildingOfDuty,
                                       warehouseOfDuty=warehouseOfDuty, policeman_skip=policeman_skip,
                                       nameByDay=nameByDay)

        countDutyInHolidays = data['countDutyInHolidays'] if 'countDutyInHolidays' in data else {}
        for dutyInHoliday in countDutyInHolidays:
            dutyByGroup = CountDutyInHolidays.objects.filter(type=dutyInHoliday['type']).filter(
                group_id=dutyInHoliday['group_id']).first()
            if dutyByGroup is None:
                dutyByGroup = CountDutyInHolidays.objects.create(type=dutyInHoliday['type'],
                                                                 group_id=dutyInHoliday['group_id'])
            dutyByGroup.count_in_holiday = dutyInHoliday['count_in_holiday']
            dutyByGroup.count_in_weekend = dutyInHoliday['count_in_weekend']
            dutyByGroup.save()
    return HttpResponse(json.dumps({}))


@csrf_exempt
def setPersonStatusByDuty(request):
    user = request.user
    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='listOfDuty') & Q(action='control'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        data = data['data']
        date_start = data['date'].split('T')[0] if 'date' in data else None
        arrWithTypes = {
            'dch_arr': 'Дежурный по части',
            'pdch_arr': 'Помошник дежурного по части',
            'pdch2_arr': 'Второй помошник дежурного по части',
            'pdch3_arr': 'Третий помошник дежурного по части',
            'pdch4_arr': 'Четвертый помошник дежурного по части',
            'policeman_arr': 'Дежурный по военной комендатуре',
            'controlDuty_arr': 'Контролирующий распрорядка дня'
        }

        if date_start is not None:
            date_start = date_start.split('-')

            clear_date_start = date(int(date_start[0]), int(date_start[1]), 1)
            clear_date_end = date(int(date_start[0]), int(date_start[1]) + 1, 1) - timedelta(days=1)
            DayData.objects.filter(Q(manual=False) & Q(date__range=[clear_date_start, clear_date_end])).delete()
            duty = DutyByMonth.objects.filter(date__month=clear_date_start.month).filter(date__year=clear_date_start.year).first()
            nameByDay = {}
            if duty is not None:
                nameByDay = json.loads(duty.nameByDay)

            for type in nameByDay:
                for day in nameByDay[type]:
                    if int(day) > 0:
                        if 'name' in nameByDay[type][day] and 'rank' in nameByDay[type][day]:
                            date_arr = date(int(date_start[0]), int(date_start[1]), int(day))
                            date_arr = [date_arr, date_arr + timedelta(days=1)]
                            comment = arrWithTypes[type]
                            name = nameByDay[type][day]['name']
                            rank = nameByDay[type][day]['rank']
                            userForControl = UserForControl.objects.filter(name=name).filter(rank__name=rank).first()
                            status = Status.objects.filter(name=arrWithTypes[type]).first()
                            if userForControl is not None:
                                for date_arr_elem in date_arr:
                                    # day_data = DayData.objects.filter(date=date_arr_elem).filter(status=status).first()
                                    # if dayData is None:
                                    dayData = DayData.objects.create(date=date_arr_elem, comment=comment,
                                                           userForControl=userForControl,
                                                           status=status, manual=False)
                                    # else:
                                    #     dayData.userForControl = userForControl
                                    #     dayData.status = status
                                    #     dayData.manual = False
                                    #     dayData.save()
    return HttpResponse(json.dumps({}))


@csrf_exempt
def downloadDutyExcel(request):
    data = json.loads(request.body.decode("utf-8"))
    data = data['data']
    date_client = data['date'].split('T')[0] if 'date' in data else None

    if date_client is not None:
        date_client = date_client.split('-')
    else:
        date_client = for_date(date.today()).split('-')

    month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь',
             'декабрь']
    month_vp = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
                'ноября', 'декабря']

    # style
    style = 'font: name Calibri, height 220;align: wrap 1, shrink_to_fit 1;'
    borders = 'borders: left thin, right thin, top thin, bottom thin;'
    align_center = 'align: horiz center, vert center;'
    text_bold = 'font: bold 1;'

    head_row_color = 'pattern: pattern solid, fore_colour light_gray;'
    num_row_color = 'pattern: pattern solid, fore_colour light_red;'
    alert_by_5 = 'pattern: pattern solid, fore_colour alert_by_5;'
    alert_by_10 = 'pattern: pattern solid, fore_colour alert_by_10;'

    book = Workbook()

    xlwt.add_palette_colour("light_red", 0x21)
    xlwt.add_palette_colour("light_gray", 0x22)

    xlwt.add_palette_colour("alert_by_5", 0x25)
    xlwt.add_palette_colour("alert_by_10", 0x26)

    book.set_colour_RGB(0x21, 242, 220, 219)
    book.set_colour_RGB(0x22, 242, 242, 242)

    book.set_colour_RGB(0x25, 255, 255, 0)
    book.set_colour_RGB(0x26, 255, 0, 0)

    sheet = book.add_sheet('на 1 ' + month_vp[int(date_client[1]) - 1], cell_overwrite_ok=True)

    sheet.row(0).height = 34 * 20

    col_width = [12, 45, 45, 45, 45, 45, 45, 45]

    for i in range(0, len(col_width)):
        sheet.col(i).width = col_width[i] * 100

    sheet.write(0, 0, 'Дата', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 1, 'ДЧ', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 2, '1 ПДЧ', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 3, '2 ПДЧ', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 4, '3 ПДЧ', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 5, '4 ПДЧ', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 6, 'ВК', easyxf(style + borders + head_row_color + align_center))
    sheet.write(0, 7, 'КРД', easyxf(style + borders + head_row_color + align_center))

    row_counter = 1
    cell_style = easyxf(style + borders + align_center)

    start_date = date(int(date_client[0]), int(date_client[1]), 1) - timedelta(days=1)
    stop_date = date(int(date_client[0]), int(date_client[1]) + 1, 1) - timedelta(days=1)

    people_list = DayData.objects.filter(Q(manual=False))

    dutyByMonth = DutyByMonth.objects.filter(Q(date__gte=start_date) & Q(date__lte=stop_date)).first()
    nameByDay = {}
    if dutyByMonth is not None:
        nameByDay = json.loads(dutyByMonth.nameByDay)
    for i in range(1, stop_date.day + 1):
        # prev_date = start_date + timedelta(days=(i - 1))
        # cur_date = start_date + timedelta(days=i)
        sheet.row(i).height = 34 * 20
        sheet.write(row_counter, 0, i, cell_style)

        # prev_date_people = people_list.filter(Q(date=prev_date))
        # cur_date_people = people_list.filter(Q(date=cur_date))

        # prev_date_dch = prev_date_people.filter(Q(status__name='Дежурный по части')).values_list('userForControl_id', flat=True)
        # prev_date_pdch = prev_date_people.filter(Q(status__name='Помошник дежурного по части')).values_list('userForControl_id', flat=True)
        # prev_date_pdch2 = prev_date_people.filter(Q(status__name='Второй помошник дежурного по части')).values_list('userForControl_id', flat=True)
        # prev_date_pdch3 = prev_date_people.filter(Q(status__name='Третий помошник дежурного по части')).values_list('userForControl_id', flat=True)
        # prev_date_pdch4 = prev_date_people.filter(Q(status__name='Четвертый помошник дежурного по части')).values_list('userForControl_id', flat=True)
        # prev_date_policeman = prev_date_people.filter(Q(status__name='Дежурный по военной комендатуре')).values_list('userForControl_id', flat=True)
        # prev_date_control = prev_date_people.filter(Q(status__name='Контролирующий распрорядка дня')).values_list('userForControl_id', flat=True)
        #
        #
        # cur_date_dch = cur_date_people.filter(Q(status__name='Дежурный по части')).exclude(Q(userForControl_id__in=prev_date_dch)).first()
        # cur_date_pdch = cur_date_people.filter(Q(status__name='Помошник дежурного по части')).exclude(Q(userForControl_id__in=prev_date_pdch)).first()
        # cur_date_pdch2 = cur_date_people.filter(Q(status__name='Второй помошник дежурного по части')).exclude(Q(userForControl_id__in=prev_date_pdch2)).first()
        # cur_date_pdch3 = cur_date_people.filter(Q(status__name='Третий помошник дежурного по части')).exclude(Q(userForControl_id__in=prev_date_pdch3)).first()
        # cur_date_pdch4 = cur_date_people.filter(Q(status__name='Четвертый помошник дежурного по части')).exclude(Q(userForControl_id__in=prev_date_pdch4)).first()
        # cur_date_policeman = cur_date_people.filter(Q(status__name='Дежурный по военной комендатуре')).exclude(Q(userForControl_id__in=prev_date_policeman)).first()
        # cur_date_control = cur_date_people.filter(Q(status__name='Контролирующий распрорядка дня')).exclude(Q(userForControl_id__in=prev_date_control)).first()

        date_dch = nameByDay['dch_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['dch_arr'][str(i)]['name'] \
            if 'name' in nameByDay['dch_arr'][str(i)] else nameByDay['dch_arr'][str(i)]['group'] \
            if 'group' in nameByDay['dch_arr'][str(i)] else ''
        date_pdch = nameByDay['pdch_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['pdch_arr'][str(i)]['name'] \
            if 'name' in nameByDay['pdch_arr'][str(i)] else nameByDay['pdch_arr'][str(i)]['group'] \
            if 'group' in nameByDay['pdch_arr'][str(i)] else ''
        date_pdch2 = nameByDay['pdch2_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['pdch2_arr'][str(i)]['name'] \
            if 'name' in nameByDay['pdch2_arr'][str(i)] else nameByDay['pdch2_arr'][str(i)]['group'] \
            if 'group' in nameByDay['pdch2_arr'][str(i)] else ''
        date_pdch3 = nameByDay['pdch3_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['pdch3_arr'][str(i)]['name'] \
            if 'name' in nameByDay['pdch3_arr'][str(i)] else nameByDay['pdch3_arr'][str(i)]['group'] \
            if 'group' in nameByDay['pdch3_arr'][str(i)] else '-'
        date_pdch4 = nameByDay['pdch4_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['pdch4_arr'][str(i)]['name'] \
            if 'name' in nameByDay['pdch4_arr'][str(i)] else nameByDay['pdch4_arr'][str(i)]['group'] \
            if 'group' in nameByDay['pdch4_arr'][str(i)] else ''
        date_policeman = nameByDay['policeman_arr'][str(i)]['rank'].lower() + '\n' + nameByDay['policeman_arr'][str(i)][
            'name'] \
            if 'name' in nameByDay['policeman_arr'][str(i)] else nameByDay['policeman_arr'][str(i)]['group'] \
            if 'group' in nameByDay['policeman_arr'][str(i)] else ''
        date_control = nameByDay['controlDuty_arr'][str(i)]['rank'].lower() + '\n' + \
                       nameByDay['controlDuty_arr'][str(i)]['name'] \
            if 'name' in nameByDay['controlDuty_arr'][str(i)] else nameByDay['controlDuty_arr'][str(i)]['group'] \
            if 'group' in nameByDay['controlDuty_arr'][str(i)] else ''

        sheet.write(row_counter, 1, date_dch, cell_style)
        sheet.write(row_counter, 2, date_pdch, cell_style)
        sheet.write(row_counter, 3, date_pdch2, cell_style)
        sheet.write(row_counter, 4, date_pdch3, cell_style)
        sheet.write(row_counter, 5, date_pdch4, cell_style)
        sheet.write(row_counter, 6, date_policeman, cell_style)
        sheet.write(row_counter, 7, date_control, cell_style)

        # if cur_date_pdch is not None and cur_date_pdch.userForControl is not None:
        #     user_rank = cur_date_pdch.userForControl.rank.name + '\n' if cur_date_pdch.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 2, user_rank + cur_date_pdch.userForControl.name, cell_style)
        # else:
        #     sheet.write(row_counter, 2, '', cell_style)
        #
        # if cur_date_pdch2 is not None and cur_date_pdch2.userForControl is not None:
        #     user_rank = cur_date_pdch2.userForControl.rank.name + '\n' if cur_date_pdch2.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 3, user_rank + cur_date_pdch2.userForControl.name, cell_style)
        # else:
        #     sheet.write(row_counter, 3, '', cell_style)
        #
        # if cur_date_pdch3 is not None and cur_date_pdch3.userForControl is not None:
        #     user_rank = cur_date_pdch3.userForControl.rank.name + '\n' if cur_date_pdch3.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 4, user_rank + cur_date_pdch3.userForControl.name, cell_style)
        # else:
        #     sheet.write(row_counter, 4, '', cell_style)
        #
        # if cur_date_pdch4 is not None and cur_date_pdch4.userForControl is not None:
        #     user_rank = cur_date_pdch4.userForControl.rank.name + '\n' if cur_date_pdch4.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 5, user_rank + cur_date_pdch4.userForControl.name, cell_style)
        # else:
        #     sheet.write(row_counter, 5, '', cell_style)
        #
        # if cur_date_policeman is not None and cur_date_policeman.userForControl is not None:
        #     user_rank = cur_date_policeman.userForControl.rank.name + '\n' if cur_date_policeman.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 6, user_rank + cur_date_policeman.userForControl.name, cell_style)
        # else:
        #     sheet.write(row_counter, 6, '', cell_style)
        #
        # if cur_date_control is not None and cur_date_control.userForControl is not None:
        #     user_rank = cur_date_control.userForControl.rank.name + '\n' if cur_date_control.userForControl is not None else ''
        #
        #     sheet.write(row_counter, 7, user_rank + cur_date_control.userForControl.name, cell_style)
        # else:
        #     #TODO write user group
        #     sheet.write(row_counter, 7, '', cell_style)

        row_counter = row_counter + 1

    for i in range(0, row_counter):
        sheet.row(i).height_mismatch = True

    file_name = '/uploads/xls/' + date_client[2] + '.' + date_client[1] + '.' + date_client[0] + '.xls'
    book.save(BASE_DIR + file_name)
    return HttpResponse(json.dumps({'xls': file_name}))


@csrf_exempt
def getOvertime(request):
    user = request.user
    response = {}

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(Q(profiletypeselect__profile=profile) & Q(page='overtime'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        date = data['date'].split('T')[0] if 'date' in data else None
        if date is not None:
            date = date.split('-')
            # date = date(int(date[0]), int(date[1]), int(date[2]))
            overtime = Overtime.objects.filter(date__month=date[1], date__year=date[0]).all()

            if profile_type.filter(Q(action='get_all_user')).count() == 0:
                groups = profile.group.get_children()
                overtime = overtime.filter(Q(user__group_id__in=groups) | Q(user__real_group_id__in=groups))

            response['overtime'] = list(overtime.values())

    return HttpResponse(json.dumps(response, default=my_convert_date))


@csrf_exempt
def setOvertime(request):
    user = request.user

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile) & Q(page='overtime') & Q(action='edit'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        date_client = data['date'].split('T')[0] if 'date' in data else None
        if date_client is not None:
            date_split = date_client.split('-')
            date_normal = date(int(date_split[0]), int(date_split[1]), int(date_split[2]))
            overtime = data['overtime']
            groups = profile.group.get_children()

            Overtime.objects.filter(date__month=date_split[1], date__year=date_split[0],
                                    user__group_id__in=groups).delete()
            for overTime in overtime:
                duty_total = (float(overTime['duty_workday_hours']) + float(overTime['duty_weekends_hours'])) / 8
                month_duty_total = duty_total + float(overTime['without_restrictions_total']) + \
                                   float(overTime['dcoo_total']) + float(overTime['other_total'])
                month_total = month_duty_total - float(overTime['realize_duty_workday']) - \
                              float(overTime['realize_duty_holiday']) - float(overTime['realize_duty_by_money'])
                total_overtime = round(month_total + float(overTime['total_overtime_last_month']), 1)
                Overtime.objects.create(
                    date=date_normal,
                    user_id=overTime['user_id'],
                    duty_workday_count=overTime['duty_workday_count'],
                    duty_workday_hours=overTime['duty_workday_hours'],
                    duty_weekends_count=overTime['duty_weekends_count'],
                    duty_weekends_hours=overTime['duty_weekends_hours'],
                    without_restrictions_count=overTime['without_restrictions_count'],
                    without_restrictions_total=overTime['without_restrictions_total'],
                    dcoo_count=overTime['dcoo_count'],
                    dcoo_total=overTime['dcoo_total'],
                    other_hours=overTime['other_hours'],
                    other_total=overTime['other_total'],
                    realize_duty_workday=overTime['realize_duty_workday'],
                    realize_duty_holiday=overTime['realize_duty_holiday'],
                    realize_duty_by_money=overTime['realize_duty_by_money'],
                    total_overtime_last_month=overTime['total_overtime_last_month'],
                    total_overtime=total_overtime,
                )
    return HttpResponse(json.dumps({'status': 'ok'}))


@csrf_exempt
def request_overtime(request):
    user = request.user
    file_name = ''

    profile = user.profile.user_for_work if user.profile.user_for_work is not None else user.profile
    profile_type = ProfileType.objects.filter(Q(profiletypeselect__profile=profile) & Q(page='overtime'))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))

        date_client = data['date'].split('T')[0] if 'date' in data else None

        if date_client is not None:
            date_client = date_client.split('-')
        else:
            date_client = for_date(date.today()).split('-')

        month = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь',
                 'ноябрь',
                 'декабрь']
        month_vp = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября',
                    'ноября', 'декабря']

        # style

        style = 'font: name Calibri, height 220;align: wrap 1, shrink_to_fit 1;'
        borders = 'borders: left thin, right thin, top thin, bottom thin;'
        align_center = 'align: horiz center, vert center;'
        text_bold = 'font: bold 1;'

        head_row_color = 'pattern: pattern solid, fore_colour light_gray;'
        num_row_color = 'pattern: pattern solid, fore_colour light_red;'
        alert_by_5 = 'pattern: pattern solid, fore_colour alert_by_5;'
        alert_by_10 = 'pattern: pattern solid, fore_colour alert_by_10;'

        book = Workbook()

        xlwt.add_palette_colour("light_red", 0x21)
        xlwt.add_palette_colour("light_gray", 0x22)

        xlwt.add_palette_colour("alert_by_5", 0x25)
        xlwt.add_palette_colour("alert_by_10", 0x26)

        book.set_colour_RGB(0x21, 242, 220, 219)
        book.set_colour_RGB(0x22, 242, 242, 242)

        book.set_colour_RGB(0x25, 255, 255, 0)
        book.set_colour_RGB(0x26, 255, 0, 0)

        sheet = book.add_sheet('на 1 ' + month_vp[int(date_client[1])], cell_overwrite_ok=True)

        sheet.row(1).height = 54 * 20
        sheet.row(8).height = 31 * 20
        sheet.row(10).height = 31 * 20
        sheet.row(12).height = 31 * 20
        sheet.row(13).height = 45 * 20
        sheet.row(15).height = 30 * 20

        col_width = [12, 45, 45, 38, 38, 16, 19, 19, 19, 25, 30, 30, 20, 22, 18, 20, 26, 20, 24, 24, 25, 30, 35]

        for i in range(0, len(col_width)):
            sheet.col(i).width = col_width[i] * 100

        sheet.write_merge(1, 1, 0, 22,
                          'Седения\nо количестве дополнительных суток отдыха, выплатах денежной компенсации вместо предоставления дополнительных суток отдыха, присоединенных к основному отпуску личному составу войсковой части 51105\nза '
                          + month[int(date_client[1]) - 1]
                          + ' '
                          + date_client[0]
                          + ' года', easyxf(style + align_center + text_bold))

        sheet.write_merge(3, 3, 0, 5, 'Порядок ведения:', easyxf(style + text_bold))

        sheet.write_merge(4, 4, 0, 22,
                          '1. Сведения заполняются по состоянию на последний день текущего месяца и представляются в Центр управления войсковой части 31600 по каналам ЗССПД к 3 числу месяца следующего за отчетным',
                          easyxf(style))
        sheet.write_merge(5, 5, 0, 22, '2. В столбцы 2-5 включаются все военнослужащие воинской части',
                          easyxf(style))
        sheet.write_merge(6, 6, 0, 22,
                          '3. Столбцы 7, 9, 10, 12, 14, 16, 17, 21, 23  не подлежат форматированию, заполняются автоматически в соответсвии с расчетными формулами',
                          easyxf(style))
        sheet.write_merge(7, 7, 0, 22,
                          '4. Столбцы 6, 8, 11, 13, 15 (в выходные дни), 18, 19, 20 заполняются на основании приказов командира воинской части',
                          easyxf(style))
        sheet.write_merge(8, 8, 0, 22,
                          '5. Столбец 15 заполняется на основании ежесуточных списков военнослужащих, привлекаемых к исполнению обязанностей сверх установленного регламента с положительным решением командира воинской части. Привлечение к выполнению обязанностей в составе групп контроля\n(фактическое время выполения мероприятий контрля) учитывается в этом же списке',
                          easyxf(style))
        sheet.write_merge(9, 9, 0, 22,
                          '6. Столбец 22 заполняется при начале ведения сведений, а в дальнейшем, по состоянию на 1 число месяца, следующего за отчетным заносятся сведения из столбца 23 предыдущего месяца',
                          easyxf(style))
        sheet.write_merge(10, 10, 0, 22,
                          '7. Пунктом управления еженедельно (к понедельнику) представляется командиру воинской части сводный отчет о военнослужащих, у которых сумарное нереализованнное количество дополнительных суток отдыха составляет более 5 суток, для принятия решения о их реализации',
                          easyxf(style))

        sheet.write_merge(12, 15, 0, 0, '№', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 1, 1, 'Подразделние', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 2, 2, 'Воинское звание', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 3, 3, 'Фамилия и инициалы', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 4, 4, 'Номер телефона', easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(12, 12, 5, 15, 'Причина формирования дополнительного отдыха:',
                          easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(13, 13, 5, 9, 'несение службы в суточном наряде',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 14, 5, 6, 'в рабочие дни', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(15, 15, 5, 5, 'кол-во', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(15, 15, 6, 6, 'часов', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 14, 7, 8, 'в нерабочие дни', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(15, 15, 7, 7, 'кол-во', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(15, 15, 8, 8, 'часов', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 9, 9, 'итого (в сут/час.)',
                          easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(13, 13, 10, 11, 'участие в мероприятиях проводимых без ограничения (кроме ДСОО)',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 10, 10, 'время привлечения (сут.)',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 11, 11, 'итого (сут.)', easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(13, 13, 12, 13, 'несение службы в ДСОО',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 12, 12, 'кол-во', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 13, 13, 'итого (сут.)', easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(13, 13, 14, 15, 'по другим причинам', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 14, 14, 'час.', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(14, 15, 15, 15, 'итого (сут.)', easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(12, 15, 16, 16, 'Итого переработки за месяц (сут/час.)',
                          easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(12, 12, 17, 19, 'Учет  реализации дополнительного отдыха (сут.)',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(13, 15, 17, 17, 'в  рабочие дни', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(13, 15, 18, 18, 'к отпуску', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(13, 15, 19, 19, 'предоставлена денежная компенсация',
                          easyxf(style + borders + head_row_color + align_center))

        sheet.write_merge(12, 15, 20, 20, 'Итого за месяц', easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 21, 21, 'Не реализовано ранее',
                          easyxf(style + borders + head_row_color + align_center))
        sheet.write_merge(12, 15, 22, 22, 'Итого дополнительных дней отдыха',
                          easyxf(style + borders + head_row_color + align_center))

        for i in range(0, 23):
            sheet.write(16, i, i + 1, easyxf(style + borders + num_row_color + align_center))

        row_counter = 17

        current_month_counter = 0
        last_month_counter = 0

        # вставка людей
        i = 1
        cell_style = easyxf(style + borders + align_center)

        org_list = UserGroup.objects.order_by('position', 'name')

        if profile_type.filter(Q(action='get_all_user')).count() != 0:
            org_list = org_list.filter(parent=None)
        else:
            if profile.group is not None:
                org_list = org_list.filter(pk=profile.group.id)
            else:
                org_list = []

        for org in org_list:
            # все люди в подразделении
            groups = org.get_children()
            people_list = UserForControl.objects.filter(
                Q(group__in=groups) & Q(is_military=True) & Q(rank__isnull=False)).order_by('rank__position', 'name',
                                                                                            'pk')

            for people in people_list:
                # информация о человеке

                overtime = Overtime.objects.filter(date__month=date_client[1], date__year=date_client[0],
                                                   user__id=people.pk).first()

                sheet.write(row_counter, 0, i, cell_style)
                sheet.write(row_counter, 1, org.name, cell_style)
                sheet.write(row_counter, 2, people.rank.name, cell_style)
                sheet.write(row_counter, 3, people.get_short_name(), cell_style)
                sheet.write(row_counter, 4, people.phone, cell_style)

                # инфа которая в бд
                if overtime is not None:
                    duty_total = round((overtime.duty_workday_hours + overtime.duty_weekends_hours) / 8, 1)
                    month_duty_total = round(
                        duty_total + overtime.without_restrictions_total + overtime.dcoo_total + overtime.other_total,
                        1)
                    month_total = round(
                        month_duty_total - overtime.realize_duty_workday - overtime.realize_duty_holiday - overtime.realize_duty_by_money,
                        1)
                    sheet.write(row_counter, 5, overtime.duty_workday_count, cell_style)
                    sheet.write(row_counter, 6, overtime.duty_workday_hours, cell_style)
                    sheet.write(row_counter, 7, overtime.duty_weekends_count, cell_style)
                    sheet.write(row_counter, 8, overtime.duty_weekends_hours, cell_style)
                    sheet.write(row_counter, 9, duty_total, cell_style)
                    sheet.write(row_counter, 10, overtime.without_restrictions_count, cell_style)
                    sheet.write(row_counter, 11, overtime.without_restrictions_total, cell_style)
                    sheet.write(row_counter, 12, overtime.dcoo_count, cell_style)
                    sheet.write(row_counter, 13, overtime.dcoo_total, cell_style)
                    sheet.write(row_counter, 14, overtime.other_hours, cell_style)
                    sheet.write(row_counter, 15, overtime.other_total, cell_style)
                    sheet.write(row_counter, 16, month_duty_total, cell_style)
                    sheet.write(row_counter, 17, overtime.realize_duty_workday, cell_style)
                    sheet.write(row_counter, 18, overtime.realize_duty_holiday, cell_style)
                    sheet.write(row_counter, 19, overtime.realize_duty_by_money, cell_style)

                    # при необходимости добавить alert_by_5 или alert_by_10
                    alert_by_month_total = ''
                    if month_total > 10:
                        alert_by_month_total = alert_by_10
                    elif month_total > 5:
                        alert_by_month_total = alert_by_5

                    sheet.write(row_counter, 20, month_total, cell_style)
                    sheet.write(row_counter, 21, overtime.total_overtime_last_month, cell_style)
                    sheet.write(row_counter, 22, month_total + overtime.total_overtime_last_month, cell_style)

                    # прибавить итог за месяц для сотрудника
                    current_month_counter = current_month_counter + month_total
                    # прибавить итог за прошлый месяц для сотрудника
                    last_month_counter = last_month_counter + overtime.total_overtime_last_month
                else:
                    for emp in range(5, 23):
                        sheet.write(row_counter, emp, 0, cell_style)

                # перейти на следующую строку в excel
                row_counter = row_counter + 1
                i = i + 1

        # конец вставки людей

        sheet.write_merge(row_counter, row_counter, 0, 19, 'За воинскую часть(подразделние)', easyxf(style + borders))

        # Итого за месяц для всех в часах
        sheet.write(row_counter, 20, current_month_counter, easyxf(style + borders))
        # Итого за предыдущий месяц для всех в часах
        sheet.write(row_counter, 21, last_month_counter, easyxf(style + borders))
        # Итого для всех в часах
        sheet.write(row_counter, 22, current_month_counter + last_month_counter, easyxf(style + borders))

        for i in range(0, row_counter):
            sheet.row(i).height_mismatch = True

        file_name = '/uploads/xls/' + date_client[2] + '.' + date_client[1] + '.' + date_client[0] + '.xls'
        book.save(BASE_DIR + file_name)
    return HttpResponse(json.dumps({'xls': file_name}))


def set_user_to_work(request):
    response = {}
    user = request.user

    profile = user.profile
    profile_type = ProfileType.objects.filter(
        Q(profiletypeselect__profile=profile))

    if profile_type.count() != 0:
        data = json.loads(request.body.decode("utf-8"))
        if 'id' in data:
            profile_to_work = Profile.objects.filter(Q(pk=data['id'])).first()
            if profile_to_work is not None:
                if 'type' in data and data['type'] == 'set' and 'profile_id' not in data:
                    profile_to_work.user_for_work = profile
                elif 'profile_id' in data:
                    profile_to_work.user_for_work = Profile.objects.filter(Q(pk=data['profile_id'])).first()
                else:
                    profile_to_work.user_for_work = None
                profile_to_work.save()
        else:
            profile.user_for_work = None
            profile.save()

    return HttpResponse(json.dumps(response, default=my_convert_date))


# -------------------------- FOR PROFILE -------------------------- #


def user_profile(user):
    profile = None

    if not user.is_anonymous:
        # TODO это для второго варианта
        ldap_user = LDAPBackend().populate_user(user.username)
        if hasattr(user, 'ldap_user'):
            ldap_user = user.ldap_user

            profile = Profile.objects.filter(user_id=user.id).first()

            user_profile_by_email = UserForControl.objects.filter(email__iexact=user.username + '@cnii.local').first()

            # search group ---------------------------------------------------------------------------------------------
            group = None
            # TODO это для первого варианта
            # group = user_profile_by_email.real_group \
            #     if user_profile_by_email is not None \
            #     else profile.group if profile is not None \
            #     else None

            # TODO это для второго варианта

            start = False

            new_profile_info_group = ldap_parser([ldap_user.dn])[0]

            group_list = UserGroup.objects.all()
            print(new_profile_info_group)
            if 'ou' in new_profile_info_group:
                for g in new_profile_info_group['ou']:
                    if g == 'cnii users':
                        start = True
                        continue
                    if start:
                        if g == 'shtab':
                            continue
                        group_buf = group_list.filter(name_in_ldap__iexact=g).first()
                        if group_buf is not None:
                            group = group_buf
                            if user.username == 'lebec_ii':
                                group_list = group_list.filter(parent=group)
                                if group_list.count() == 0:
                                    break
                            else:
                                break

                        else:
                            break

            if group is None:
                group = user_profile_by_email.real_group \
                    if user_profile_by_email is not None \
                    else None

            # end search group -----------------------------------------------------------------------------------------

            # user type ------------------------------------------------------------------------------------------------

            new_profile_info_type = ldap_parser(ldap_user.attrs['memberOf']) if 'memberOf' in ldap_user.attrs else []

            new_profile_info_type = from_list_by_key(new_profile_info_type, 'CN')

            print(new_profile_info_type)
            # is_guest = True
            # is_editor = False
            # is_control = False
            # is_duty = False
            # is_duty_control = False
            #
            # if len(new_profile_info_type) != 0:
            #     if 'django_duty_control' in new_profile_info_type:
            #         is_guest = False
            #         is_duty_control = True
            #     if 'django_duty' in new_profile_info_type:
            #         is_guest = False
            #         is_duty = True
            #     if 'django_covid_control' in new_profile_info_type:
            #         is_guest = False
            #         is_control = True
            #     if 'django_covid_editor' in new_profile_info_type:
            #         is_guest = False
            #         is_editor = True

            # _new_profile_info_type = ldap_parser(ldap_user.attrs['memberOf'])
            # _new_profile_info_type = from_list_by_val_key(_new_profile_info_type, 'ou', 'people')
            # _new_profile_info_type = from_list_by_key(_new_profile_info_type, 'CN')

            # print(_new_profile_info_type)

            profile_type_list = ProfileType.objects.filter(Q(name_in_ldap__in=new_profile_info_type))
            print('profile_type_list', profile_type_list)
            # end user type --------------------------------------------------------------------------------------------

            if profile is None:
                profile = Profile.objects.create(
                    user_id=user.id,
                    group=group,
                    user_for_control=user_profile_by_email
                )
            else:
                profile.group = group
                profile.user_for_control = user_profile_by_email
                profile.save()

            ProfileTypeSelect.objects.filter(profile=profile).delete()
            for p in profile_type_list:
                ProfileTypeSelect.objects.create(type=p, profile=profile)

    return profile
