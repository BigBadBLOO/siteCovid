# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2021-01-02 01:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0006_remove_userforcontrol_is_boss'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userpost',
            name='group',
        ),
    ]