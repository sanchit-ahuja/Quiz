from rest_framework import serializers
from .models import *

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('email', 'time_spent', 'login_time', 'is_complete')

class ParticipantSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('email', 'time_spent', 'score')

class QuestionSerializer(serializers.ModelSerializer):

	class Meta:
		model = Question
		fields = ('text', 'q_no', 'points', 'id', )

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('c_text', 'id',)