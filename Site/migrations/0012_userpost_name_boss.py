# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-01-02 03:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0011_usergroup_name_boss'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpost',
            name='name_boss',
            field=models.TextField(blank=True, max_length=500),
        ),
    ]
