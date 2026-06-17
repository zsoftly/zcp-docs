---
title: Stockage de fichiers (CephFS)
sidebar_position: 3
---

CephFS est un système de fichiers partagé conforme POSIX, adossé à votre cluster. Plusieurs clients
peuvent monter le même système de fichiers simultanément, ce qui convient aux répertoires personnels
partagés, aux artefacts de build, aux pipelines médias et aux espaces temporaires HPC.

## Montage

Montez CephFS avec le client noyau ou via FUSE. Avec le client noyau :

```bash
mount -t ceph <mon-host>:6789:/ /mnt/cephfs \
  -o name=<client>,secret=<key>
```

L'hôte moniteur, le nom du client et la clé proviennent de votre
[document d'identifiants](/fr/cloud-storage/getting-started/provisioning#ce-que-vous-recevez). Pour
Kubernetes, le pilote [Ceph CSI](https://github.com/ceph/ceph-csi) provisionne dynamiquement des
volumes CephFS.

## Quand choisir CephFS

- De nombreux clients ont besoin d'un accès partagé et simultané en lecture/écriture aux mêmes
  fichiers.
- Vous avez besoin de la sémantique POSIX (répertoires, permissions) plutôt que du stockage objet ou
  bloc.
- Vos charges de travail incluent des espaces temporaires HPC, des caches CI et de build, ou des
  jeux de données partagés.

| Ressource | URL                                     |
| --------- | --------------------------------------- |
| CephFS    | https://docs.ceph.com/en/latest/cephfs/ |
| Ceph CSI  | https://github.com/ceph/ceph-csi        |
