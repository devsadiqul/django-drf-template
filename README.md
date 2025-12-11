# Django DRF Template VS Code Extension

Professional Django + DRF starter template scaffolded directly from VS Code.  
Includes JWT authentication, Docker support, modular apps, and ready-to-use project structure. Ideal for production-ready projects.

---

## Features

- Scaffold a complete Django + DRF project with one command
- JWT authentication pre-configured
- Modular apps structure
- Docker and docker-compose support
- VS Code integration for quick development
- API versioning support
- `.env` configuration ready
- Easy to customize and extend
- Ready-to-run `requirements.txt`

---

## Installation

### Option 1: From VS Code Marketplace

1. Open VS Code → Extensions Panel (`Ctrl+Shift+X`)  
2. Search for `Django DRF Template`  
3. Click **Install**

### Option 2: From local VSIX file

1. Open VS Code → Extensions Panel → More Actions (⋯) → `Install from VSIX...`  
2. Select `django-drf-template-x.x.x.vsix`  
3. Install and reload VS Code  

---

## Usage

### 1. Open a Workspace Folder

- Open an empty or existing folder in VS Code  
- Scaffolded files will be copied into this folder  

### 2. Run Scaffold Command

1. Open **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)  
2. Search for:  Django DRF Template: Scaffold Project

3. Press Enter to run the command  

> Optional: If implemented, follow prompts for project name or target folder.

### 3. Scaffold Result

- The workspace folder will now contain a fully scaffolded Django + DRF project  
- Folder structure example:

```text
manage.py
Dockerfile
docker-compose.yml
.env
apps/
api/
backend/
common/
core/
requirements.txt

