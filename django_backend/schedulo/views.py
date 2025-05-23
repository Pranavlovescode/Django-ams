from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate
from schedulo.models import UserProfile
from django.contrib.auth.models import User as DjangoUser
from .serialzers import UserProfileSerializer
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
        # Get or create token
        token, created = Token.objects.get_or_create(user=django_user)
        
        # Get or create custom user
        try:
            custom_user = DjangoUser.objects.get(username=django_user.username)
        except DjangoUser.DoesNotExist:
            # Return the message that the user does not exist
            return Response(
                {'message': 'User does not exist'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = UserProfile(custom_user)
        return Response({
            'message': 'Login successful',
            'token': token.key
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
    user_type = request.data.get('user_type')
    
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
        password=password  # This will be hashed automatically
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