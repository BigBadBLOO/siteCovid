# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-02-25 09:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0019_usergroup_forduty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='forDuty',
            field=models.BooleanField(default=False, verbose_name='Использовать подразделение для расчета нарядов'),
        ),
    ]
