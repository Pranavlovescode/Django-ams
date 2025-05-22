from rest_framework import serializers
from schedulo.models import UserProfile,Appointment, Service,Package,Outlet

class UserSerialzer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_id','user_type','choices','phone_number','address','date_of_birth','created_at','updated_at','password','user']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['appointment_id','customer','outlet','employee','date','start_time','end_time','services','package','status','notes','created_at','updated_at']

class OutletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outlet
        fields = ['outlet_id','name','email','contact_number','manager','address','opening_time','closing_time','is_active']