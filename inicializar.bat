@echo off
title Iniciar Proyecto - Backend y Frontend

echo Iniciando backend...
start cmd /k "cd Backend && venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

echo Iniciando frontend...
start cmd /k "cd frontend && npm run dev"

echo Proyecto iniciado. Espera unos segundos y visita:
echo http://192.168.1.51:8000   (Backend)
echo http://192.168.1.51:5173   (Frontend)

pause
