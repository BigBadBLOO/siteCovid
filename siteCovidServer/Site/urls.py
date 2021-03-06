from django.conf.urls import url
from Site.views import *

urlpatterns = [
  url(r'^$', index, name='index'),
  url(r'^initUser/', initUser, name='initUser'),
  url(r'^login/', login_view, name='login_view'),
  url(r'^logout/', logout_view, name='logout'),
  url(r'^changePassword/', changePassword, name='changePassword'),

  url(r'^getListOfCity/', getListOfCity, name='getListOfCity'),
  url(r'^getListOfPost/', getListOfPost, name='getListOfPost'),
  url(r'^setListOfPost/', setListOfPost, name='setListOfPost'),

  url(r'^getListOfPerson/', getListOfPerson, name='getListOfPerson'),
  url(r'^setListOfPerson/', setListOfPerson, name='setListOfPerson'),

  url(r'^getListOfStatus/', getListOfStatus, name='getListOfStatus'),

  url(r'^setListOfReport/', setListOfReport, name='setListOfReport'),
  url(r'^getListOfReport/', getListOfReport, name='getListOfReport'),
  url(r'^setOneReport/', setOneReport, name='setOneReport'),
  url(r'^getExtraFieldsForStatus/', getExtraFieldsForStatus, name='getExtraFieldsForStatus'),

  url(r'^getListOfRank/', getListOfRank, name='getListOfRank'),
  url(r'^getListOfGroup/', getListOfGroup, name='getListOfGroup'),
]
