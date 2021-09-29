from django.conf.urls import url
from Site.views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
  url(r'^$', index, name='index'),
  url(r'^listOfDuty/', index, name='index'),
  url(r'^listForEntering/', index, name='index'),
  url(r'^seeReport/', index, name='index'),
  url(r'^listOfPerson/', index, name='index'),
  url(r'^listOfRecords/', index, name='index'),
  url(r'^statistics/', index, name='index'),
  url(r'^overtime/', index, name='index'),
  url(r'^justification/', index, name='index'),
  url(r'^delegation/', index, name='index'),

  url(r'^initUser/', initUser, name='initUser'),
  url(r'^initMainInfo/', initMainInfo, name='initMainInfo'),
  url(r'^login/', login_view, name='login_view'),
  url(r'^logout/', logout_view, name='logout'),
  url(r'^changePassword/', changePassword, name='changePassword'),

  url(r'^getListOfCity/', getListOfCity, name='getListOfCity'),
  url(r'^getListOfPost/', getListOfPost, name='getListOfPost'),
  url(r'^setListOfPost/', setListOfPost, name='setListOfPost'),

  url(r'^getListOfPerson/', getListOfPerson, name='getListOfPerson'),
  url(r'^setListOfPerson/', setListOfPerson, name='setListOfPerson'),
  url(r'^getNameStatus/', getNameStatus, name='getNameStatus'),
  url(r'^getEmailStatus/', getEmailStatus, name='getEmailStatus'),
  url(r'^getListOfAllPerson/', getListOfAllPerson, name='getListOfAllPerson'),

  url(r'^getListOfStatus/', getListOfStatus, name='getListOfStatus'),

  url(r'^setListOfReport/', setListOfReport, name='setListOfReport'),
  url(r'^getListOfReport/', getListOfReport, name='getListOfReport'),
  url(r'^setOneReport/', setOneReport, name='setOneReport'),
  url(r'^setOneVaccine/', setOneVaccine, name='setOneVaccine'),
  url(r'^setOneAntitela/', setOneAntitela, name='setOneAntitela'),
  url(r'^getExtraFieldsForStatus/', getExtraFieldsForStatus, name='getExtraFieldsForStatus'),

  url(r'^getListOfRank/', getListOfRank, name='getListOfRank'),
  url(r'^getListOfGroup/', getListOfGroup, name='getListOfGroup'),
  url(r'^getListOfHolidays/', getListOfHolidays, name='getListOfHolidays'),

  url(r'^setCountByGroup/', setCountByGroup, name='setCountByGroup'),

  url(r'^db/load/$', db_load, name='db_load'),
  url(r'^db/dump/$', db_dump, name='db_dump'),

  url(r'^getDutyInfo/$', getDutyInfo, name='getDutyInfo'),
  url(r'^setDutyInfo/$', setDutyInfo, name='setDutyInfo'),
  url(r'^setPersonStatusByDuty/$', setPersonStatusByDuty, name='setPersonStatusByDuty'),
  url(r'^downloadDutyExcel/$', downloadDutyExcel, name='downloadDutyExcel'),

  url(r'^getOvertime/$', getOvertime, name='getOvertime'),
  url(r'^setOvertime/$', setOvertime, name='setOvertime'),
  url(r'^request_overtime/$', request_overtime, name='request_overtime'),

  url(r'^set_user_to_work/$', set_user_to_work, name='set_user_to_work'),

  url(r'^test/$', test, name='test'),
] + static(settings.MEDIA_ROOT, document_root=settings.MEDIA_ROOT)
