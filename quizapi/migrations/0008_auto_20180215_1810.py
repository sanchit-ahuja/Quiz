# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-15 12:40
from __future__ import unicode_literals

from django.db import migrations, models
import quizapi.models


class Migration(migrations.Migration):

    dependencies = [
        ('quizapi', '0007_auto_20180210_1652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='img',
            field=models.ImageField(blank=True, default=None, null=True, upload_to=quizapi.models.user_directory_path),
        ),
    ]
