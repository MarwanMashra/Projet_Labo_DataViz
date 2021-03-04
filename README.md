***************************************************************
* README pour le projet Labo DataViz 
* Auteur Marwan MASHRA, 2020
* projet réalisé durant un stage au LIRMM 
*
***************************************************************


--------------
INSTALLATION :
--------------
1) téléchargez le dossier Labo_DataViz (attention: ne changez pas l'emplacement de ses fichiers)
2) installez tous les modules python indiquées dans le fichier requirements.txt. 
vous pouvez le faire via la ligne de commande, il suffit d'utiliser la commande pip (python 2) ou pip3 (python 3) 
    |-$ pip install -r requirements.txt
    |-$ pip3 install -r requirements.txt
3) via la ligne de commande, exécuter le script python app.py pour lancer le serveur (gardez la ligne de commande ouvret) 
4) dans votre navigatuer, visitez le lien que le serveur vous donne (http://127.0.0.1:5000/)



--------------------------
Contenant du code source :
--------------------------
/requirements.txt              - le fichier contenant les modules python nécessaires à l’exécution de l’application
/ Labo_DataViz                 - le dossier contenant code source de l'application 
----- / app.py                 - le script python contenant l'application  
----- / server                 - le dossier contenant les scripts python (section : INSTALLATION)
---------- / mongo.ini         - le fichier contenant les informations de connexion à la BDD (section : Connexion à la base de données)
----- / templates              - le dossier contenant les fichiers HTML
----- / static                 - le dossier contenant les autres fichiers comme CSS, JS..etc
---------- / css               - le dossier contenant les fichiers CSS
---------- / js                - le dossier contenant les fichiers JS
---------- / src               - le dossier contenant les images
--------------- /icons         - le dossier contenant les icons
---------- / config            - le dossier contenant les fichiers de configuration (section : Fichiers de configuration)
--------------- / config.js    - le fichier contenant les paramètres de la formulaire de création de questionnaires
--------------- / config.css   - le fichier permettant de modifier le style de la page de questionnaire


---------------------------------
Fonctionnement de l'application :
---------------------------------
L'application possède un système d'authentification pour les administrateurs.
un administrateur peut créer des questionnaires, les chercher par date, visualiser leurs résultats et même les supprimer
il peut également ajouter d'autres comptes administrateurs 
un utilisateur n'a accès qu'à la page du questionnaire dont il possède l'id (le lien), il ne peut ni voir ses résultats, ni voir les autres questionnaires
ni l'utilisateur ni l'administrateur ne peut supprimer un compte administrateur, la supprission se fait manuellement depuis la base de données



---------------
Compatibilité :
---------------
bien que l'application soit Compatible avec tous les navigatuers connus tel que Chrome, Edge, Firefox, Safari..etc,
je vous déconseille d'utiliser Chrome à cause de certains problèmes d'envoi de requête vers le serveur (section : problème non résolu)
l'application fonctionne parfaitement et sans problème avec les autres navigatuers 


--------------------------------
Connexion à la base de données :
--------------------------------
Tous les données sont stockés dans le cloud via le service de stockage gratuit MongoDB 
MongoDB a été choisi comme base de données car il possède une interface graphique relativement facile à utiliser
Vous pouvez donc l'utiliser pour voir, ajouter, modifier et supprimer manuellement des informations de la base de données 
Toutefois, l'application Labo DataViz a été conçu pour que vous n'ayez pas besoin
je vous déconseille donc manipuler la base de données manuellement (sauf dans des cas comme la supprission d'un compte administrateur)

Un compte a déjà été créé pendant le développement de l'application (identifiants dans mongo.ini) vous pouvez donc continuer à l'utiliser sans problème
Toutefois, si vous souhaitez utiliser un autre compte avec vos idéntifiants, il suffit de se rendre sur le site et créer un compte
link: https://www.mongodb.com/ 
dans votre base de données, vous aurez besoin de créer deux collections "Questionnaires" et "Admin_accounts"
1) "Questionnaires" : pour stocker les questionnaires
2) "Admin_accounts" : pour stocker les identifiants des comptes des administrateurs

Vous devez ensuite entrer les nouvelles informations de connexion dans le fichier mongo.ini (rendez-vous sur mongo.ini pour plus d'infos) 
les informations de connexion sont : email, password, dbname, username

email=..........
password=..........
dbname=..........
username=.......... 


comme vous voyez, ces informations sont stockées dans un format particulier (nom=valuer) que vous allez devoir respecter 
remarque: l'ordre des infos n'est pas important, toute ligne commençant par # est ignorée

Où trouver ces informations ?
1) email et password sont les identifiants de votre compte 
2) dbname est le nom que vous avez choisi pour votre base de données lors de la création du projet sur MongoDB
3) username est le nom d'utilisateur qui vous a été attribué par mongoDB, vous pouvez le trouvez sur votre compte 
votre compte > project > connect > connect your application et vous trouverez
username: vous pouvez le trouvez sur votre compte > project > connect > connect your application et vous trouverez
mongodb+srv://(.............):<password>@cluster0.pvpbx.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority
(.............) est le username 


---------------------------
Fichiers de configuration :
---------------------------
Deux fichiers de configuration sont à dispositon afin de faciliter la modification de certains paramètres de l'application
1) config.js:
    permet de modifier les paramètres de la formulaire de création de questionnaire, comme le nombre max de question, le nombre max de résponse
    par question...etc et également le nombre max de caractères autorisés par question, résponse..etc. (rendez-vous sur config.js pour plus d'infos)
2) config.css:
    permet de moodifier le style de la page de questionnaire. Le fichier a été implifier le plus possible et ne nécissite pas un informaticien pour le modifier.
    Il contient également beaucoup de commantaire, d'explication et d'exemple d'utilisation. Il est donc relativement facile à utiliser.


------------------------------------
informations utiles au déploiement :
------------------------------------
l'application utilise le framework Flask qui un framework de développement web côté serveur en Python (le fichier app.py contient l'application flask)
l'application est ensuite servi à un serveur WSGI via wsgiref.simple_server


---------------------
Problème non résolu :
---------------------
comme indiqué précédemment (section : Compatibilité), un probème a été rencontré avec le navigateur Chrome notamment lors de la première connexion.
après avoir rentré les identifiants (identifiant et mot de passe), la requête envoyé au serveur rencontre un problème (pending request)
la requête ne sera pas envoyé et il vous faut rafraîchir la page envoyer la requête et se connecter
cela se produit uniquement lors de la première tentative de connexion (première requête envoyé), il ne se produit plus par la suite.
comme le problème vient de Chrome et ne pas de l'application, j'ai pas pu trouvé de solution

pour plus d'infos sur ce bug, voici quelques références: 
https://bugs.chromium.org/p/chromium/issues/detail?id=1099122
https://support.google.com/chrome/thread/37163649?hl=en






