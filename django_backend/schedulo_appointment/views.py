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

@api_view(["GET","POST","PATCH","DELETE"])
@permission_classes([IsAuthenticated])
def appointments_details(request):
    if request.method == "GET":
        outlet_id = request.query_params.get('outlet_id')
        appointment = Appointment.objects.filter(outlet__outlet_id=outlet_id)
        appointment_serializer = AppointmentSerializer(appointment,many=True)
        return Response({
            'message': 'Appointment found for outlet id',
            'appointment': appointment_serializer.data
        }, status=status.HTTP_200_OK)

    
    if request.method == 'POST':
        customer_id = request.data.get('customer_id')
        outlet_id = request.data.get('outlet_id')
        employee_id = request.data.get('employee_id')
        services_ids = request.data.get('services_id')
        packages_ids = request.data.get('packages_id')
        appointment_time = request.data.get('appointment_time')
        services = []
        packages = []

        for service_id in services_ids:
            try:
                service = Service.objects.get(service_id=service_id)
                services.append(service)
            except Service.DoesNotExist:
                return Response({
                    'message': f"Service with ID {service_id} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

        for package_id in packages_ids:
            try:
                package = Package.objects.get(package_id=package_id)
                packages.append(package)
            except Package.DoesNotExist:
                return Response({
                    'message': f"Package with ID {package_id} does not exist"
                }, status=status.HTTP_404_NOT_FOUND)

        try:
            customer = UserProfile.objects.get(profile_id=customer_id)
            outlet = Outlet.objects.get(outlet_id=outlet_id)
            employee = UserProfile.objects.get(profile_id=employee_id)
            new_appointment = Appointment(
                customer=customer,
                outlet=outlet,
                employee=employee,
                appointment_time=appointment_time,
                status='pending'
            )
            
            new_appointment.save()  # Save before setting ManyToMany

            if services:
                new_appointment.services.set(services)

            if packages:
                new_appointment.packages.set(packages)
            
            appointment_serializer = AppointmentSerializer(new_appointment)
            return Response({
                'message': 'Appointment created successfully',
                'appointment': appointment_serializer.data
            }, status=status.HTTP_201_CREATED)
        

        except UserProfile.DoesNotExist:
            return Response({
                'message': "UserProfile not found for the provided IDs"
            }, status=status.HTTP_404_NOT_FOUND)
        

    if request.method == "PATCH":
        appointment_id = request.query_params.get('appointment_id')
        
        try:
            appointment = Appointment.objects.get(appointment_id=appointment_id)

            services_ids = request.data.get('services_id', [])
            packages_ids = request.data.get('packages_id', [])

            services = []
            packages = []

            # Validate services if provided
            if services_ids:
                for service_id in services_ids:
                    try:
                        service = Service.objects.get(service_id=service_id)
                        services.append(service)
                    except Service.DoesNotExist:
                        return Response({
                            'message': f"Service with ID {service_id} does not exist"
                        }, status=status.HTTP_404_NOT_FOUND)

            # Validate packages if provided
            if packages_ids:
                for package_id in packages_ids:
                    try:
                        package = Package.objects.get(package_id=package_id)
                        packages.append(package)
                    except Package.DoesNotExist:
                        return Response({
                            'message': f"Package with ID {package_id} does not exist"
                        }, status=status.HTTP_404_NOT_FOUND)

            # Use DRF serializer to validate and update standard fields
            serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                # Manually update many-to-many fields after saving
                if services_ids:
                    appointment.services.set(services)
                if packages_ids:
                    appointment.package.set(packages)

                return Response({
                    'message': "Appointment updated successfully",
                    'appointment': AppointmentSerializer(appointment).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': "Invalid data",
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Appointment.DoesNotExist:
            return Response({
                'message': f"Appointment with ID {appointment_id} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)
        
    
    if request.method == "DELETE":
        appointment_id = request.query_params.get('appointment_id')

        if not appointment_id:
            return Response({
                'message': "Missing appointment_id in query parameters"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            appointment = Appointment.objects.get(appointment_id=appointment_id)
            appointment.delete()
            return Response({
                'message': "Appointment deleted successfully"
            }, status=status.HTTP_200_OK) 

        except Appointment.DoesNotExist:
            return Response({
                'message': f"Appointment with ID {appointment_id} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)






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
        name = request.data.get('outlet_name')
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
    service_id = request.query_params.get('service_id')
    if request.method == "GET":
        try:
            if service_id:
                try:
                    one_service = Service.objects.get(service_id=service_id)
                    serializer = ServiceSerializer(one_service)
                    return Response({
                        'message': "Service fetched successfully",
                        "service": serializer.data
                    }, status=status.HTTP_200_OK)
                except Service.DoesNotExist:
                    return Response({
                        'message': "Service not found"
                    }, status=status.HTTP_404_NOT_FOUND)

            elif outlet_id:
                services = Service.objects.filter(outlets__outlet_id=outlet_id, is_active=True).distinct()
            else:
                services = Service.objects.filter(is_active=True)

            serializer = ServiceSerializer(services, many=True)
            return Response({
                'message': "Services fetched successfully",
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
            outlets = []
            # Then add the outlet to the many-to-many relationship
            if not request.data.get('outlets', []):
                return Response({
                    'message': "Outlet ID is required to associate the service"
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    for outlet_id in request.data.get('outlets', []):
                        outlet = Outlet.objects.get(outlet_id=outlet_id)
                        outlets.append(outlet)
                except Outlet.DoesNotExist:
                    return Response({
                        'message': f"Outlet with ID {outlet_id} not found"
                    }, status=status.HTTP_404_NOT_FOUND)
            
            serializer_service = ServiceSerializer(service_data)
            # Associate the service with the outlets
            service_data.outlets.set(outlets)

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
        

"""Package Routes"""
@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def package_function(request):
    outlet_id = request.query_params.get('outlet_id')
    if request.method == "GET":
        try:
            packages = Package.objects.filter(outlets__outlet_id=outlet_id).distinct()
            serializer = PackageSerializer(packages, many=True)
            return Response({
                'message': "Packages fetched successfully",
                "packages": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'message': f"Error fetching packages: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == "POST":
        try:
            name = request.data.get('name')
            description = request.data.get('description')
            price = request.data.get('price')
            validity_days = request.data.get('validity_days')
            outlet_id = request.data.get('outlet_id')


            outlet = Outlet.objects.get(outlet_id=outlet_id)

            new_package = Package(
                name=name,
                description=description,
                price=price,
                validity_days=validity_days,
                is_active=True
            )
            new_package.save()
            new_package.outlets.add(outlet)
            services_ids = request.data.get('services', [])

            if not isinstance(services_ids, list):
                return Response({
                    'message': "Services should be a list of service IDs"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set the services for the package
            if not services_ids:
                return Response({
                    'message': "At least one service must be provided"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            services = Service.objects.filter(service_id__in=services_ids)
            if not services.exists():
                return Response({
                    'message': "One or more services not found"
                }, status=status.HTTP_404_NOT_FOUND)
            
            new_package.services.set(services)  # Assuming services is a list of service IDs

            serializer_package = PackageSerializer(new_package)

            return Response({
                'message': "Package created successfully",
                'package': serializer_package.data
            }, status=status.HTTP_201_CREATED)
        except Outlet.DoesNotExist:
            return Response({
                'message': f"Outlet with ID {outlet_id} not found"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'message': f"Error creating package: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

"""User Details Route"""
@api_view(["GET","POST"])
@permission_classes([IsAuthenticated])
def user_details(request):
    if request.method == "GET":
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            profile_data = {
                'profile_id': user_profile.profile_id,
                'first_name': user_profile.first_name,
                'last_name': user_profile.last_name,
                'email': user_profile.email,
                'phone_number': user_profile.phone_number,
                'role': user_profile.role,
            }
            return Response({
                'message': "User profile fetched successfully",
                'user_profile': profile_data
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({
                'message': "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "POST":
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)

            # Update fields if provided in the request data
            user_profile.first_name = request.data.get('first_name', user_profile.first_name)
            user_profile.last_name = request.data.get('last_name', user_profile.last_name)
            user_profile.email = request.data.get('email', user_profile.email)
            user_profile.phone_number = request.data.get('phone_number', user_profile.phone_number)

            user_profile.save()

            profile_data = {
                'profile_id': user_profile.profile_id,
                'first_name': user_profile.first_name,
                'last_name': user_profile.last_name,
                'email': user_profile.email,
                'phone_number': user_profile.phone_number,
                'role': user_profile.role,
            }

            return Response({
                'message': "User profile updated successfully",
                'user_profile': profile_data
            }, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response({
                'message': "User profile not found"
            }, status=status.HTTP_404_NOT_FOUND)

