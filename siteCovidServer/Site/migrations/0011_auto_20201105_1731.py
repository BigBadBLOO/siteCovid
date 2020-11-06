# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-11-05 14:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0010_status_is_required'),
    ]

    operations = [
        migrations.AddField(
            model_name='daydata',
            name='bodyTemperature',
            field=models.TextField(blank=True, max_length=500, verbose_name='Температура тела'),
        ),
        migrations.AddField(
            model_name='daydata',
            name='state',
            field=models.TextField(blank=True, max_length=500, verbose_name='Состояние на данный момент'),
        ),
        migrations.AddField(
            model_name='status',
            name='with_extraField',
            field=models.BooleanField(default=True, verbose_name='Требуются дополнительные поля'),
        ),
    ]
