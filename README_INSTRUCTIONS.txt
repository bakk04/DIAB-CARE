================================================================================
          GUIDE D'INSTALLATION ET D'EXÉCUTION DU PROJET DIAB-CARE
================================================================================

Ce guide explique en détail comment installer, lancer et utiliser l'application 
DIAB-CARE (Frontend React/Vite + Backend FastAPI + Modèle d'IA Random Forest).

--------------------------------------------------------------------------------
1. PRÉREQUIS SYSTÈME
--------------------------------------------------------------------------------
Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- Node.js (version 18 ou supérieure) : pour exécuter l'interface (Frontend).
- Python (version 3.10 ou supérieure) : pour exécuter le serveur API et l'IA (Backend).

--------------------------------------------------------------------------------
2. ÉTAPE 1 : INSTALLATION ET PRÉPARATION DU FRONTEND (Interface)
--------------------------------------------------------------------------------
Le code du frontend se trouve à la racine du dossier du projet.

1. Ouvrez un terminal (PowerShell, Command Prompt ou Bash) dans le dossier 
   principal du projet (le dossier racine "Diabete").
2. Exécutez la commande suivante pour installer toutes les bibliothèques et 
   dépendances de l'interface :
   
   npm install

--------------------------------------------------------------------------------
3. ÉTAPE 2 : CONFIGURATION ET INSTALLATION DU BACKEND (Serveur API & IA)
--------------------------------------------------------------------------------
Le code du backend se trouve dans le sous-dossier nommé "backend/".

1. Ouvrez un nouveau terminal et déplacez-vous dans le dossier "backend" :
   (ou ouvrez le dossier "backend/" directement dans votre invite de commande)

   Chemin physique du dossier :
   C:\Users\dell\Documents\Diabete\backend

2. (Recommandé) Créez un environnement virtuel Python pour isoler le projet :
   python -m venv .venv

3. Activez l'environnement virtuel :
   - Sur Windows (PowerShell) : 
     .venv\Scripts\Activate.ps1
   - Sur Windows (Invite de commandes classique CMD) : 
     .venv\Scripts\activate.bat
   - Sur macOS/Linux : 
     source .venv/bin/activate

4. Installez toutes les bibliothèques requises du backend (FastAPI, PyJWT, 
   Bcrypt, Scikit-learn, Pandas, SQLAlchemy, etc.) :
   
   pip install -r requirements.txt

--------------------------------------------------------------------------------
4. ÉTAPE 3 : DÉMARRAGE DE L'APPLICATION
--------------------------------------------------------------------------------

A. Lancer le Backend (Serveur API & IA) :
   1. Restez dans le terminal du dossier "backend" (avec l'environnement activé).
   2. Exécutez la commande suivante :
      
      python main.py
      
   * Note importante : Lors du tout premier démarrage, le serveur va automatiquement 
     télécharger le jeu de données officiel "Pima Indians Diabetes", entraîner 
     le modèle d'IA (Random Forest Classifier) sur votre machine locale, le sauvegarder 
     dans "models_ai/diabetes_model.pkl" et créer le fichier de base de données 
     SQLite "diabcare.db". Le serveur écoutera sur le port http://127.0.0.1:8000.

B. Lancer le Frontend (Interface utilisateur) :
   1. Dans le premier terminal (situé à la racine du projet "Diabete"), lancez :
      
      npm run dev
      
   2. Ouvrez le lien affiché dans votre navigateur (généralement http://localhost:5173).

