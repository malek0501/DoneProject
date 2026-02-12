# Tickets Jira créés pour DoneProject

## Projet Jira
- **Nom**: DoneProject - Gestionnaire de Tâches
- **Clé**: DONE
- **URL**: https://etudiant-enit-team-fwu1hs3e.atlassian.net/browse/DONE

## Tickets Backend (7 tickets)
1. **DONE-1**: Créer le modèle User [Priorité: High]
2. **DONE-2**: Créer le modèle Task [Priorité: High]
3. **DONE-3**: Créer UserController [Priorité: High]
4. **DONE-4**: Créer TaskController [Priorité: High]
5. **DONE-5**: Créer les routes users [Priorité: High]
6. **DONE-6**: Créer les routes tasks [Priorité: High]
7. **DONE-7**: Configurer le serveur Express [Priorité: High]

## Tickets Frontend (4 tickets)
8. **DONE-8**: Créer l'interface HTML [Priorité: High]
9. **DONE-9**: Styliser l'interface CSS [Priorité: Medium]
10. **DONE-10**: Implémenter la logique JavaScript [Priorité: High]
11. **DONE-11**: Ajouter filtrage par statut [Priorité: Medium]

## Tickets Documentation (6 tickets)
12. **DONE-12**: Créer diagramme d'architecture PlantUML [Priorité: Medium]
13. **DONE-13**: Créer diagramme de classes PlantUML [Priorité: Medium]
14. **DONE-14**: Créer diagramme de séquence PlantUML [Priorité: Medium]
15. **DONE-15**: Créer diagramme flux de données PlantUML [Priorité: Low]
16. **DONE-16**: Créer diagramme MVC PlantUML [Priorité: Low]
17. **DONE-17**: Rédiger le README principal [Priorité: High]

## Tickets Tests (3 tickets)
18. **DONE-18**: Tests unitaires des modèles [Priorité: Medium]
19. **DONE-19**: Tests d'intégration API [Priorité: High]
20. **DONE-20**: Tests frontend [Priorité: Medium]

## Total: 20 tickets créés

## Commandes utiles

### Voir tous les tickets
```bash
curl -s -X GET \
  'https://etudiant-enit-team-fwu1hs3e.atlassian.net/rest/api/3/search?jql=project=DONE' \
  -H 'Authorization: Basic bWFsZWsuaGVybWFzc2lAZXR1ZGlhbnQtZW5pdC51dG0udG46QVRBVFQzeEZmR0YwTm9UVjk1RFhBZ3otNVpxUmR2VklOMUlyVHNMV1czVW0xVTM5UzhIbXNFWUNhclhiWWQwcnVrSExuZXNIYzhwUm9VdThWa25kYnFKWlFwb0hla2pxdGtyRG9qZ1FjT0JPeFFlNkhZNzBfeWxnaUdLRmlsUUIyTExRazFoZnZWVS0ybVRWeTBzTmlkWk9BYXlQcG5PcU9yYXhqZDM5dkJCeHI4TXVZTkxLTUlrPTU0MThGNDNG'
```

### Marquer un ticket comme "Done" (exemple DONE-1)
```bash
curl -X POST \
  'https://etudiant-enit-team-fwu1hs3e.atlassian.net/rest/api/3/issue/DONE-1/transitions' \
  -H 'Authorization: Basic bWFsZWsuaGVybWFzc2lAZXR1ZGlhbnQtZW5pdC51dG0udG46QVRBVFQzeEZmR0YwTm9UVjk1RFhBZ3otNVpxUmR2VklOMUlyVHNMV1czVW0xVTM5UzhIbXNFWUNhclhiWWQwcnVrSExuZXNIYzhwUm9VdThWa25kYnFKWlFwb0hla2pxdGtyRG9qZ1FjT0JPeFFlNkhZNzBfeWxnaUdLRmlsUUIyTExRazFoZnZWVS0ybVRWeTBzTmlkWk9BYXlQcG5PcU9yYXhqZDM5dkJCeHI4TXVZTkxLTUlrPTU0MThGNDNG' \
  -H 'Content-Type: application/json' \
  -d '{
    "transition": {
      "id": "41"
    }
  }'
```

### Variables d'environnement
```bash
export JIRA_BASE_URL="https://etudiant-enit-team-fwu1hs3e.atlassian.net"
export JIRA_USER_EMAIL="malek.hermassi@etudiant-enit.utm.tn"
export JIRA_API_TOKEN="YOUR_API_TOKEN_HERE"
export JIRA_DONE_TRANSITION_ID="41"
export JIRA_IN_REVIEW_TRANSITION_ID="31"
export JIRA_NEEDS_FIX_TRANSITION_ID="21"
```

> **Note**: Créez un fichier `.env` pour stocker vos credentials de manière sécurisée.
