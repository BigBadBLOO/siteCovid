# Generated by Django 3.2.4 on 2021-08-24 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0042_alter_profile_user_for_work'),
    ]

    operations = [
        migrations.AddField(
            model_name='profiletype',
            name='is_default',
            field=models.BooleanField(default=False, verbose_name='Всем'),
        ),
    ]
