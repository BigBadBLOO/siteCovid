# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-02-25 09:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0018_auto_20210122_1057'),
    ]

    operations = [
        migrations.AddField(
            model_name='usergroup',
            name='forDuty',
            field=models.IntegerField(default=False, verbose_name='Использовать подразделение для расчета нарядов'),
        ),
    ]
