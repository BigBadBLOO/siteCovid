from django.db import models
from django.contrib.auth.models import User

class UserGroup(models.Model):
    name = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Подразделение пользователей'
        verbose_name_plural = 'Подразделение пользователей'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    group = models.ForeignKey(UserGroup, models.SET_NULL, blank=True, null=True, verbose_name="Подразделение пользователя")
    phone = models.TextField(max_length=500, blank=True, verbose_name="Телефон")
    is_control = models.BooleanField(default=False, verbose_name="Контролирующий")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профиль пользователей'

class City(models.Model):
  name = models.TextField(max_length=500, blank=True, verbose_name=" Название")

  def __str__(self):
    return self.name

  class Meta:
    verbose_name = 'Город'
    verbose_name_plural = 'Города'

class UserForControl(models.Model):
    group = models.ForeignKey(UserGroup, on_delete=models.CASCADE, verbose_name="Подразделение пользователя")
    name = models.TextField(max_length=500, blank=True, verbose_name="ФИО")
    rank = models.TextField(max_length=500, blank=True, verbose_name="Воиское звание")
    city = models.ForeignKey(City, on_delete=models.CASCADE, verbose_name="Город")
    is_military = models.BooleanField(default=True, verbose_name="Военный")
    is_woman_with_children = models.BooleanField(default=False, verbose_name="Женщина с детьми")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'л/с по подразделениям'
        verbose_name_plural = 'л/с по подразделениям'


class Status(models.Model):
    name = models.TextField(max_length=500, blank=True, verbose_name=" Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Причина отсутствия'
        verbose_name_plural = 'Причины отсутствия'


class DayData(models.Model):
    userForControl = models.ForeignKey(UserForControl, on_delete=models.CASCADE, verbose_name="Пользователь")
    status = models.ForeignKey(Status, models.SET_NULL, blank=True, null=True, verbose_name="Причина отсутствия")
    comment = models.TextField(max_length=500, blank=True, verbose_name="Комментарий")
    date = models.DateField(verbose_name='Дата')

    def __str__(self):
        return self.userForControl.name + str(self.date)

    class Meta:
        verbose_name = 'л/с по дням'
        verbose_name_plural = 'л/с по дням'