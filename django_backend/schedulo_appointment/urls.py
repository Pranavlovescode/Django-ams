from django.urls import path, include
from django.conf.urls.static import static
from .views import outlets,services_function,package_function


urlpatterns = [
    path('outlet/',outlets,name="outlets"),
    path('services/',services_function,name="services"),
    path('packages/',package_function,name="packages"),
]
