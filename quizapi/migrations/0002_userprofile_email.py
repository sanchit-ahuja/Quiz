# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-02-06 10:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizapi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='email',
            field=models.EmailField(max_length=254, null=True),
        ),
    ]
