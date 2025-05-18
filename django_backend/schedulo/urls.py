from django.urls import path, include
from django.conf.urls.static import static
from .views import login_api, signup_api

urlpatterns = [
    path('auth/login/',login_api,name="login_api"),
    path('auth/signup/',signup_api,name="signup_api"),
    # path('api/logout/',logout_api,name="logout_api"),
]
