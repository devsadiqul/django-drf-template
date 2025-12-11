from .base import *

DEBUG = True

# Local allowed hosts
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# SQLite is fine for dev
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email backend (console for dev)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
