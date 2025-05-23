from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate
from schedulo.models import UserProfile,Appointment,Outlet,Service,Package
from django.contrib.auth.models import User as DjangoUser
from schedulo.serialzers import OutletSerializer,AppointmentSerializer,ServiceSerializer,PackageSerializer
from datetime import timedelta

""" Appointment Routes"""

@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def appointments_details(request):
    if request.method == "GET":
        outlet_id = request.query_params.get('outlet_id')
        appointment = Appointment.objects.get(outlet=outlet_id)
        appointment_serializer = AppointmentSerializer(appointment)
        return Response({
            'message': 'Appointment found for outlet id',
            'appointment': appointment_serializer.data
        }, status=status.HTTP_200_OK)

    
    if request.method == 'POST':
        customer_name = request.data.get('customer_name')
        customer_email = request.data.get('customer_email')
        customer_mobile_phone = request.data.get('customer_mobile_phone')


"""Outlet Routes"""

@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def outlets(request):
    if request.method == "GET":
        try:
            outlets = Outlet.objects.select_related('manager').all()
            
            # Check if outlets exist
            if not outlets.exists():
                return Response({
                    'message': "No outlets found"
                }, status=status.HTTP_404_NOT_FOUND)
                
            outlet_serializer = OutletSerializer(outlets, many=True)
            return Response({
                'message': "Outlets fetched successfully",
                "outlets": outlet_serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'message': f"Error fetching outlets: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == "POST":
        name = request.data.get('name')
        address = request.data.get('address')
        email = request.data.get('email')
        contact_number = request.data.get('telephone_number')
        manager_id = request.data.get('manager_id')
        opening_time = request.data.get('opening_time')
        closing_time = request.data.get('closing_time')

        manager = UserProfile.objects.get(profile_id=manager_id)


        new_outlet = Outlet(name=name,address=address,contact_number=contact_number,email=email,manager=manager,opening_time=opening_time,closing_time=closing_time)
        valid = OutletSerializer(new_outlet)
        if valid:
            new_outlet.save()
            print(new_outlet)
            return Response({
                'message':"Outlet created successfuly",
                "outlet":OutletSerializer(new_outlet).data
            },status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message':"Outlet serializer error",
            },status=status.HTTP_400_BAD_REQUEST)



"""Services Routes"""
@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def services_function(request):
    outlet_id = request.query_params.get('outlet_id')
    if request.method == "GET":
        try:
            services = Service.objects.filter(outlets__outlet_id=outlet_id)
            
            # When querying multiple objects, use many=True
            serializer = ServiceSerializer(services, many=True)

            return Response({
                'message': "Services fetched for given outlet successfully",
                "services": serializer.data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'message': f"Error fetching services: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == "POST":
        try:
            name = request.data.get('name')
            description = request.data.get('description')
            duration_minutes = request.data.get('duration')
            price = request.data.get('price')
            category = request.data.get('category')

            duration = timedelta(minutes=int(duration_minutes))

            # First create the service without the many-to-many relationship
            service_data = Service.objects.create(
                name=name,
                description=description,
                duration=duration,
                price=price,
                category=category,
                is_active=True
            )
            
            # Then add the outlet to the many-to-many relationship
            outlet = Outlet.objects.get(outlet_id=outlet_id)
            service_data.outlets.add(outlet)

            serializer_service = ServiceSerializer(service_data)

            return Response({
                'message': "Service saved successfully",
                'service': serializer_service.data
            }, status=status.HTTP_201_CREATED)
        except Outlet.DoesNotExist:
            return Response({
                'message': f"Outlet with ID {outlet_id} not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'message': f"Error saving services: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)