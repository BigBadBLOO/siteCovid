# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-11-05 07:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0009_userpost_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='status',
            name='is_required',
            field=models.BooleanField(default=True, verbose_name='Обязательный комментарий'),
        ),
    ]
