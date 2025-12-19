from django.urls import path, include
from django.conf.urls.static import static
from .views import login_api, signup_api,logout_api,user_details,get_all_users

urlpatterns = [
    path('auth/login/',login_api,name="login_api"),
    path('auth/signup/',signup_api,name="signup_api"),
    path('auth/logout/',logout_api,name="logout_api"),
    path('auth/user/', user_details, name="user_details"),
    path('auth/user-get-all/', get_all_users, name="get_all_users"),
]
