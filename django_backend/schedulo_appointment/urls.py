from django.urls import path, include
from django.conf.urls.static import static
from .views import outlets,services_function,package_function,appointments_details,user_details


urlpatterns = [
    path('outlet/',outlets,name="outlets"),
    path('services/',services_function,name="services"),
    path('packages/',package_function,name="packages"),
    path('appointment/',appointments_details,name="appointments"),
    path('user/', user_details, name="user_details"),
]
