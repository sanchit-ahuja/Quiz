from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    return 'revengg/revengg{0}-{1}'.format(instance.id, filename)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    register_time = models.DateTimeField(auto_now=True, null=True)
    login_time = models.DateTimeField(auto_now=True, null=True)
    time_spent = models.IntegerField(default=0)
    score = models.FloatField(default=0)
    is_complete = models.BooleanField(default=False)
    email = models.EmailField(null=True)

    def __unicode__(self):
        return str(self.id)

class Question(models.Model):
    q_type = models.CharField(max_length=4)
    text = models.CharField(max_length=500)
    q_no = models.IntegerField(default=0, unique=True)
    points = models.FloatField(default=1)
    neg_points = models.FloatField(default=0.25)
    fitb_ans = models.CharField(max_length=50, null=True, blank=True)
    def __unicode__(self):
        return self.text

class Choice(models.Model):
    c_text = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True)
    def __unicode__(self):
        return self.c_text

class Solution(models.Model):
    participant = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True)
    choice = models.ForeignKey(Choice, on_delete=models.SET_NULL, null=True)
    ans_text = models.CharField(max_length=50)
