---
title: Équilibreur de charge
---

Un équilibreur de charge répartit le trafic entrant entre plusieurs serveurs afin d'assurer la haute
disponibilité, la fiabilité et de meilleures performances.

### Créer un équilibreur de charge

- Dans le menu de gauche, cliquez sur **Équilibreur de charge**.
- Cliquez sur l'icône **+**.

:::note

Captures d'écran à venir.

:::

### Étapes

1. **Emplacement** : sélectionnez le centre de données.
2. **Projet** : assignez l'équilibreur de charge à un projet.
3. **Réseau** : sélectionnez le réseau où l'équilibreur de charge fonctionnera.
4. **IP** : choisissez une **Existing IP** ou **Acquire New IP** (crée une IP isolée par défaut dans
   la zone sélectionnée).
5. **Forwarding Rules** :
   - **Nom de la règle**, **protocole** (TCP, UDP, HTTP, HTTPS), plage de ports
   - **Algorithme** : Source IP, Round Robin ou Least Connections
   - **Sessions persistantes** : LB Cookie, App Cookie, Source-Based ou None
   - Sélectionnez les **instances VM** qui traiteront le trafic
6. **Nom** : caractères alphanumériques, traits d'union et points seulement.
7. **Créer** :
   - Cycles de facturation : Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
     Tri-annually
   - Un forfait par zone
   - Cliquez sur **Créer Équilibreur de charge**

:::note

Captures d'écran à venir.

:::

### Attacher des VM supplémentaires

Après la création, cliquez sur l'équilibreur de charge, puis sur **Ajouter VM** pour attacher
d'autres instances au backend.

Voir aussi : [Réseaux publics](../networking/public-network/create),
[VPC](../networking/vpc/create-vpc)
