# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-11-05 14:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0011_auto_20201105_1731'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='with_extraField',
            field=models.BooleanField(default=False, verbose_name='Требуются дополнительные поля'),
        ),
    ]
