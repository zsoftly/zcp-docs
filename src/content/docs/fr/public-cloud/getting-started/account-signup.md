---
sidebar_position: 2
title: Création de compte
---

## Guide de création d'un compte ZSoftly Public Cloud

Ce guide vous accompagne étape par étape pour créer un compte ZSoftly Public Cloud, configurer la
facturation et vérifier votre compte.

:::tip[Commencer à bâtir gratuitement]

Les nouveaux comptes reçoivent **100
$ CA de crédit promotionnel de lancement** à l'inscription,
valide pendant **30 jours**. Après avoir dépensé **200 $
CA sur des plans de calcul admissibles**, vous pouvez demander **200
$ CA de crédit promotionnel de lancement supplémentaire**, valide
pendant **60 jours**, pour un total de crédit promotionnel de lancement pouvant atteindre
**300 $
CA**.

:::

### Structure des comptes et des projets

**Une adresse courriel, un compte.** Chaque adresse courriel correspond à un seul compte ZCP. Vous
ne pouvez pas créer un deuxième compte avec une adresse déjà utilisée.

**Utilisez les projets pour isoler les environnements.** La plupart des équipes n'ont besoin que
d'un seul compte. Créez des **Projets** distincts pour `dev`, `stg` et `prd`. Chaque projet possède
ses propres ressources, quotas et membres. Les ressources de projets différents ne partagent pas les
réseaux ni le stockage. Consultez [Projets](/fr/public-cloud/projects) pour en savoir plus.

**Utilisez des comptes distincts pour une isolation stricte.** Certaines organisations exigent une
séparation complète entre des environnements ou des unités d'affaires : facturation distincte, IAM
distinct et aucune ressource partagée. Créez un compte par périmètre. Comme chaque compte exige une
adresse courriel unique, utilisez l'adressage avec signe plus si votre fournisseur le prend en
charge :

| Compte   | Courriel                |
| -------- | ----------------------- |
| Compte 1 | `company+1@example.com` |
| Compte 2 | `company+2@example.com` |
| Compte 3 | `company+3@example.com` |

Les trois adresses livrent les messages dans la même boîte de réception. Chacune correspond à un
compte ZCP entièrement indépendant, avec sa propre facturation et son propre IAM.

### Créer le compte

- Allez à la page d'inscription :
  [cloud.zcp.zsoftly.ca/register](https://cloud.zcp.zsoftly.ca/register).
- Entrez votre nom, votre adresse courriel, votre numéro de téléphone et un mot de passe, puis
  acceptez les **Terms and Conditions**. Vous pouvez aussi vous inscrire avec **GitHub** ou
  **Google**.
- Cliquez sur **Create Account** pour passer à l'étape suivante.

![Page d'inscription ZCP avec le formulaire de création de compte](../../../../../assets/account-signup/register-create-account.webp)

### Vérifier votre courriel

- Consultez votre boîte de réception pour trouver le courriel de vérification de ZSoftly Public
  Cloud contenant un mot de passe à usage unique (OTP).
- Entrez l'**OTP** dans le champ prévu sur le site.
- Cliquez sur **Verify** pour confirmer et passer à la configuration de la facturation.

![Courriel de vérification contenant le mot de passe à usage unique OTP](../../../../../assets/account-signup/verify-email-otp.webp)

Une fois la vérification terminée, ZSoftly Public Cloud envoie un courriel de bienvenue confirmant
que votre compte est prêt.

![Courriel de bienvenue confirmant que le compte est prêt](../../../../../assets/account-signup/welcome-email.webp)

### Configurer le mode de facturation

- Après la vérification du compte, vous serez invité à configurer vos renseignements de facturation.
- Choisissez un type de compte :
  - **Individual** : pour un usage personnel. Entrez des renseignements comme votre adresse.
  - **Company** : pour une organisation. Fournissez des renseignements comme le nom de l'entreprise,
    le site Web et l'adresse.

- Si vous avez un coupon, appliquez-le au paiement pour recevoir un rabais ou une offre
  promotionnelle.

### Crédit promotionnel de lancement

Les nouveaux comptes reçoivent automatiquement **100 $ CA de crédit promotionnel de lancement** à
l'inscription, valide pendant **30 jours**. Le crédit promotionnel de lancement est distinct de
votre option de facturation, du crédit à votre compte et du seuil de facturation postpayée.

Après avoir dépensé **200 $ CA sur des plans de calcul admissibles**, vous pouvez demander **200 $
CA de crédit promotionnel de lancement supplémentaire**. Faites la demande depuis l'adresse courriel
de votre compte au moyen de notre
[page de contact](https://zcp.zsoftly.ca/contact?source=docs&topic=billing), en indiquant votre
**numéro de compte** et la mention
**"$200 Credit Request"**. Nous appliquerons directement ce
crédit promotionnel de lancement supplémentaire à votre compte. Il est valide pendant **60 jours**,
pour un total de crédit promotionnel de lancement pouvant atteindre **300 $
CA**.

Le crédit promotionnel de lancement supplémentaire de **200 $ CA** s'applique aux plans de calcul
admissibles allant de Small à XLarge. L'offre est disponible jusqu'au **31 décembre 2026**.

### Modes de paiement

ZSoftly Public Cloud accepte :

- **Carte** : Visa, Mastercard et American Express, traitées de façon sécurisée par **Stripe**.
- **PayPal** : paiement depuis votre solde PayPal ou un compte lié.
- **Bank Transfer / Wire** : pour les paiements manuels, communiquez avec notre
  [équipe des ventes](https://zcp.zsoftly.ca/contact?source=docs&topic=billing). Elle organisera le
  transfert et appliquera les fonds à votre compte sous forme de crédit à votre compte.

Les paiements par carte et PayPal sont en libre-service dans le portail. Les virements bancaires
sont organisés avec l'équipe des ventes.

### Choisir un plan de paiement

#### Prépayé

- Le mode prépayé exige du crédit à votre compte avant de provisionner un nouveau service. Votre
  utilisation réduit ce crédit et vous ne pouvez pas créer un nouveau service sans crédit suffisant.
- Pour activer le mode prépayé, ajoutez du crédit à votre compte. Un paiement minimal de **1,00 $
  CA** sert à vérifier et à valider votre compte. ZCP ajoute ce paiement au crédit de votre compte
  et vous pouvez utiliser le montant complet.
- Une utilisation active ou un renouvellement peut tout de même rendre le crédit à votre compte
  négatif. Votre prochain ajout de crédit règle le solde négatif avant d'ajouter du crédit
  utilisable.
- Payez avec **Stripe** ou **PayPal**, puis cliquez sur **Proceed** pour terminer un ajout de
  crédit. Pour payer par virement bancaire, communiquez avec
  [l'équipe des ventes](https://zcp.zsoftly.ca/contact?source=docs&topic=billing).
- Choisissez le mode prépayé pour un cycle de facturation trimestriel ou plus long.

#### Postpayé

- Le mode postpayé vous permet d'utiliser des services avant de payer les factures. Il s'applique
  aux cycles de service horaires et mensuels.
- Pour activer le mode postpayé, enregistrez et validez une carte de crédit ou de débit compatible.
  PayPal, les virements bancaires, les télévirements et les paiements manuels n'activent pas le mode
  postpayé.
- Votre seuil de facturation postpayée initial est de **100 CAD** pour un compte personnel et de
  **300 CAD** pour un compte d'organisation. Lorsque votre utilisation atteint ce seuil, ZCP génère
  une facture et prélève automatiquement votre carte enregistrée. Un nouveau cycle de seuil commence
  ensuite.

Vous ne pouvez pas passer du Prépayé au Postpayé, ou l'inverse, après l'activation. Choisissez votre
option de facturation avant de provisionner des services.

![Choix d'un plan de paiement avec les options Prépayé et Postpayé](../../../../../assets/account-signup/payment-plan.webp)

![Paiement Stripe de 1,00 $ CA pour un ajout de crédit de compte prépayé](../../../../../assets/account-signup/billing-stripe-checkout.webp)

### Dernières étapes

- Passez attentivement en revue les **Terms & Conditions** de la plateforme.
- Acceptez les conditions pour terminer l'inscription.

- **Utilisateurs prépayés** : l'état de votre compte s'affichera comme actif, avec le type de compte
  prépayé.

- **Utilisateurs postpayés** : après la vérification, votre compte s'affichera comme actif, avec le
  type de compte postpayé.

### Se connecter au portail

Une fois votre compte actif, connectez-vous à
[cloud.zcp.zsoftly.ca/login](https://cloud.zcp.zsoftly.ca/login). Saisissez votre **courriel** et
votre **mot de passe** (ou utilisez **GitHub** ou **Google**), réussissez la vérification, puis
cliquez sur **Sign in**.

![Page de connexion du portail ZCP avec les champs courriel et mot de passe](../../../../../assets/account-signup/portal-login.webp)

#### Réinitialiser votre mot de passe

Si vous oubliez votre mot de passe, cliquez sur **Forgot Password?** sur la page de connexion (ou
allez à [cloud.zcp.zsoftly.ca/forgot-password](https://cloud.zcp.zsoftly.ca/forgot-password)).
Saisissez le courriel de votre compte et cliquez sur **Send Reset Link**. Vous recevrez les
instructions de réinitialisation par courriel.

![Page de mot de passe oublié du portail ZCP avec le champ courriel et le bouton Send Reset Link](../../../../../assets/account-signup/portal-forgot-password.webp)

#### Se déconnecter

Pour mettre fin à votre session, utilisez le menu du compte et sélectionnez la déconnexion. Le
portail confirme que vous êtes déconnecté, et vous pouvez vous reconnecter à tout moment.

![Page de confirmation de déconnexion du portail ZCP](../../../../../assets/account-signup/portal-logout.webp)

La configuration d'un compte ZSoftly Public Cloud est un processus simple : inscrivez-vous, vérifiez
votre courriel, configurez la facturation et choisissez le plan de paiement qui correspond à vos
besoins. Une fois ces étapes terminées, vous aurez accès au tableau de bord ZSoftly Public Cloud et
à ses fonctionnalités pour gérer vos ressources efficacement.
