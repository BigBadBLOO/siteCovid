# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-01-02 01:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0007_remove_userpost_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='RankCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500, verbose_name='Название')),
                ('code', models.TextField(blank=True, max_length=500, verbose_name='Условное обозначение')),
            ],
            options={
                'verbose_name_plural': 'Категории звания',
                'verbose_name': 'Категория звания',
            },
        ),
        migrations.AddField(
            model_name='rank',
            name='position',
            field=models.FloatField(blank=True, null=True, verbose_name='Позиция'),
        ),
        migrations.AddField(
            model_name='userpost',
            name='is_boss',
            field=models.BooleanField(default=False, verbose_name='DB'),
        ),
        migrations.AddField(
            model_name='rank',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Site.RankCategory', verbose_name='Подразделение пользователя'),
        ),
    ]