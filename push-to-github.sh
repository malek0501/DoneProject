#!/bin/bash

# Script automatique pour créer et pousser vers GitHub

echo "======================================"
echo "🚀 Push vers GitHub"
echo "======================================"
echo

# Créer le repository avec GitHub CLI (automatique)
gh repo create DoneProject \
  --public \
  --description "Gestionnaire de tâches Full Stack avec Node.js/Express et architecture MVC" \
  --source=. \
  --remote=origin

if [ $? -eq 0 ]; then
    echo
    echo "✅ Repository créé!"
    echo
    echo "📤 Push des branches..."
    
    git push -u origin main
    echo "✅ Branche main poussée"
    
    git push -u origin feature/DONE-1-creer-modele-user
    echo "✅ Branche feature/DONE-1 poussée"
    
    echo
    echo "======================================"
    echo "✅ Terminé!"
    echo "======================================"
    
    REPO_URL=$(gh repo view --json url -q .url)
    echo "🔗 URL: $REPO_URL"
    echo
else
    echo
    echo "⚠️  Si le repo existe déjà, utilisez:"
    echo
    echo "git remote add origin <URL>"
    echo "git push -u origin main"
    echo "git push -u origin feature/DONE-1-creer-modele-user"
fi
