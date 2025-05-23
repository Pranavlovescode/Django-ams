from rest_framework import serializers
from schedulo.models import UserProfile,Appointment, Service,Package,Outlet
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','username','password']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ['profile_id','user_type','phone_number','address','date_of_birth','created_at','updated_at','user']


class OutletSerializer(serializers.ModelSerializer):
    manager = UserProfileSerializer()
    class Meta:
        model = Outlet
        fields = ['outlet_id','name','email','contact_number','manager','address','opening_time','closing_time','is_active']

class ServiceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Service
        fields = ['service_id','name','description','duration','price','category','is_active','outlets','created_at','updated_at']

class PackageSerializer(serializers.ModelSerializer):
    outlets = OutletSerializer()
    services = ServiceSerializer()
    class Meta:
        model = Package
        fields = ['package_id','name','description','price','services','products','is_active','validity_days','outlets','created_at','updated_at']

class AppointmentSerializer(serializers.ModelSerializer):
    outlet = OutletSerializer()
    employee = UserSerializer()
    services=ServiceSerializer()
    package=PackageSerializer()
    class Meta:
        model = Appointment
        fields = ['appointment_id','customer','outlet','employee','date','start_time','end_time','services','package','status','notes','created_at','updated_at']