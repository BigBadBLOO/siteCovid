# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-03-13 11:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0024_auto_20210312_1525'),
    ]

    operations = [
        migrations.AddField(
            model_name='dutybymonth',
            name='nameByDay',
            field=models.TextField(blank=True, default='{}', verbose_name='Имена людей по дням'),
        ),
    ]