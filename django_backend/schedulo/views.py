from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate
from schedulo.models import UserProfile,Outlet
from django.contrib.auth.models import User as DjangoUser
from .serialzers import UserProfileSerializer, OutletSerializer
# Create your views here.

# Authencation routes
"""
LOGIN ROUTE
"""

@api_view(['POST','GET'])
def login_api(request):
    """
    API endpoint for user login using DRF's authentication
    """
    # Handle GET requests
    if request.method == 'GET':
        return Response({
            'message': 'Please provide username and password to login',
            'isAuthenticated': request.user.is_authenticated if hasattr(request, 'user') else False
        })
    # Handle POST requests
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f'Login attempt for: {username}')
    
    if not username or not password:
        return Response(
            {'message': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Use Django's built-in authentication
    django_user = authenticate(username=username, password=password)

    if not django_user:
        # Try with username
        try:
            django_user_obj = DjangoUser.objects.get(username=username)            
            django_user = authenticate(username=django_user_obj.username, password=password)
        except DjangoUser.DoesNotExist:
            return Response(
                {'message': 'User does not exist'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
    if django_user:
        token, created = Token.objects.get_or_create(user=django_user)

        try:
            custom_user = UserProfile.objects.get(user=django_user)
            print(f'Custom user found: {custom_user.profile_id}')
        except UserProfile.DoesNotExist:
            return Response(
                {'message': 'User profile does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Try to get outlet (optional)
        outlet = Outlet.objects.filter(manager=custom_user).first()

        serializer = UserProfileSerializer(custom_user)
        outlet_serializer = OutletSerializer(outlet) if outlet else None

        return Response({
            'message': 'Login successful',
            'token': token.key,
            'logged_in_user': serializer.data,
            'outlet': outlet_serializer.data if outlet_serializer else None
        }, status=status.HTTP_200_OK)

    else:
        return Response(
            {'message': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


""" SIGNUP ROUTE """
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    phone_number = request.data.get('phone_number')
    address = request.data.get('address')
    date_of_birth = request.data.get('dob')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    user_type = 'customer'  # Default user type
    print(f"request body: {request.data}")
    # Validate required fields
    if not all([user_type, date_of_birth, address, phone_number, username, password]):
        return Response(
            {'message': 'All fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if username exists
    if DjangoUser.objects.filter(username=username).exists():
        return Response(
            {'message': 'Username already taken'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create Django User
    django_user = DjangoUser.objects.create_user(
        username=username,
        password=password,  # This will be hashed automatically
        first_name=first_name,
        last_name=last_name
    )
    
    # Create the profile
    profile = UserProfile.objects.create(
        user=django_user,
        user_type=user_type,
        date_of_birth=date_of_birth,
        address=address,
        phone_number=phone_number
    )
    
    # Create token for the Django User
    token, created = Token.objects.get_or_create(user=django_user)
    
    # Serialize user and profile data together
    user_data = {
        'id': django_user.id,
        'username': django_user.username,
        'user_type': profile.user_type,
        'phone_number': profile.phone_number,
        'address': profile.address,
        'date_of_birth': profile.date_of_birth
    }
    
    return Response({
        'message': 'Signup successful',
        'token': token.key,
        'user': user_data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """
    API endpoint for user logout
    Deletes the user's authentication token
    """
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        print(f'Logout attempt for token: {token_key}')
        try:
            token = Token.objects.get(key=token_key)
            token.delete()
            return Response(
                {'message': 'Successfully logged out'}, 
                status=status.HTTP_200_OK
            )
        except Token.DoesNotExist:
            pass
                
    return Response(
        {'message': 'Invalid token or not authenticated'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_details(request):
    """
    API endpoint to get details of the authenticated user
    """
    django_user = request.user
    try:
        custom_user = UserProfile.objects.get(user=django_user)
        serializer = UserProfileSerializer(custom_user)
        return Response({
            'message': 'User details fetched successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response(
            {'message': 'User profile does not exist'},
            status=status.HTTP_404_NOT_FOUND
        )
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """
    API endpoint to get details of all users
    """
    users = UserProfile.objects.all()
    serializer = UserProfileSerializer(users, many=True)
    return Response({
        'message': 'All users fetched successfully',
        'users': serializer.data
    }, status=status.HTTP_200_OK)