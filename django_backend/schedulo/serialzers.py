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



class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['appointment_id','customer','outlet','employee','date','start_time','end_time','services','package','status','notes','created_at','updated_at']

class OutletSerializer(serializers.ModelSerializer):
    manager = UserProfileSerializer()
    class Meta:
        model = Outlet
        fields = ['outlet_id','name','email','contact_number','manager','address','opening_time','closing_time','is_active']