# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-02-25 11:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0020_auto_20210225_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='rank',
            name='is_old',
            field=models.BooleanField(default=False, verbose_name='Старший офицер'),
        ),
        migrations.AddField(
            model_name='rank',
            name='is_small',
            field=models.BooleanField(default=False, verbose_name='Младший офицер'),
        ),
        migrations.AddField(
            model_name='rank',
            name='useDuty',
            field=models.BooleanField(default=False, verbose_name='Использовать в растановке нарядов'),
        ),
    ]
