# Generated by Django 3.2.4 on 2021-07-13 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Site', '0034_antitela'),
    ]

    operations = [
        migrations.AddField(
            model_name='dutybymonth',
            name='buildingOfDuty',
            field=models.IntegerField(blank=True, default=0, verbose_name='buildingOfDuty'),
        ),
        migrations.AddField(
            model_name='dutybymonth',
            name='corOfDuty',
            field=models.IntegerField(blank=True, default=0, verbose_name='corOfDuty'),
        ),
        migrations.AddField(
            model_name='dutybymonth',
            name='warehouseOfDuty',
            field=models.IntegerField(blank=True, default=0, verbose_name='warehouseOfDuty'),
        ),
        migrations.AddField(
            model_name='dutybymonth',
            name='zsspdOfDuty',
            field=models.IntegerField(blank=True, default=0, verbose_name='zsspdOfDuty'),
        ),
    ]
