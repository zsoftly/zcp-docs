---
title: 'Exécuter Ollama pour le chat et l’inférence sur ZCP'
description:
  Déployer l’image Ollama de la Place de marché sur une machine virtuelle ZCP et utiliser un modèle
  local avec le CLI et l’API REST.
sidebar:
  label: 'Ollama : chat et inférence'
---

Ce tutoriel déploie Ollama sur une machine virtuelle ZCP et présente deux usages directs :

- dialoguer avec un modèle depuis le CLI Ollama et le point de terminaison `/api/chat`;
- exécuter une inférence ponctuelle avec `/api/generate`.

Ce guide s’adresse aux développeurs et aux opérateurs DIY. Il contient les commandes, les règles
réseau, les mesures et les étapes de nettoyage nécessaires pour reproduire le déploiement.

La validation de référence a utilisé une VM Intel de 16 vCPU et 64 Go dans YUL-1. Il s’agissait d’un
test limité. Nous avons supprimé les ressources après le test.

Version anglaise : [Run Ollama Chat and Inference on ZCP](/tutorials/ollama-chat-and-inference).

:::caution

Ollama ne possède pas d’authentification intégrée. Gardez le port 11434 privé lorsque c’est
possible. Utilisez un tunnel SSH pour accéder à l’API depuis votre poste pendant les premiers tests.

:::

## Avant de commencer

Il vous faut :

- un compte ZCP, un projet et un accès à YUL-1;
- le CLI `zcp` installé et authentifié;
- une paire de clés SSH Ed25519;
- un poste avec `ssh`, `curl` et `date`;
- assez de RAM et de disque pour les modèles à conserver.

Les valeurs du catalogue de référence étaient :

```text
region: yul-1
project: default-9
VM plan display name: ci2.4xl
VM plan CLI slug: ci24xl
network plan: pnet-yul
storage category: pro-nvme
Ollama template: zmi-ollama-0.31.2-ubuntu2404-1.0.0
```

Lisez toujours le catalogue avant de créer la VM :

```bash
zcp region list
zcp project list
zcp plan vm --region yul-1
zcp plan network --region yul-1
zcp plan storage --region yul-1
zcp template list --region yul-1 | grep -i ollama
```

Le plan de référence `ci2.4xl` fournit 16 vCPU, 64 Go de RAM et un disque racine de 320 Go. Un
modèle 70B en Q4 utilise environ 42 Go. La mémoire restante est limitée après le démarrage du
service, du contexte et du système.

## Coût de référence dans YUL-1

Le catalogue actuel affiche les montants suivants en dollars canadiens :

| Ressource               |   À l’heure |          Au mois |
| ----------------------- | ----------: | ---------------: |
| VM `ci2.4xl`            |   0,80 $ CA |         576 $ CA |
| Réseau isolé `pnet-yul` | 0,0041 $ CA |           3 $ CA |
| Une adresse IPv4 YUL    | 0,0041 $ CA |           3 $ CA |
| Sous-total de référence | 0,8082 $ CA | Environ 582 $ CA |

Cette estimation concerne une VM, un réseau isolé et une adresse IPv4 publique dans YUL-1. Elle
exclut les taxes, les volumes bloc optionnels, les instantanés, les sauvegardes et les remises. Le
disque racine de 320 Go est inclus dans le plan VM. Consultez le catalogue avant tout test payant :

```bash
zcp plan vm --region yul-1 --project default-9
zcp plan network --region yul-1 --project default-9
zcp plan ip --region yul-1 --project default-9
```

Un test de 24 heures coûte environ 19,40 $ CA avant taxes au tarif de référence. Supprimez la VM et
les ressources associées à la fin du test.

## 1. Créer la VM

Importez une clé SSH si le projet n’en possède pas déjà une :

```bash
zcp ssh-key import \
  --name my-yul-key \
  --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 \
  --region yul-1
```

Créez la VM. Remplacez `<ollama-template>` par le slug retourné par le catalogue :

```bash
zcp instance create \
  --name yul-ollama-test \
  --hostname yul-ollama-test \
  --project default-9 \
  --region yul-1 \
  --template <ollama-template> \
  --plan ci24xl \
  --billing-cycle hourly \
  --network-plan pnet-yul \
  --storage-category pro-nvme \
  --ssh-key my-yul-key \
  --is-public \
  --wait \
  --auto-approve
```

Notez l’heure de début et l’adresse IP publique :

```bash
date -Is
zcp instance get yul-ollama-test --project default-9 --region yul-1
zcp ip list --project default-9 --region yul-1
date -Is
```

## 2. Ouvrir SSH

Remplacez `<ip-slug>` et `<trusted-cidr>` par les valeurs de votre compte. Utilisez l’adresse
publique de votre poste avec le suffixe `/32` lorsque c’est possible.

```bash
zcp firewall create \
  --ip <ip-slug> \
  --protocol tcp \
  --cidr <trusted-cidr> \
  --start-port 22 \
  --end-port 22 \
  --project default-9 \
  --region yul-1 \
  --auto-approve

zcp portforward create \
  --instance yul-ollama-test \
  --ip <ip-slug> \
  --protocol tcp \
  --public-port 22 \
  --private-port 22 \
  --public-end-port 22 \
  --private-end-port 22 \
  --project default-9 \
  --region yul-1 \
  --auto-approve
```

Connectez-vous et vérifiez le service :

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>
hostname
systemctl is-active ollama
systemctl is-active ollama-first-boot.service || true
free -h
df -h /
```

Avant de télécharger un modèle, liez Ollama à l’interface loopback et supprimez toute règle de
pare-feu invité trop large pour son API. L’API sans authentification reste ainsi privée. Open WebUI
sur la même VM peut toujours la joindre à `127.0.0.1:11434`.

```bash
sudo install -d -m 0750 /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_HOST=127.0.0.1:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf >/dev/null
sudo systemctl daemon-reload
sudo systemctl restart ollama
sudo ufw delete allow 11434/tcp || true
sudo ss -ltnp | grep 11434
```

## 3. Télécharger un modèle

Commencez par le modèle 8B pour un test interactif sur CPU :

```bash
pull_start=$(date +%s)
date -Is
ollama pull llama3.1:8b
pull_end=$(date +%s)
printf 'pull_elapsed_seconds=%s\n' "$((pull_end - pull_start))"
date -Is
ollama list
```

Le modèle 8B occupe environ 4,9 Go. Le test de référence a aussi téléchargé `llama3.3:70b`. Ce
téléchargement a pris environ 31 minutes et occupait 42 Go. Téléchargez uniquement le modèle utile
au test si le disque ou le temps de téléchargement est limité.

## 4. Dialoguer avec Ollama

Pour un court dialogue interactif :

```bash
ollama run llama3.1:8b
```

Saisissez une question puis appuyez sur Ctrl-D pour quitter.

Pour une application, utilisez l’API de chat :

```bash
curl -sS http://127.0.0.1:11434/api/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "llama3.1:8b",
    "stream": false,
    "messages": [
      {"role": "user", "content": "What is a safe way to expose an Ollama API?"}
    ],
    "options": {
      "num_ctx": 2048,
      "num_predict": 128,
      "temperature": 0
    }
  }'
```

Gardez l’API sur 127.0.0.1 pendant le test. Un tunnel SSH permet à votre poste d’utiliser l’API sans
règle entrante pour Ollama :

```bash
ssh -i ~/.ssh/id_ed25519 \
  -L 11434:127.0.0.1:11434 \
  ubuntu@<public-ip>
```

Dans un second terminal de votre poste, envoyez les requêtes vers `http://127.0.0.1:11434`.

## 5. Exécuter une inférence

Le point de terminaison `/api/generate` convient à une question et une réponse :

```bash
request_start=$(date +%s)
curl -sS --max-time 900 \
  http://127.0.0.1:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "llama3.1:8b",
    "prompt": "Give one short sentence describing this cloud VM.",
    "stream": false,
    "options": {
      "num_ctx": 2048,
      "num_predict": 64,
      "temperature": 0
    }
  }'
request_end=$(date +%s)
printf 'request_elapsed_seconds=%s\n' "$((request_end - request_start))"
```

Vérifiez ensuite le modèle chargé :

```bash
ollama ps
```

## 6. Comprendre la performance sans GPU

La VM de référence n’avait pas de GPU NVIDIA. Les deux modèles ont utilisé le CPU. Un modèle plus
petit répond plus vite parce qu’il demande moins de calcul. Un GPU pris en charge peut réduire la
latence, en particulier pour les modèles plus grands.

| Test                                        | Résultat                                        |
| ------------------------------------------- | ----------------------------------------------- |
| Première requête courte avec `llama3.3:70b` | 117 secondes                                    |
| Deux requêtes 70B simultanées               | 137 et 154 secondes                             |
| Processus 70B actif                         | Environ 43 Go RSS et jusqu’à 99,5 % du CPU      |
| Première requête courte avec `llama3.1:8b`  | 10,96 secondes, dont 9,2 secondes de chargement |

Utilisez `llama3.1:8b` pour le chat interactif sur CPU. Utilisez `llama3.3:70b` pour tester la
qualité lorsque le temps de réponse long est accepté.

## 7. Exécuter des tests limités

Installez les outils uniquement pendant la fenêtre de test :

```bash
sudo apt-get update
sudo apt-get install -y stress-ng fio
```

Exécutez un test CPU fixe de 120 secondes. Le journal utilise un chemin généré sous `/tmp`, et la
commande échoue si `stress-ng` retourne un statut différent de zéro :

```bash
stress_log=$(mktemp /tmp/zcp-stress-ng.XXXXXX)
stress_status=0
sudo stress-ng --cpu 0 --timeout 120s --metrics-brief --verify >"$stress_log" 2>&1 || stress_status=$?
cat "$stress_log"
if [ "$stress_status" -ne 0 ]; then
  echo "stress-ng failed with status $stress_status" >&2
  rm -f "$stress_log"
  exit 1
fi
rm -f "$stress_log"
```

Exécutez un test du système de fichiers fixe de 120 secondes avec un fichier de 1 Gio nouvellement
créé sous `/tmp`. La vérification CRC et le contrôle du statut de sortie rendent les erreurs d’I/O
visibles. Les commandes suppriment le répertoire temporaire après le test :

```bash
fio_dir=$(mktemp -d /tmp/zcp-fio.XXXXXX)
fio_log="$fio_dir/fio.log"
fio_file="$fio_dir/testfile"
fio_status=0
fio --name=zcp-nvme \
  --filename="$fio_file" \
  --size=1G \
  --rw=randrw \
  --rwmixread=70 \
  --bs=4k \
  --iodepth=16 \
  --numjobs=1 \
  --runtime=120 \
  --time_based \
  --direct=1 \
  --group_reporting \
  --verify=crc32c \
  --do_verify=1 >"$fio_log" 2>&1 || fio_status=$?
cat "$fio_log"
if [ "$fio_status" -ne 0 ]; then
  echo "fio failed with status $fio_status" >&2
  rm -rf "$fio_dir"
  exit 1
fi
rm -rf "$fio_dir"
```

## Nettoyage

Supprimez les règles avant la VM :

```bash
zcp firewall list --ip <ip-slug> --region yul-1 --project default-9
zcp portforward list --ip <ip-slug> --region yul-1 --project default-9
zcp firewall delete <rule-id> --ip <ip-slug> --yes --region yul-1 --project default-9
zcp portforward delete <forward-id> --ip <ip-slug> --yes --region yul-1 --project default-9

zcp instance delete yul-ollama-test \
  --yes \
  --delete-public-ip \
  --region yul-1 \
  --project default-9
```

Si une IP source NAT reste après le détachement, suivez la procédure complète du tutoriel
[Exécuter Open WebUI avec Ollama sur ZCP](/fr/tutorials/open-webui-with-ollama).

## Étapes suivantes

- [Exécuter Open WebUI avec Ollama sur ZCP](/fr/tutorials/open-webui-with-ollama)
- [Référence Ollama de la Place de marché](/fr/public-cloud/marketplace/ollama)
- [Référence de l'API Ollama](https://docs.ollama.com/api)
