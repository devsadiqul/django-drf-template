# general helper functions
from django.utils import timezone

def get_current_time():
    return timezone.now()

def generate_unique_code(prefix: str, length: int = 6):
    import random, string
    return prefix + ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
