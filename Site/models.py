from django.db import models
from django.contrib.auth.models import User


class Holidays(models.Model):
    day = models.IntegerField(verbose_name='День', null=True, blank=True, default=None)
    month = models.IntegerField(verbose_name='Месяц', null=True, blank=True, default=None)
    chill = models.BooleanField(default=True, verbose_name="Отдых")

    def __str__(self):
        return self.day.__str__() + '.' + self.month.__str__()

    class Meta:
        verbose_name = 'Праздник'
        verbose_name_plural = 'Праздники'


class UserGroup(models.Model):
    name = models.TextField(max_length=500, blank=True)
    name_in_ldap = models.TextField(max_length=500, blank=True)
    name_boss = models.TextField(max_length=500, blank=True)
    parent = models.ForeignKey("self", models.SET_NULL, blank=True, null=True,
                               verbose_name="Подразделение пользователя")
    position = models.FloatField(blank=True, verbose_name='Позиция', null=True)
    out = models.BooleanField(default=False, verbose_name="Внешнее подразделение")
    signature = models.BooleanField(default=False, verbose_name="Заверение")
    countMilByGroup = models.IntegerField(default=0, verbose_name="Штат подразделения (Военнослужащие)")
    countByGroup = models.IntegerField(default=0, verbose_name="Штат подразделения (Гр. персонал)")
    forDuty = models.BooleanField(default=False, verbose_name="Использовать подразделение для расчета нарядов")

    def __str__(self):
        return self.name + (' ' + self.parent.__str__() if self.parent is not None else '')

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


class TypeRank(models.Model):
    name = models.TextField(max_length=500, blank=True, verbose_name="Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип звания'
        verbose_name_plural = 'Типы званий'


class Rank(models.Model):
    name = models.TextField(max_length=500, blank=True, verbose_name="Название")
    position = models.FloatField(blank=True, verbose_name='Позиция', null=True)
    abbr = models.TextField(max_length=500, blank=True, verbose_name="Сокращение")
    useDuty = models.BooleanField(default=False, verbose_name="Использовать в растановке нарядов")
    type = models.ForeignKey(TypeRank, models.SET_NULL, blank=True, null=True, verbose_name="Тип звания")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Звание'
        verbose_name_plural = 'Звания'


class UserPost(models.Model):
    name = models.TextField(max_length=500, blank=True)
    name_boss = models.TextField(max_length=500, blank=True)
    position = models.FloatField(blank=True, verbose_name='Позиция', null=True)
    abbr = models.TextField(max_length=500, blank=True, verbose_name="Сокращение")
    is_boss = models.BooleanField(default=False, verbose_name="Руководящая должность")
    is_duty = models.BooleanField(default=False, verbose_name="Наряды")
    is_watch = models.BooleanField(default=False, verbose_name="Дежурство")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Должность пользователей'
        verbose_name_plural = 'Должность пользователей'


class City(models.Model):
    name = models.TextField(max_length=500, blank=True, verbose_name=" Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'


class UserForControl(models.Model):
    group = models.ForeignKey(UserGroup, on_delete=models.CASCADE, related_name="group",
                              verbose_name="Штатное подразделение")
    real_group = models.ForeignKey(UserGroup, on_delete=models.CASCADE, related_name="real_group",
                                   verbose_name="Фактическое подразделение", null=True, blank=True, default=None)
    post = models.ForeignKey(UserPost, models.SET_NULL, blank=True, null=True, verbose_name="Должность пользователя")
    name = models.TextField(max_length=500, blank=True, verbose_name="ФИО")
    email = models.TextField(max_length=500, blank=True, verbose_name="Email")
    phone = models.TextField(max_length=500, blank=True, verbose_name="Телефон")
    rank = models.ForeignKey(Rank, models.SET_NULL, blank=True, null=True, verbose_name="Звание")
    city = models.ForeignKey(City, models.SET_NULL, blank=True, null=True, verbose_name="Город")
    is_military = models.BooleanField(default=True, verbose_name="Военный")
    is_gender = models.BooleanField(blank=True, null=True, default=None, verbose_name="Военный")
    is_woman_with_children = models.BooleanField(default=False, verbose_name="Женщина с детьми")

    def __str__(self):
        return self.name

    def get_short_name(self):
        result = ''
        if self.name is not None:
            elem = " ".join(self.name.strip().split()).split(' ')
            if len(elem) == 3:
                result += elem[0]
                result += ' '
                result += elem[1][0] + '.'
                result += elem[2][0] + '.'
            else:
                result += ' '.join(elem)
        return result

    class Meta:
        verbose_name = 'л/с по подразделениям'
        verbose_name_plural = 'л/с по подразделениям'


class ProfileType(models.Model):
    name = models.CharField(max_length=200, blank=True, verbose_name="Название")
    name_in_ldap = models.CharField(max_length=200, blank=True, verbose_name="Название в AD")

    page = models.CharField(max_length=200, blank=True, verbose_name="Страница")
    action = models.CharField(max_length=200, blank=True, verbose_name="Действие")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип профиля пользователя'
        verbose_name_plural = 'Типы профилей пользователей'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь", null=True, blank=True, default=None)
    user_for_control = models.OneToOneField(UserForControl, on_delete=models.CASCADE, verbose_name="Сотрудник", null=True, blank=True, default=None)
    user_for_work = models.ForeignKey("self", on_delete=models.CASCADE, verbose_name="Делегирование", null=True, blank=True, default=None)
    group = models.ForeignKey(UserGroup, models.SET_NULL, null=True, blank=True, default=None,
                              verbose_name="Подразделение пользователя")
    phone = models.TextField(max_length=500, null=True, blank=True, default=None, verbose_name="Телефон")

    is_control = models.BooleanField(default=False, verbose_name="Контролирующий")
    is_editor = models.BooleanField(default=False, verbose_name="Editor")
    is_duty = models.BooleanField(default=False, verbose_name="Duty")
    is_duty_control = models.BooleanField(default=False, verbose_name="DutyControl")
    is_db = models.BooleanField(default=False, verbose_name="DB")
    is_guest = models.BooleanField(default=False, verbose_name="Guest")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профиль пользователей'


class ProfileTypeSelect(models.Model):
    profile = models.ForeignKey(Profile, models.SET_NULL, null=True, blank=True, default=None,
                              verbose_name="Профиль пользователя")
    type = models.ForeignKey(ProfileType, models.SET_NULL, null=True, blank=True, default=None,
                              verbose_name="Тип профиля пользователя")

    def __str__(self):
        return self.profile.__str__() + ' - ' + self.type.__str__()

    class Meta:
        verbose_name = 'Тип профиля пользователя'
        verbose_name_plural = 'Типы профилей пользователей'


class OutUserConnect(models.Model):
    user = models.OneToOneField(UserForControl, on_delete=models.CASCADE, verbose_name="Пользователь")
    out_id = models.IntegerField(verbose_name='PK', null=True, blank=True, default=None)

    def __str__(self):
        return self.user.name + ' - ' + str(self.out_id)

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профиль пользователей'


class Status(models.Model):
    name = models.TextField(max_length=500, blank=True, verbose_name="Название")
    abbr = models.TextField(max_length=500, blank=True, verbose_name="Сокращение")
    workDay = models.BooleanField(default=False, verbose_name="Устанавливается только на следующий день")
    parent = models.ForeignKey("self", models.SET_NULL, blank=True, null=True, verbose_name="Родитель")
    with_extraField = models.BooleanField(default=False, verbose_name="Требуются дополнительные поля")
    with_comment = models.BooleanField(default=False, verbose_name="Требуется комментарий")
    with_disease = models.BooleanField(default=False, verbose_name="Болен")
    with_work = models.BooleanField(default=False, verbose_name="Присутствует на работе")
    with_kpp = models.BooleanField(default=False, verbose_name="Проходит через КПП (будни)")
    with_kpp_we = models.BooleanField(default=False, verbose_name="Проходит через КПП (выходные)")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'


class DayData(models.Model):
    userForControl = models.ForeignKey(UserForControl, on_delete=models.CASCADE, verbose_name="Пользователь")
    status = models.ForeignKey(Status, models.SET_NULL, blank=True, null=True, verbose_name="Причина отсутствия")
    comment = models.TextField(blank=True, verbose_name="Комментарий")
    date = models.DateField(verbose_name='Дата')
    manual = models.BooleanField(default=True)

    def __str__(self):
        return self.userForControl.name + str(self.date)

    def get_date_day(self):
        return self.date.strftime("%d")

    class Meta:
        verbose_name = 'л/с по дням'
        verbose_name_plural = 'л/с по дням'


class ExtraDataForDayData(models.Model):
    data = models.ForeignKey(DayData, on_delete=models.CASCADE, verbose_name="DayData")
    name = models.TextField(max_length=500, blank=True, null=True, verbose_name="Название")
    value = models.TextField(max_length=500, blank=True, null=True, verbose_name="Значение")

    def __str__(self):
        return self.data.userForControl.name

    class Meta:
        verbose_name = 'Дополнительное поле для статуса'
        verbose_name_plural = 'Дополнительные поля для статуса'


class Vaccine(models.Model):
    userForControl = models.ForeignKey(UserForControl, on_delete=models.CASCADE, verbose_name="Пользователь")
    countComponent = models.IntegerField(blank=True, verbose_name="Компоненты", default=2)
    first_date = models.DateField(verbose_name='Дата', null=True, blank=True, default=None)
    second_date = models.DateField(verbose_name='Дата', null=True, blank=True, default=None)
    comment = models.TextField(blank=True, verbose_name="Комментарий", default='')

    def __str__(self):
        return self.userForControl.name + str(self.first_date)

    class Meta:
        verbose_name = 'Вакцина'
        verbose_name_plural = 'Вакцины'


class Antitela(models.Model):
    userForControl = models.ForeignKey(UserForControl, on_delete=models.CASCADE, verbose_name="Пользователь")
    date = models.DateField(verbose_name='Дата', null=True, blank=True, default=None)
    comment = models.TextField(blank=True, verbose_name="Номер справки", default='')
    comment2 = models.TextField(blank=True, verbose_name="Комментарий", default='')

    def __str__(self):
        return self.userForControl.name + str(self.date)

    class Meta:
        verbose_name = 'Антитела'
        verbose_name_plural = 'Антитела'


class DutyByMonth(models.Model):
    date = models.DateField(verbose_name='Дата создания', null=True, blank=True, default=None)
    policeman = models.IntegerField(blank=True, verbose_name="Дополнительный патруль", default=0)
    patrol2 = models.IntegerField(blank=True, verbose_name="Комендатура", default=0)
    policeman_skip = models.TextField(blank=True, verbose_name="Дополнительный патруль для пропуска в месяц", default='[]')
    patrol2_skip = models.TextField(blank=True, verbose_name="Комендатура  для пропуска в месяц", default='[]')
    zsspdOfDuty = models.IntegerField(blank=True, verbose_name="zsspdOfDuty", default=0)
    corOfDuty = models.IntegerField(blank=True, verbose_name="corOfDuty", default=0)
    warehouseOfDuty = models.IntegerField(blank=True, verbose_name="warehouseOfDuty", default=0)
    buildingOfDuty = models.IntegerField(blank=True, verbose_name="buildingOfDuty", default=0)
    nameByDay = models.TextField(blank=True, verbose_name="Имена людей по дням", default='{}')
    personArray = models.TextField(blank=True, verbose_name="Количество людей по подразделениям", default='{}')

    def __str__(self):
        return str(self.date)

    class Meta:
        verbose_name = 'Наряды с доп. информацией'
        verbose_name_plural = 'Наряды с доп. информацией'


class CountDutyInHolidays(models.Model):
    type = models.TextField(blank=True, verbose_name="Тип наряда", default='')
    group = models.ForeignKey(UserGroup, on_delete=models.CASCADE, verbose_name="Подразделение")
    count_in_weekend = models.IntegerField(blank=True, verbose_name="Количество нарядов на праздники", default=0)
    count_in_holiday = models.IntegerField(blank=True, verbose_name="Количество нарядов на выходные", default=0)

    def __str__(self):
        return self.group.name + self.type

    class Meta:
        verbose_name = 'Количество дней за праздники и выходные по подразделениям'
        verbose_name_plural = 'Количество дней за праздники и выходные по подразделениям'


class Overtime(models.Model):
    user = models.ForeignKey(UserForControl, on_delete=models.CASCADE, verbose_name="л/с")
    date = models.DateField(verbose_name='Дата')

    duty_workday_count = models.FloatField(blank=True, verbose_name="в наряде в рабочие дни кол-во", default=0)
    duty_workday_hours = models.FloatField(blank=True, verbose_name="в наряде в рабочие дни часов", default=0)
    duty_weekends_count = models.FloatField(blank=True, verbose_name="в наряде в нерабочие дни кол-во", default=0)
    duty_weekends_hours = models.FloatField(blank=True, verbose_name="в наряде в нерабочие дни часов", default=0)

    without_restrictions_count = models.FloatField(blank=True, verbose_name="без ограничения сут", default=0)
    without_restrictions_total = models.FloatField(blank=True, verbose_name="без ограничения итого",
                                                     default=0)

    dcoo_count = models.FloatField(blank=True, verbose_name="ДСОО кол-во", default=0)
    dcoo_total = models.FloatField(blank=True, verbose_name="ДСОО итого", default=0)

    other_hours = models.FloatField(blank=True, verbose_name="по другим причинам часов", default=0)
    other_total = models.FloatField(blank=True, verbose_name="по другим причинам итого", default=0)

    realize_duty_workday = models.FloatField(blank=True, verbose_name="реализации доп. отдыха в раб. дни", default=0)
    realize_duty_holiday = models.FloatField(blank=True, verbose_name="реализации доп. отдыха к откуску", default=0)
    realize_duty_by_money = models.FloatField(blank=True, verbose_name="реализации доп. отдыха деньгами", default=0)

    total_overtime_last_month = models.FloatField(blank=True, verbose_name="Итого доп. дней отдыха в прошлом месяце", default=0)
    total_overtime = models.FloatField(blank=True, verbose_name="Итого дополнительных дней отдыха", default=0)

    def __str__(self):
        return self.user.name

    class Meta:
        verbose_name = 'Переработка'
        verbose_name_plural = 'Переработка'
