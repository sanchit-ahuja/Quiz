from django.shortcuts import render, get_object_or_404, redirect, reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from rest_framework.response import Response
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.contrib.auth import login, logout, authenticate
from quizapi.extern import generateScore
import string
from random import choice
from pytz import timezone

chars = string.letters + string.digits
for i in '0oO1QlLiI':
    chars = chars.replace(i,'')

OAUTH_CLIENT_ID = '873252659214-md1pcn2npkm82mu269plbogbhc7ap7r2.apps.googleusercontent.com'


@csrf_exempt
def authenticate_user(request):
    if request.method == 'POST':
        token = request.POST['id_token']
        # try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), OAUTH_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return JsonResponse({'message':'Invalid user'})
        email = idinfo['email']
        try:
            user_p = UserProfile.objects.get(email=email)
            user = user_p.user
            login(request, user)
            return redirect('quizapi:home')
            # return render(request, 'quizapi/test.html', {'username':user.username})
            # return HttpResponse('fine.')
        except:
            username = email.split('@')[0]
            password = ''.join(choice(chars) for _ in xrange(8))
            user = User.objects.create_user(username=username, password=password)
            user_p = UserProfile.objects.create(email=email, user=user)
            user_p.user = user
            user_p.save()
            user = authenticate(username=username, password=password)
            if user.is_active:
                login(request, user)
                return redirect('quizapi:home')
                # return HttpResponse('fine.')
            else:
                return JsonResponse({'message':"Inactive user."})
        # except:
        #     return JsonResponse({'message':'Invalid Access.'})
    return render(request, 'quizapi/index.html')


def home(request):
    if not request.user.is_authenticated():
        return redirect('quizapi:authenticate')
    user = request.user
    return render(request, 'quizapi/test.html', {'username':user.username})


@login_required(login_url = '/2018main/')
def get_user_profile(request):
    user = request.user
    user_p = UserProfile.objects.get(user=user)
    try:
        login_time = user_p.login_time
    except:
        login_time = datetime.now(timezone('Asia/Kolkata'))
    minutes, seconds = divmod((datetime.now(timezone('Asia/Kolkata'))-login_time).total_seconds(), 60)
    user_p.time_spent += int(60*minutes+seconds)
    user_p.login_time = datetime.now()
    user_p.save()
    if user_p.time_spent > 1800:
        user_p.time_spent = 1900
        user_p.save()
    profile_data = UserProfileSerializer(user_p)
    questions = []
    for sol in user_p.solution_set.all():
        questions.append(sol.question)
    questions_solved = QuestionSerializer(questions, many=True)
    return JsonResponse({'profile':profile_data.data, 'questions_solved':questions_solved.data})


@login_required(login_url='/2018main/')
def get_answer(request):
    user = request.user
    user_p = UserProfile.objects.get(user=user)
    curr_time = datetime.now()
    if user_p.is_complete:
        return JsonResponse({'status':0, 'message':'Time Over. Thanks for playing. Your score is %d'%(user_p.score)})
    minutes, seconds = divmod((datetime.now(timezone('Asia/Kolkata'))-user_p.login_time).total_seconds(), 60)
    time_spent = int(60*minutes+seconds)
    if (time_spent + user_p.time_spent)>1800:
        generateScore(user_p) # see the file "extern"
        user_p.is_complete = True
        user_p.time_spent = 1900
        user_p.save()
        return JsonResponse({'status':0, 'message':'Quiz over. Thanks for playing. Your score is %d'%(user_p.score)})
    else:
        if request.method == 'POST':
            data = request.POST
            question = Question.objects.get(id=int(data['q_id']))
            if question.q_type == 'MCQ':
                try:
                    choice = Choice.objects.get(id=int(data['c_id']))
                except:
                    return JsonResponse({'message':'Invalid inputs.'})
                try:
                    solution = Solution.objects.get(participant=user_p, question=question)
                    solution.choice = choice
                    solution.save()
                except:
                    Solution.objects.create(participant=user_p, question=question, choice=choice)
            elif question.q_type == 'FITB':
                ans_text = data['FIT_ans']
                try:
                    solution = Solution.objects.get(participant=user_p, question=question)
                    solution.ans_text = ans_text
                    solution.save()
                except:
                    Solution.objects.create(participant=user_p, question=question, ans_text=ans_text)
            else:
                pass
            return JsonResponse({'message':"Successfully saved response."})


@login_required(login_url='/2018main/')
def get_question_details(request, q_no):
    user = request.user
    user_p = UserProfile.objects.get(user=user)
    question = Question.objects.get(q_no=int(q_no))
    question_serializer = QuestionSerializer(question)
    try:
        solution = Solution.objects.get(question=question, participant=user_p)
        if question.q_type == 'MCQ':
            choices_serializer = ChoiceSerializer(question.choice_set.all(), many=True)
            selected = ChoiceSerializer(solution.choice)
            return JsonResponse({'question':question_serializer.data, 'choices':choices_serializer.data, 'selected':selected.data})
        elif question.q_type == 'FITB':
            return JsonResponse({'question':question_serializer.data, 'fillin':solution.ans_text})
        else:
            return JsonResponse({'message':'Invalid input.'})
    except:
        if question.q_type == 'MCQ':
            choices_serializer = ChoiceSerializer(question.choice_set.all(), many=True)
            return JsonResponse({'question':question_serializer.data, 'choices':choices_serializer.data})
        elif question.q_type == 'FITB':
            return JsonResponse({'question':question_serializer.data})
        else:
            return JsonResponse({'message':'Invalid input.'})


@api_view(['GET'])
@permission_classes((AllowAny,))
def question_list(request):
	questions_serializer = QuestionSerializer(Question.objects.all().order_by('q_no'), many=True)
	return Response({'questions':questions_serializer.data})


@login_required(login_url='/2018main/')
def submit(request):
    user = request.user
    user_p = UserProfile.objects.get(user=user)
    generateScore(user_p)
    user_p.is_complete = True
    user_p.save()
    return JsonResponse({'status':1, 'message':'Quiz over. Thanks for playing. Your score is %d'%(user_p.score)})


@login_required(login_url='/2018main/')
def user_logout(request):
    user = request.user
    logout(request)
    return JsonResponse({'status':1, })


@login_required(login_url='/2018main/')
def get_leaderboard(request):
    user = request.user
    player = ParticipantSerializer(UserProfile.objects.get(user=user))
    participants = ParticipantSerializer(UserProfile.objects.filter(is_complete=True).order_by('-score')[:15], many=True)
    return JsonResponse({'participants':participants.data, 'player':player.data})
