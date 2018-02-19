# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-10 16:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizapi', '0006_question_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='neg_points',
            field=models.FloatField(default=0.25),
        ),
        migrations.AlterField(
            model_name='question',
            name='points',
            field=models.FloatField(default=1),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='score',
            field=models.FloatField(default=0),
        ),
    ]