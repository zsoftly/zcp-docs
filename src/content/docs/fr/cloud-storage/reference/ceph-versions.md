---
title: Versions de Ceph
sidebar_position: 6
---

## Version provisionnée

Votre cluster utilise par défaut une version stable récente de Ceph. Vous avez besoin d'une version
précise pour correspondre à un cluster existant avec lequel vous répliquez des données, ou pour
respecter la plage prise en charge par un outil? Sélectionnez-la avec l'équipe ZSoftly pendant le
[provisionnement](/fr/cloud-storage/getting-started/provisioning#données-de-dimensionnement).

Votre [document d'identifiants](/fr/cloud-storage/getting-started/provisioning#ce-que-vous-recevez)
indique la version exacte déployée. Confirmez-la sur le cluster :

```bash
ceph versions
```

## Mises à niveau

Le cluster est mono-locataire et sous votre administration; les mises à niveau de version sont donc
planifiées selon vos fenêtres de maintenance. Le soutien ZSoftly vous aide à planifier et à réviser
le chemin de mise à niveau.

| Ressource              | URL                                              |
| ---------------------- | ------------------------------------------------ |
| Versions de Ceph       | https://docs.ceph.com/en/latest/releases/        |
| Guide de mise à niveau | https://docs.ceph.com/en/latest/cephadm/upgrade/ |
