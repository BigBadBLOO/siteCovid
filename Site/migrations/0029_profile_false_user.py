# Generated by Django 3.2.4 on 2021-06-23 14:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0028_auto_20210623_1444'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='false_user',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Site.userforcontrol', verbose_name='Пользователь'),
        ),
    ]
