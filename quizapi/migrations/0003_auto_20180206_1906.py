# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-02-06 13:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizapi', '0002_userprofile_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='fitb_ans',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='q_type',
            field=models.CharField(max_length=4),
        ),
    ]
