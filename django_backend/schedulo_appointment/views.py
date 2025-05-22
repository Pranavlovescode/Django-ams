from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate
from schedulo.models import UserProfile,Appointment,Outlet
from django.contrib.auth.models import User as DjangoUser
from schedulo.serialzers import OutletSerializer,AppointmentSerializer

""" Appointment routes"""

@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def appointments_details(request):
    if request.method == "GET":
        outlet_id = request.args.get('outlet_id')
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


@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def outlets(request):
    if request.method == "GET":
        outlets = Outlet.objects.get()
        outlet_serialzer = OutletSerializer(outlets)
        return Response({
            'message':"Outlet fetched successfuly",
            "outlets":outlet_serialzer
        },status=status.HTTP_200_OK)
    
    if request.method == "POST":
        name = request.data.get('name')
        address = request.data.get('address')
        email = request.data.get('email')
        contact_number = request.data.get('telephone_number')
        manager_id = request.data.get('manager_id')
        opening_time = request.data.get('opening_time')
        closing_time = request.data.get('closing_time')


        new_outlet = Outlet(name=name,address=address,contact_number=contact_number,email=email,manager=manager_id,opening_time=opening_time,closing_time=closing_time)
        
        if OutletSerializer(new_outlet).is_valid():
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