#!/usr/bin/env python
import os
import sys

def main():
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_path)
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ems_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()

