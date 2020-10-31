from django.db import models
from django.contrib.auth.models import User


class UserGroup(models.Model):
    name = models.TextField(max_length=500, blank=True)
    parent = models.ForeignKey("self",  models.SET_NULL, blank=True, null=True, verbose_name="Подразделение пользователя")

    def __str__(self):
        return (self.parent.name + ' ' if self.parent is not None else '') + self.name

    def get_main_parent(self):
      parent = self
      if parent.parent is None:
        return parent
      for par in UserGroup.objects.filter(pk=self.parent.pk):
          parent = par
      return parent

    def get_children(self):
      children = list()
      children.append(self.pk)
      for child in UserGroup.objects.filter(parent=self.pk):
        children.extend(child.get_children())
      return children

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


class Rank(models.Model):
  name = models.TextField(max_length=500, blank=True, verbose_name=" Название")

  def __str__(self):
    return self.name

  class Meta:
    verbose_name = 'Звание'
    verbose_name_plural = 'Звания'


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
    rank = models.ForeignKey(Rank,  models.SET_NULL, blank=True, null=True,  verbose_name="Звание")
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
    abbr = models.TextField(max_length=500, blank=True, verbose_name=" Сокращение")

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

    def get_date_day(self):
      return self.date.strftime("%d")

    class Meta:
        verbose_name = 'л/с по дням'
        verbose_name_plural = 'л/с по дням'