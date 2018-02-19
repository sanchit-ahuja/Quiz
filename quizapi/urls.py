from quizapi import views
from django.conf.urls import url

app_name = 'quizapi'

urlpatterns = [

    url(r'^$', views.home),
    url(r'^authenticate/?$', views.authenticate_user, name="authenticate"),
    url(r'^question_list/?$', views.question_list),
    url(r'^home/?$', views.home, name="home"),
    url(r'^get_user_profile/?$', views.get_user_profile, name="get_user_profile"),
    url(r'^question/(?P<q_no>\d+)/$', views.get_question_details, name="get_question_details"),
    url(r'^get_answer/?$', views.get_answer, name="get_answer"),
    url(r'^logout/?$', views.user_logout, name="logout"),
    url(r'^get_leaderboard/?$', views.get_leaderboard, name="get_leaderboard"),
    url(r'^submit/?$', views.submit, name="submit"),
]