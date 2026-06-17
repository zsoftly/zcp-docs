---
title: Enregistrements DNS
sidebar_position: 2
---

Les enregistrements DNS relient votre domaine à des services précis. Pour créer un enregistrement,
cliquez sur **Créer un enregistrement** dans le tableau de bord de votre domaine.

### Types d'enregistrements

**Enregistrement A** : associe un domaine à une adresse IPv4.

```
@ A 192.0.2.1 14400
```

**Enregistrement AAAA** : associe un domaine à une adresse IPv6.

```
@ AAAA 2001:0db8:85a3::8a2e:0370:7334 14400
```

**Enregistrement CNAME** : crée un alias pointant vers un autre domaine.

```
blog CNAME example.com. 14400
```

**Enregistrement MX** : dirige le courriel vers un serveur de messagerie.

```
@ MX 10 mail.example.com. 14400
```

**Enregistrement TXT** : stocke des données texte (SPF, DKIM, vérification de domaine).

```
@ TXT "v=spf1 mx -all" 14400
```

**Enregistrement NS** : désigne les serveurs de noms faisant autorité.

```
@ NS ns1.example.com. 14400
```

**Enregistrement SRV** : localise un service précis.

```
_sip._tcp SRV 10 60 5060 sipserver.example.com. 14400
```

Utilisez `@` pour le domaine racine ou entrez un nom d'hôte pour les sous-domaines (par exemple,
`www`, `blog`).

Voir aussi : [Domaines](/fr/public-cloud/dns/domains)
