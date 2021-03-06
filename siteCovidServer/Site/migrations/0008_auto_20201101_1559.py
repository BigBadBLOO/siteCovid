# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-11-01 12:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0007_auto_20201101_1531'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500)),
                ('position', models.FloatField(blank=True, null=True, verbose_name='Позиция')),
            ],
            options={
                'verbose_name': 'Должность пользователей',
                'verbose_name_plural': 'Должность пользователей',
            },
        ),
        migrations.AddField(
            model_name='userforcontrol',
            name='post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Site.UserPost', verbose_name='Должность пользователя'),
        ),
    ]
