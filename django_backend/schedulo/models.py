
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
import uuid

# User model
class User(models.Model):
    """
    Extended User model with additional fields for the appointment management system.
    """
    USER_TYPES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
        ('customer', 'Customer'),
    )
    user_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    username = models.CharField(max_length=100,unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='customer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # def __str__(self):
    #     return f"{self.username} - {self.get_user_type_display()}"

# Outlet model
class Outlet(models.Model):
    """
    Represents a physical location or branch of the business.
    """
    outlet_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_outlets', 
                              limit_choices_to={'user_type': 'manager'})
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # def __str__(self):
    #     return self.name

# Service model
class Service(models.Model):
    """
    Represents individual services offered by the business.
    """
    service_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.DurationField(help_text="Duration in minutes")
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='service_images/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    outlets = models.ManyToManyField(Outlet, related_name='services')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (${self.price})"

# Product model
class Product(models.Model):
    """
    Represents products sold by the business.
    """
    product_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    outlets = models.ManyToManyField(Outlet, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (${self.price})"

# Package model
class Package(models.Model):
    """
    Represents bundles of services and/or products offered at a discounted rate.
    """
    package_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    services = models.ManyToManyField(Service, related_name='packages')
    products = models.ManyToManyField(Product, related_name='packages', blank=True)
    image = models.ImageField(upload_to='package_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    validity_days = models.PositiveIntegerField(default=30, help_text="Validity in days")
    outlets = models.ManyToManyField(Outlet, related_name='packages')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (${self.price})"

# Appointment model
class Appointment(models.Model):
    """
    Represents a scheduled appointment for services.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )
    
    appointment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments',
                               limit_choices_to={'user_type': 'customer'})
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='appointments')
    employee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                               related_name='assigned_appointments', 
                               limit_choices_to={'user_type': 'employee'})
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    services = models.ManyToManyField(Service, related_name='appointments', blank=True)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True, 
                             related_name='appointments')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.customer.username} at {self.outlet.name}"

# Payment model
class Payment(models.Model):
    """
    Represents payment transactions for appointments.
    """
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHOD = (
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('online_transfer', 'Online Transfer'),
        ('upi', 'UPI'),
    )
    
    payment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Payment {self.payment_id} for Appointment {self.appointment.appointment_id}"