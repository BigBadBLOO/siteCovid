# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-01-11 08:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0013_auto_20210111_1141'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpost',
            name='is_watch',
            field=models.BooleanField(default=False, verbose_name='Дежурство'),
        ),
        migrations.AlterField(
            model_name='userpost',
            name='is_duty',
            field=models.BooleanField(default=False, verbose_name='Наряды'),
        ),
    ]
