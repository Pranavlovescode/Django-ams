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

# Simplified serializers for nested relationships to avoid circular dependencies
class SimpleServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['service_id','name','description','duration','price','category']

class SimplePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['package_id','name','category','duration','description','price']

class SimpleUserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ['profile_id','user_type','phone_number','user']

class ServiceSerializer(serializers.ModelSerializer):
    outlets = OutletSerializer(many=True)
    class Meta:
        model = Service
        fields = ['service_id','name','description','duration','price','category','is_active','outlets','created_at','updated_at']

class PackageSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True)
    outlets = OutletSerializer(many=True)

    class Meta:
        model = Package
        fields = ['package_id','name','category','duration','description','price','services','products','is_active','validity_days','outlets','created_at','updated_at']

class AppointmentSerializer(serializers.ModelSerializer):
    outlet = OutletSerializer()
    employee = SimpleUserProfileSerializer(allow_null=True)
    services = SimpleServiceSerializer(many=True)
    packages = SimplePackageSerializer(many=True)
    customer = SimpleUserProfileSerializer()
    class Meta:
        model = Appointment
        fields = ['appointment_id','customer','outlet','employee','appointment_time','services','packages','status','notes','created_at','updated_at']