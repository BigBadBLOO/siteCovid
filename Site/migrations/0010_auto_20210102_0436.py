# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-01-02 01:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0009_auto_20210102_0431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rank',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Site.RankCategory', verbose_name='Категория звания'),
        ),
    ]