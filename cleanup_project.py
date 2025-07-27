#!/usr/bin/env python3
"""Cleanup script to remove test files and organize for frontend implementation"""

import os
import shutil

# Files to delete (test and temporary files)
FILES_TO_DELETE = [
    "test_db.py",
    "test_fetcher.py", 
    "test_scheduler.py",
    "test_api.py",
    "test_two_tier_system.py",
    "test_scheduler_demo.py",
    "quick_scheduler_test.py",
    "populate_database.py",
    "populate_all_stocks.py", 
    "smart_populate.py",
    "check_database.py",
    "backend/main_enhanced.py"  # Using main.py instead
]

import os
import shutil

import os
import shutil

def cleanup_project():
    """Remove unnecessary files from the project"""
    
    # Directories to remove completely
    directories_to_remove = [
        'myenv',  # Virtual environment should not be in version control
    ]
    
    # Individual files to remove
    files_to_remove = [
        # React default files
        'frontend/public/logo192.png',
        'frontend/public/logo512.png', 
        'frontend/public/manifest.json',
        'frontend/public/robots.txt',
        'frontend/README.md',
        
        # Documentation files (keeping PROJECT_STRUCTURE.md as it's useful)
        'README.md',  # Will create a new one
        
        # This cleanup script itself
        'cleanup_project.py',
    ]
    
    # Remove directories
    for dir_path in directories_to_remove:
        if os.path.exists(dir_path):
            try:
                shutil.rmtree(dir_path)
                print(f"Removed directory: {dir_path}")
            except Exception as e:
                print(f"Error removing directory {dir_path}: {e}")
        else:
            print(f"Directory not found: {dir_path}")
    
    # Remove individual files
    for file_path in files_to_remove:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Removed: {file_path}")
            except Exception as e:
                print(f"Error removing {file_path}: {e}")
        else:
            print(f"File not found: {file_path}")
    
    # Remove Python cache files
    cache_patterns = ['__pycache__', '*.pyc', '*.pyo', '*.pyd']
    for root, dirs, files in os.walk('.'): 
        # Remove __pycache__ directories
        if '__pycache__' in dirs:
            cache_dir = os.path.join(root, '__pycache__')
            try:
                shutil.rmtree(cache_dir)
                print(f"Removed cache directory: {cache_dir}")
            except Exception as e:
                print(f"Error removing cache directory {cache_dir}: {e}")
        
        # Remove .pyc files
        for file in files:
            if file.endswith(('.pyc', '.pyo', '.pyd')):
                cache_file = os.path.join(root, file)
                try:
                    os.remove(cache_file)
                    print(f"Removed cache file: {cache_file}")
                except Exception as e:
                    print(f"Error removing cache file {cache_file}: {e}")

if __name__ == "__main__":
    print("Starting project cleanup...")
    print("This will remove:")
    print("- myenv/ directory (virtual environment)")
    print("- React default files (logos, manifest, robots.txt)")
    print("- Documentation files")
    print("- Python cache files")
    print("- This cleanup script itself")
    
    confirm = input("Do you want to proceed? (y/N): ")
    if confirm.lower() == 'y':
        cleanup_project()
        print("Cleanup completed!")
        print("Remember to:")
        print("1. Add 'myenv/' to your .gitignore file")
        print("2. Create a requirements.txt with: pip freeze > requirements.txt")
        print("3. Update your README.md with setup instructions")
    else:
        print("Cleanup cancelled.")

if __name__ == "__main__":
    cleanup_project()
