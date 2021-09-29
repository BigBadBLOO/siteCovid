# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-06-11 08:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0025_dutybymonth_namebyday'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountDutyInHolidays',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.TextField(blank=True, default='', verbose_name='Тип наряда')),
                ('count_in_weekend', models.IntegerField(blank=True, default=0, verbose_name='Количество нарядов на праздники')),
                ('count_in_holiday', models.IntegerField(blank=True, default=0, verbose_name='Количество нарядов на выходные')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Site.UserGroup', verbose_name='Подразделение')),
            ],
            options={
                'verbose_name': 'Количество дней за праздники и выходные по подразделениям',
                'verbose_name_plural': 'Количество дней за праздники и выходные по подразделениям',
            },
        ),
        migrations.CreateModel(
            name='Overtime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='Дата')),
                ('duty_workday_count', models.FloatField(blank=True, default=0, verbose_name='в наряде в рабочие дни кол-во')),
                ('duty_workday_hours', models.FloatField(blank=True, default=0, verbose_name='в наряде в рабочие дни часов')),
                ('duty_weekends_count', models.FloatField(blank=True, default=0, verbose_name='в наряде в нерабочие дни кол-во')),
                ('duty_weekends_hours', models.FloatField(blank=True, default=0, verbose_name='в наряде в нерабочие дни часов')),
                ('without_restrictions_count', models.FloatField(blank=True, default=0, verbose_name='без ограничения сут')),
                ('without_restrictions_total', models.FloatField(blank=True, default=0, verbose_name='без ограничения итого')),
                ('dcoo_count', models.FloatField(blank=True, default=0, verbose_name='ДСОО кол-во')),
                ('dcoo_total', models.FloatField(blank=True, default=0, verbose_name='ДСОО итого')),
                ('other_hours', models.FloatField(blank=True, default=0, verbose_name='по другим причинам часов')),
                ('other_total', models.FloatField(blank=True, default=0, verbose_name='по другим причинам итого')),
                ('realize_duty_workday', models.FloatField(blank=True, default=0, verbose_name='реализации доп. отдыха в раб. дни')),
                ('realize_duty_holiday', models.FloatField(blank=True, default=0, verbose_name='реализации доп. отдыха к откуску')),
                ('realize_duty_by_money', models.FloatField(blank=True, default=0, verbose_name='реализации доп. отдыха деньгами')),
                ('total_overtime_last_month', models.FloatField(blank=True, default=0, verbose_name='Итого доп. дней отдыха в прошлом месяце')),
                ('total_overtime', models.FloatField(blank=True, default=0, verbose_name='Итого дополнительных дней отдыха')),
            ],
            options={
                'verbose_name': 'Переработка',
                'verbose_name_plural': 'Переработка',
            },
        ),
        migrations.AddField(
            model_name='dutybymonth',
            name='personArray',
            field=models.TextField(blank=True, default='{}', verbose_name='Количество людей по подразделениям'),
        ),
        migrations.AddField(
            model_name='userforcontrol',
            name='phone',
            field=models.TextField(blank=True, max_length=500, verbose_name='Телефон'),
        ),
        migrations.AddField(
            model_name='overtime',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Site.UserForControl', verbose_name='л/с'),
        ),
    ]