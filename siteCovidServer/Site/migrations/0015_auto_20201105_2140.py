# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-11-05 18:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0014_auto_20201105_1934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='extradatafordaydata',
            name='name',
            field=models.TextField(blank=True, max_length=500, null=True, verbose_name='Название'),
        ),
        migrations.AlterField(
            model_name='extradatafordaydata',
            name='value',
            field=models.TextField(blank=True, max_length=500, null=True, verbose_name='Значение'),
        ),
    ]