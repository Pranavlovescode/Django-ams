from rest_framework import serializers
from schedulo.models import UserProfile,Appointment, Service,Package

class UserSerialzer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_id','user_type','choices','phone_number','address','date_of_birth','created_at','updated_at','password','user']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['appointment_id','customer','outlet','employee','date','start_time','end_time','services','package','status','notes','created_at','updated_at']
