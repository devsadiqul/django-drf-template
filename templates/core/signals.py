"""
core/signals.py

Purpose:
- Contains project-wide signals (Django signals).
- Example uses:
    - User creation post_save hook
    - Post model actions
- Central place to define signals to avoid repeating in multiple apps.
- Ensures event-driven logic is reusable and consistent across project.
"""
