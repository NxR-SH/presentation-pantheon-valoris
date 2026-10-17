// dossiers.js — the two archive entries and the content of their folders.
// No DOM here: the navigation renders the two entries, the dossier view renders
// the pages. Long documents are split across pages; the viewer reflows any page
// that would overflow into a continuation sheet.

export const MAIN_ITEMS = [
  {
    id: "pantheon",
    label: "PANTHÉON",
    desc: "PLUS QU'UNE ORGANISATION, UNE DOMINATION.",
  },
  {
    id: "valoris",
    label: "VALORIS",
    desc: "SÉCURITÉ PRIVÉE — PROTECTION, SÉCURISATION, ESCORTE, CONSEIL.",
  },
];

const PANTHEON_PAGES = [
  {
    title: "FICHE D'IDENTITÉ",
    kicker: "DOSSIER DE PRÉSENTATION — ORGANISATION PARAMILITAIRE ET CRIMINELLE",
    stamp: "RESTREINT",
    doc: true,
    fields: [
      ["ORGANISATION", "LE PANTHÉON"],
      ["CLASSIFICATION", "ORGANISATION ILLÉGALE STRUCTURÉE"],
      ["COUVERTURE", "SOCIÉTÉ PRIVÉE DE SÉCURITÉ ET DE PROTECTION"],
      ["TERRITOIRES", "LOS SANTOS & CAYO PERICO"],
      ["ORIENTATION", "PARAMILITAIRE, STRATÉGIQUE, CRIMINELLE ET POLITIQUE"],
      [
        "TYPE",
        "GROUPE À HIÉRARCHIE STRICTE, OPÉRANT LÉGALEMENT EN APPARENCE ET CLANDESTINEMENT DANS L'OMBRE",
      ],
    ],
    note: "Dossier de présentation d'une organisation paramilitaire et criminelle. Diffusion restreinte au Conseil.",
  },
  {
    title: "PRÉSENTATION GÉNÉRALE",
    kicker: "SECTION 01 — PRÉSENTATION GÉNÉRALE",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon est une organisation structurée autour d'un principe simple : le véritable pouvoir n'appartient pas nécessairement à ceux qui gouvernent, mais à ceux qui possèdent les moyens de les faire tomber.",
      },
      {
        type: "p",
        text: "Officiellement, Le Panthéon se présente comme une société privée de sécurité spécialisée dans la protection rapprochée, la sécurisation de sites sensibles, l'escorte de convois et la gestion de situations à haut risque. Son image repose sur le professionnalisme, la discipline, la discrétion et une organisation interne particulièrement rigoureuse.",
      },
      {
        type: "p",
        text: "Derrière cette façade respectable se dissimule cependant une structure criminelle paramilitaire disposant de ses propres réseaux, de ses ressources et de ses ambitions.",
      },
      {
        type: "p",
        text: "Le Panthéon ne cherche pas simplement à accumuler de l'argent ou à imposer son nom dans le milieu criminel. Son ambition est bien plus grande : devenir une puissance autonome capable d'influencer, de contrôler, puis de renverser les structures de pouvoir existantes.",
      },
      {
        type: "p",
        text: "Son projet à long terme consiste à établir une domination politique et stratégique sur Los Santos et Cayo Perico, jusqu'à faire de ces territoires les fondations d'un nouvel ordre contrôlé par l'organisation.",
      },
      {
        type: "p",
        text: "Le Panthéon ne veut pas être un simple gang. Il veut devenir une institution parallèle.",
      },
    ],
  },
  {
    title: "IDENTITÉ & PHILOSOPHIE",
    kicker: "SECTION 02 — IDENTITÉ ET PHILOSOPHIE",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le nom « Le Panthéon » représente l'idée d'un cercle restreint d'individus qui ne reconnaissent leur autorité qu'à travers la force, la compétence, la loyauté et la capacité à prendre des décisions difficiles.",
      },
      {
        type: "p",
        text: "L'organisation repose sur quatre principes fondamentaux :",
      },
      {
        type: "lead",
        lead: "La discipline.",
        text: "Chaque membre représente l'image et les intérêts du Panthéon. L'indiscipline répétée, les initiatives incontrôlées et les comportements susceptibles de compromettre l'organisation sont considérés comme des fautes graves.",
      },
      {
        type: "lead",
        lead: "La loyauté.",
        text: "L'appartenance au Panthéon dépasse les intérêts personnels. Les membres doivent préserver la cohésion du groupe et respecter la hiérarchie établie.",
      },
      {
        type: "lead",
        lead: "La discrétion.",
        text: "L'organisation ne cherche pas systématiquement à être reconnue comme responsable de ses opérations. Sa couverture légale et ses relations extérieures constituent des éléments essentiels de son identité.",
      },
      {
        type: "lead",
        lead: "Le pouvoir.",
        text: "L'argent, les armes, l'information et les alliances sont considérés comme des moyens d'atteindre un objectif supérieur : l'indépendance et la domination territoriale.",
      },
      { type: "p", text: "La philosophie du Panthéon est la suivante :" },
      {
        type: "quote",
        text: "Nous ne cherchons pas à régner dans la lumière. Nous cherchons à décider de ce qui s'y déroule.",
      },
    ],
  },
  {
    title: "LA FAÇADE LÉGALE",
    kicker: "SECTION 03 — SOCIÉTÉ DE SÉCURITÉ PRIVÉE",
    stamp: "RESTREINT",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "La société de sécurité privée constitue le visage public du Panthéon.",
      },
      {
        type: "p",
        text: "Elle sert à donner une identité professionnelle à ses membres, à développer des relations avec les entreprises et les personnalités influentes, et à créer des opportunités de jeu légal en dehors des activités criminelles.",
      },
      { type: "p", text: "Ses prestations officielles peuvent comprendre :" },
      {
        type: "bullets",
        items: [
          "Protection rapprochée de personnalités et de dirigeants.",
          "Sécurisation d'événements privés et professionnels.",
          "Surveillance de bâtiments, d'entrepôts et de propriétés.",
          "Escorte de véhicules et de convois.",
          "Transport sécurisé de marchandises déclarées.",
          "Conseil en gestion des risques.",
          "Recherche de solutions lors de conflits commerciaux.",
          "Recrutement d'agents de sécurité et formation interne.",
        ],
      },
      {
        type: "p",
        text: "Cette activité permet au Panthéon de développer des relations avec les entreprises, les propriétaires de commerces, les personnalités influentes et certains acteurs institutionnels.",
      },
      {
        type: "p",
        text: "La façade légale ne doit pas être perçue comme une simple excuse scénaristique. Elle constitue une véritable branche RP, avec des contrats, des rendez-vous, des clients, des employés et des conséquences sur la réputation de l'organisation.",
      },
    ],
  },
  {
    title: "ACTIVITÉS CLANDESTINES",
    kicker: "SECTION 04 — PRESTATIONS ILLÉGALES",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Derrière son image officielle, Le Panthéon propose des services illégaux à une clientèle sélectionnée.",
      },
      {
        type: "p",
        text: "L'organisation privilégie les prestations rémunérées, les accords négociés et les relations durables plutôt que les violences gratuites. Chaque contrat représente une opportunité de gagner de l'argent, de développer son réseau ou d'accroître son influence.",
      },
      { type: "sub", text: "4.1 — TRAFIC ET VENTE D'ARMES" },
      {
        type: "p",
        text: "Le Panthéon souhaite développer une branche spécialisée dans le commerce clandestin d'armes.",
      },
      {
        type: "p",
        text: "Dans le cadre du serveur, cette activité peut prendre la forme de négociations avec des fournisseurs RP, de transactions entre organisations, de commandes spécifiques et de conflits liés aux dettes ou aux marchandises.",
      },
      { type: "p", text: "Les possibilités de jeu comprennent :" },
      {
        type: "bullets",
        items: [
          "Négociation de commandes avec des groupes intéressés.",
          "Vente d'armes et de matériel autorisés par les règles du serveur.",
          "Gestion de litiges commerciaux liés aux transactions.",
          "Mise en place d'accords entre fournisseurs et acheteurs.",
          "Développement de relations avec d'autres organisations criminelles.",
          "Concurrence avec des groupes cherchant à contrôler le même marché.",
        ],
      },
      {
        type: "p",
        text: "Le trafic d'armes constitue une source de revenus importante, mais également un risque permanent : chaque transaction peut entraîner des rivalités, des trahisons, des enquêtes ou des représailles.",
      },
    ],
  },
  {
    title: "LIVRAISON DE CIBLES",
    kicker: "SECTION 04.2 — CONTRATS SENSIBLES",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon propose des contrats de livraison de cibles dans le cadre du RP criminel.",
      },
      {
        type: "p",
        text: "Selon les règles du serveur et les accords conclus entre les joueurs, une commande peut concerner la remise d'un individu recherché par un client, le transfert d'un prisonnier RP ou la livraison d'une cible à un lieu convenu dans le cadre d'un scénario.",
      },
      {
        type: "p",
        text: "Chaque contrat doit reposer sur une interaction RP identifiable, avec un commanditaire, des conditions, une rémunération et des conséquences possibles.",
      },
      {
        type: "p",
        text: "Ces prestations peuvent créer des intrigues autour des enlèvements scénarisés, des demandes de rançon, des échanges de prisonniers, des négociations et des conflits entre organisations.",
      },
      {
        type: "p",
        text: "Le Panthéon cherche à être reconnu comme un intermédiaire capable de prendre en charge les contrats sensibles que d'autres groupes ne souhaitent pas assumer eux-mêmes.",
      },
    ],
  },
  {
    title: "TRANSPORT CLANDESTIN",
    kicker: "SECTION 04.3 — LIVRAISON DE COLIS",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "L'organisation propose également des services de transport et de livraison de colis pour une clientèle criminelle.",
      },
      {
        type: "p",
        text: "Les contrats peuvent concerner des marchandises illégales, des objets de valeur, des documents compromettants ou d'autres éléments définis par les mécaniques du serveur.",
      },
      { type: "p", text: "Cette activité ouvre la porte à de nombreuses scènes :" },
      {
        type: "bullets",
        items: [
          "Prise de commande auprès d'un client.",
          "Négociation du prix et des conditions.",
          "Organisation d'un rendez-vous de remise.",
          "Livraison sous contrat.",
          "Gestion des retards, des litiges et des marchandises perdues.",
          "Conflits entre le commanditaire et le destinataire.",
          "Missions d'interception ou de récupération dans le cadre d'un scénario.",
        ],
      },
      {
        type: "p",
        text: "Le service doit être pensé comme une activité RP à part entière, et non comme une simple transaction automatisée.",
      },
    ],
  },
  {
    title: "NÉGOCIATIONS",
    kicker: "SECTION 04.4 / 04.5 — MÉDIATION ET PRESTATIONS",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      { type: "sub", text: "4.4 — NÉGOCIATIONS ET MÉDIATION CRIMINELLE" },
      {
        type: "p",
        text: "Le Panthéon peut intervenir comme intermédiaire entre des individus ou des organisations qui ne souhaitent pas communiquer directement.",
      },
      { type: "p", text: "Ses membres peuvent être sollicités pour :" },
      {
        type: "bullets",
        items: [
          "Négocier une trêve entre deux groupes.",
          "Organiser des échanges de marchandises ou de prisonniers RP.",
          "Résoudre des conflits liés à des dettes.",
          "Encadrer des réunions entre organisations.",
          "Négocier des accords commerciaux.",
          "Servir d'intermédiaire lors de demandes de rançon.",
          "Organiser des rencontres confidentielles entre commanditaires et prestataires.",
        ],
      },
      {
        type: "p",
        text: "La neutralité du Panthéon n'est jamais garantie. Une négociation peut être une véritable tentative de réconciliation, un contrat rémunéré ou une occasion d'obtenir des informations et de développer de nouvelles alliances.",
      },
      { type: "sub", text: "4.5 — PRESTATIONS CRIMINELLES COMPLÉMENTAIRES" },
      {
        type: "p",
        text: "Selon les règles du serveur et les possibilités offertes par les scripts, Le Panthéon pourra également proposer :",
      },
      {
        type: "bullets",
        items: [
          "La récupération de marchandises contestées.",
          "L'escorte de personnalités du milieu criminel.",
          "La surveillance RP d'individus ou de propriétés.",
          "La récupération d'objets ou de véhicules dans le cadre de contrats scénarisés.",
          "L'organisation de rencontres entre commanditaires.",
          "Le règlement négocié de conflits.",
          "La mise à disposition de personnel pour des opérations RP autorisées.",
        ],
      },
      {
        type: "p",
        text: "Chaque prestation doit donner lieu à des interactions, des décisions et des conséquences. L'objectif est de faire du Panthéon un prestataire recherché par les autres groupes, et non une organisation qui impose systématiquement le conflit.",
      },
    ],
  },
  {
    title: "OBJECTIF STRATÉGIQUE",
    kicker: "SECTION 05 — LOS SANTOS ET CAYO PERICO",
    stamp: "SECRET",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "L'ambition finale du Panthéon dépasse largement les intérêts habituels d'une organisation criminelle.",
      },
      {
        type: "p",
        text: "Ses dirigeants considèrent que Los Santos et Cayo Perico représentent deux espaces complémentaires.",
      },
      {
        type: "p",
        text: "Los Santos constitue le centre économique, politique et institutionnel de leur projet. Cayo Perico représente un territoire insulaire dont le contrôle pourrait offrir de nouvelles possibilités de développement RP, d'alliances et de rivalités.",
      },
      {
        type: "p",
        text: "L'organisation entend progressivement devenir suffisamment influente pour remettre en question les autorités en place.",
      },
      { type: "sub", text: "5.1 — LOS SANTOS : L'INFLUENCE AVANT LA DOMINATION" },
      {
        type: "p",
        text: "Le Panthéon souhaite s'imposer progressivement dans la ville.",
      },
      {
        type: "p",
        text: "Son ambition consiste à développer une présence économique, à établir des relations avec les acteurs importants et à devenir un interlocuteur incontournable pour certaines organisations criminelles.",
      },
      {
        type: "p",
        text: "À long terme, ses dirigeants envisagent de remettre en cause l'autorité des institutions existantes et de provoquer un changement radical de pouvoir.",
      },
      {
        type: "p",
        text: "Ce projet de coup d'État constitue un objectif scénaristique de long terme. Il ne signifie pas que l'organisation contrôle déjà la ville, ni que son succès est garanti.",
      },
      {
        type: "p",
        text: "La progression doit dépendre des actions des joueurs, des réactions des forces de l'ordre, des alliances conclues et des décisions du staff.",
      },
      { type: "sub", text: "5.2 — CAYO PERICO : L'AMBITION TERRITORIALE" },
      {
        type: "p",
        text: "Cayo Perico représente le second objectif majeur du Panthéon.",
      },
      {
        type: "p",
        text: "L'organisation souhaite y développer une influence suffisamment importante pour contester les pouvoirs locaux et tenter d'établir sa propre autorité.",
      },
      {
        type: "p",
        text: "Ce projet pourrait se traduire par des négociations avec les acteurs présents sur l'île, des conflits territoriaux, des accords commerciaux, des opérations RP et des événements impliquant plusieurs organisations.",
      },
      {
        type: "p",
        text: "Le contrôle de Cayo Perico ne doit pas être considéré comme acquis. Il constitue un enjeu de campagne qui peut évoluer selon les rapports de force et les décisions prises par les joueurs.",
      },
    ],
  },
  {
    title: "LE COUP D'ÉTAT",
    kicker: "SECTION 05.3 — FINALITÉ RP",
    stamp: "SECRET",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le coup d'État envisagé par Le Panthéon représente l'aboutissement potentiel de son évolution.",
      },
      {
        type: "p",
        text: "Il ne s'agit pas d'une simple prise de territoire par la force, mais d'un événement majeur susceptible de modifier durablement l'équilibre du serveur.",
      },
      { type: "p", text: "Plusieurs issues sont possibles :" },
      {
        type: "bullets",
        items: [
          "Réussite partielle, avec une influence accrue de l'organisation.",
          "Échec du projet et démantèlement d'une partie du réseau.",
          "Trahison interne compromettant les ambitions du groupe.",
          "Intervention d'organisations rivales ou des forces de l'ordre.",
          "Négociation d'un nouvel équilibre politique.",
          "Division du Panthéon entre partisans de la conquête et défenseurs de la discrétion.",
        ],
      },
      {
        type: "p",
        text: "Le projet doit être soumis au staff et construit avec lui afin de préserver le fair-play, la cohérence du lore et les possibilités de réponse des autres joueurs.",
      },
    ],
  },
  {
    title: "ORGANISATION INTERNE",
    kicker: "SECTION 06 — HIÉRARCHIE ET BRANCHES",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon fonctionne selon une structure hiérarchique inspirée des organisations paramilitaires et des sociétés privées de sécurité.",
      },
      { type: "sub", text: "6.1 — LE FONDATEUR : DIRECTION SUPRÊME" },
      {
        type: "p",
        text: "Le fondateur définit la vision générale de l'organisation, valide les grandes orientations et représente Le Panthéon auprès des interlocuteurs importants.",
      },
      {
        type: "p",
        text: "Il supervise les différentes branches et conserve l'autorité sur les décisions stratégiques.",
      },
      { type: "sub", text: "6.2 — LE CONSEIL : DIRECTION ET COORDINATION" },
      {
        type: "p",
        text: "Le Conseil réunit les membres de confiance chargés d'assister la direction.",
      },
      { type: "p", text: "Ses responsabilités peuvent comprendre :" },
      {
        type: "bullets",
        items: [
          "La validation des contrats importants.",
          "La gestion des ressources communes.",
          "La résolution des conflits internes.",
          "Le suivi des relations avec les autres groupes.",
          "La coordination des branches légales et clandestines.",
          "La préparation des événements RP majeurs.",
        ],
      },
      { type: "sub", text: "6.3 — LES RESPONSABLES DE BRANCHE" },
      {
        type: "p",
        text: "Chaque branche possède un responsable chargé de son fonctionnement quotidien. Les postes envisagés sont :",
      },
      {
        type: "bullets",
        items: [
          "Directeur des opérations légales : gestion des contrats de sécurité et des clients.",
          "Responsable des contrats clandestins : réception et suivi des commandes illégales.",
          "Responsable des relations extérieures : négociations, alliances et médiation.",
          "Responsable logistique : gestion RP des véhicules, équipements et marchandises.",
          "Responsable du recrutement : intégration et suivi des nouveaux membres.",
        ],
      },
      {
        type: "p",
        text: "Ces fonctions peuvent être cumulées lorsque les effectifs sont réduits.",
      },
      { type: "sub", text: "6.4 — LES OPÉRATEURS" },
      {
        type: "p",
        text: "Les opérateurs constituent le noyau actif du Panthéon.",
      },
      {
        type: "p",
        text: "Ils assurent les prestations de sécurité, les missions contractuelles, les escortes, les livraisons et les opérations RP validées par leur hiérarchie.",
      },
      { type: "sub", text: "6.5 — LES RECRUES" },
      {
        type: "p",
        text: "Les recrues découvrent progressivement les règles, les valeurs et le fonctionnement de l'organisation.",
      },
      {
        type: "p",
        text: "Leur intégration repose sur le comportement RP, la fiabilité, la capacité à jouer en équipe et le respect des consignes.",
      },
      {
        type: "p",
        text: "La progression hiérarchique doit être méritée et liée à l'investissement du joueur plutôt qu'à son ancienneté seule.",
      },
    ],
  },
  {
    title: "RECRUTEMENT",
    kicker: "SECTION 07 — ADMISSION ET INTÉGRATION",
    stamp: "RESTREINT",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon recherche des profils capables de participer à un RP sérieux, cohérent et durable.",
      },
      { type: "p", text: "Les critères privilégiés sont :" },
      {
        type: "bullets",
        items: [
          "Une bonne maîtrise du règlement du serveur.",
          "Une attitude mature et respectueuse.",
          "La capacité à interpréter un personnage crédible.",
          "Le respect de la hiérarchie RP.",
          "La discrétion et la fiabilité.",
          "La capacité à participer à des scènes de négociation comme à des scènes de tension.",
          "La volonté de développer des relations avec d'autres joueurs plutôt que de rechercher uniquement les affrontements.",
        ],
      },
      {
        type: "p",
        text: "Le recrutement peut se dérouler en plusieurs étapes : prise de contact, entretien RP, période d'observation et validation par un responsable.",
      },
      {
        type: "p",
        text: "L'organisation ne recherche pas nécessairement les joueurs les plus expérimentés au combat. Elle privilégie les personnes capables de contribuer à des histoires, de tenir un rôle sur la durée et d'accepter les conséquences de leurs décisions.",
      },
    ],
  },
  {
    title: "RELATIONS EXTÉRIEURES",
    kicker: "SECTION 08 — PARTENAIRES, ALLIÉS ET RIVAUX",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon n'a pas vocation à entrer immédiatement en guerre contre tous les groupes présents en ville.",
      },
      {
        type: "p",
        text: "Son développement repose sur une politique relationnelle flexible.",
      },
      {
        type: "lead",
        lead: "Les partenaires commerciaux :",
        text: "organisations pouvant solliciter ses prestations, conclure des accords ou participer à des échanges.",
      },
      {
        type: "lead",
        lead: "Les alliés :",
        text: "groupes partageant temporairement certains intérêts et pouvant contribuer à des intrigues communes.",
      },
      {
        type: "lead",
        lead: "Les concurrents :",
        text: "organisations cherchant à contrôler les mêmes marchés ou à attirer les mêmes clients.",
      },
      {
        type: "lead",
        lead: "Les adversaires :",
        text: "groupes dont les intérêts entrent directement en conflit avec ceux du Panthéon.",
      },
      {
        type: "lead",
        lead: "Les institutions :",
        text: "forces de l'ordre, administrations et acteurs légaux susceptibles de contracter avec sa façade officielle ou de s'opposer à ses activités clandestines.",
      },
      {
        type: "p",
        text: "Les alliances ne sont jamais considérées comme définitives. Elles peuvent évoluer selon les contrats, les événements, les dettes et les choix des personnages.",
      },
    ],
  },
  {
    title: "IMAGE PUBLIQUE",
    kicker: "SECTION 09 — IDENTITÉ VISUELLE",
    stamp: "RESTREINT",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon doit présenter deux identités complémentaires.",
      },
      { type: "sub", text: "IDENTITÉ OFFICIELLE" },
      {
        type: "p",
        text: "Une apparence professionnelle, sobre et crédible, associée à une entreprise de sécurité privée.",
      },
      {
        type: "p",
        text: "Les éléments envisageables comprennent des costumes sombres, des tenues professionnelles, des véhicules adaptés à la protection et une communication commerciale discrète.",
      },
      { type: "sub", text: "IDENTITÉ CLANDESTINE" },
      {
        type: "p",
        text: "Une identité plus austère, inspirée des structures paramilitaires fictives.",
      },
      {
        type: "p",
        text: "Les éléments envisageables comprennent des tenues tactiques adaptées au lore du serveur, un emblème propre au groupe, des véhicules réservés aux scènes concernées et des codes internes permettant de renforcer l'identité collective.",
      },
      {
        type: "p",
        text: "L'image du Panthéon doit inspirer la rigueur et le contrôle plutôt qu'une violence ostentatoire permanente.",
      },
    ],
  },
  {
    title: "ÉCONOMIE & CONTRATS",
    kicker: "SECTION 10 — MODÈLE ÉCONOMIQUE",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le modèle économique du Panthéon repose sur plusieurs sources de revenus RP :",
      },
      {
        type: "bullets",
        items: [
          "Contrats de sécurité privée.",
          "Protection rapprochée.",
          "Escorte et transport de marchandises.",
          "Prestations de négociation et de médiation.",
          "Livraison de colis.",
          "Contrats criminels impliquant des cibles.",
          "Transactions illégales prévues par le règlement.",
          "Accords commerciaux avec d'autres organisations.",
        ],
      },
      {
        type: "p",
        text: "Chaque contrat important doit pouvoir être retracé dans l'histoire de l'organisation : commanditaire, prestation, rémunération, résultat et éventuels litiges.",
      },
      {
        type: "p",
        text: "La gestion des revenus et des dépenses doit rester cohérente avec l'économie du serveur. Les tarifs définitifs seront adaptés aux règles, aux mécaniques disponibles et aux possibilités de négociation.",
      },
    ],
  },
  {
    title: "PHASES RP",
    kicker: "SECTION 11 — ÉVOLUTION NARRATIVE",
    stamp: "SECRET",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le développement du Panthéon peut s'articuler autour de plusieurs phases narratives.",
      },
      {
        type: "lead",
        lead: "Phase I — Fondation.",
        text: "Création de la société de sécurité, recrutement des premiers membres, obtention de clients et construction d'une réputation légale.",
      },
      {
        type: "lead",
        lead: "Phase II — Expansion.",
        text: "Développement des contrats, apparition des premières prestations clandestines et établissement de relations avec les groupes criminels.",
      },
      {
        type: "lead",
        lead: "Phase III — Influence.",
        text: "Multiplication des alliances, conflits commerciaux, rivalités et intrigues impliquant les acteurs importants de Los Santos.",
      },
      {
        type: "lead",
        lead: "Phase IV — Implantation à Cayo Perico.",
        text: "Développement d'un arc narratif territorial, avec négociations, alliances locales et confrontation éventuelle avec les groupes présents sur l'île.",
      },
      {
        type: "lead",
        lead: "Phase V — Crise politique.",
        text: "L'organisation commence à remettre ouvertement en question l'équilibre du pouvoir. Des événements majeurs peuvent opposer ses dirigeants aux autorités, aux groupes rivaux et à ses propres alliés.",
      },
      {
        type: "lead",
        lead: "Phase VI — Projet de coup d'État.",
        text: "Le Panthéon tente de concrétiser son ambition de domination politique sur Los Santos et Cayo Perico.",
      },
      {
        type: "p",
        text: "Cette dernière phase doit être construite avec le staff et dépendre des conséquences des phases précédentes. Une victoire automatique ne fait pas partie du concept.",
      },
    ],
  },
  {
    title: "INTÉRÊT POUR LE SERVEUR",
    kicker: "SECTION 12 — CONTENU ET INTERACTIONS",
    stamp: "RESTREINT",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon est conçu pour apporter du contenu à plusieurs catégories de joueurs.",
      },
      {
        type: "lead",
        lead: "Pour les civils et les entreprises :",
        text: "contrats de sécurité, protection, transport et relations commerciales.",
      },
      {
        type: "lead",
        lead: "Pour les organisations illégales :",
        text: "prestations contractuelles, négociations, rivalités, échanges et alliances.",
      },
      {
        type: "lead",
        lead: "Pour les forces de l'ordre :",
        text: "enquêtes, surveillance, investigations financières, découverte progressive de la façade criminelle et événements majeurs.",
      },
      {
        type: "lead",
        lead: "Pour les groupes territoriaux :",
        text: "conflits d'intérêts, accords, tensions et enjeux autour de Cayo Perico.",
      },
      {
        type: "lead",
        lead: "Pour le staff :",
        text: "une organisation évolutive permettant de créer des arcs narratifs à long terme, sans imposer un résultat prédéterminé au reste du serveur.",
      },
      {
        type: "p",
        text: "Le Panthéon cherche ainsi à devenir un moteur d'interactions et de scénarios, plutôt qu'une organisation isolée qui ne joue qu'avec ses propres membres.",
      },
    ],
  },
  {
    title: "ENGAGEMENTS",
    kicker: "SECTION 13 — ÉQUILIBRE ET FAIR-PLAY",
    stamp: "CONFIDENTIEL",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Afin de garantir un RP équilibré et durable, Le Panthéon s'engage à respecter les principes suivants :",
      },
      {
        type: "bullets",
        items: [
          "Respecter le règlement général du serveur et les règles propres aux organisations illégales.",
          "Accepter les conséquences des échecs, des arrestations et des pertes RP.",
          "Ne pas considérer les objectifs territoriaux ou politiques comme automatiquement acquis.",
          "Ne pas imposer de scènes aux autres joueurs sans respecter les règles applicables.",
          "Maintenir des interactions avec les groupes légaux comme illégaux.",
          "Soumettre au staff les projets d'envergure nécessitant une validation.",
          "Adapter ses activités aux scripts, aux mécaniques et aux limites du serveur.",
          "Privilégier la cohérence narrative et le développement des personnages.",
        ],
      },
    ],
  },
  {
    title: "CONCLUSION",
    kicker: "SECTION 14 — CONCLUSION",
    stamp: "RESTREINT",
    doc: true,
    blocks: [
      {
        type: "p",
        text: "Le Panthéon est une organisation fondée sur une ambition : transformer une société de sécurité privée en une puissance clandestine capable de bouleverser l'ordre établi.",
      },
      {
        type: "p",
        text: "Sa façade légale lui permet d'exister publiquement, de nouer des relations et de construire une réputation. Ses activités illégales lui donnent accès à un univers de contrats, de rivalités et de négociations. Sa structure paramilitaire lui apporte une identité propre, fondée sur la discipline et la hiérarchie.",
      },
      {
        type: "p",
        text: "Mais son véritable objectif reste dissimulé derrière ces différentes activités : remettre en cause le pouvoir existant et tenter d'imposer un nouvel ordre à Los Santos et Cayo Perico.",
      },
      {
        type: "p",
        text: "Le Panthéon ne revendique pas encore la domination. Il cherche à réunir les moyens, les alliances et l'influence nécessaires pour la rendre possible.",
      },
      {
        type: "quote",
        text: "Les empires ne tombent pas toujours sous les coups de leurs ennemis. Parfois, ils s'effondrent lorsque quelqu'un décide de prendre leur place.",
      },
      {
        type: "quote",
        text: "Le Panthéon — L'ordre dans l'ombre. Le pouvoir au sommet.",
        source: "DEVISE DE L'ORGANISATION",
      },
    ],
  },
];

export const DOSSIERS = {
  pantheon: {
    id: "pantheon",
    name: "LE PANTHÉON",
    ref: "P-01",
    seal: "assets/images/pantheon-seal.png",
    sealKind: "round",
    pages: PANTHEON_PAGES,
  },

  valoris: {
    id: "valoris",
    name: "VALORIS",
    ref: "V-02",
    seal: "assets/images/valoris-logo.webp",
    sealKind: "plate",
    pages: [
      {
        title: "DOSSIER INSTITUTIONNEL",
        kicker: "VAL-SAS-001 · DOSSIER DE PRÉSENTATION RP",
        stamp: "CONFIDENTIEL",
        doc: true,
        masthead: true,
        fields: [
          ["RÉFÉRENCE", "VAL-SAS-001"],
          ["CLASSIFICATION", "CONFIDENTIEL — DOCUMENT INTERNE"],
          ["OBJET", "PRÉSENTATION INSTITUTIONNELLE, ORGANISATION ET CAPACITÉS DE VALORIS"],
          ["ZONE D'ACTIVITÉ", "LOS SANTOS — BLAINE COUNTY — CAYO PERICO, SELON AUTORISATIONS"],
          ["STATUT", "DOSSIER DE PRÉSENTATION RP"],
          ["DIFFUSION", "DIRECTION, RESPONSABLES DE SERVICE ET PERSONNEL AUTORISÉ"],
        ],
        blocks: [
          { type: "sub", text: "SOCIÉTÉ PRIVÉE DE SÉCURITÉ — RÉPUBLIQUE DE SAN ANDREAS · UNIVERS FICTIF GTA RP" },
          {
            type: "callout",
            label: "AVERTISSEMENT",
            text: "Ce document appartient à l'univers fictif du serveur GTA RP. Les références administratives et institutionnelles mentionnées ne correspondent à aucune autorité réelle.",
          },
        ],
        end: "BUREAU DE LA SÉCURITÉ PRIVÉE",
      },
      {
        title: "SYNTHÈSE INSTITUTIONNELLE",
        kicker: "PAGE 01 — VAL-SAS-001-A · CONFIDENTIEL",
        stamp: "CONFIDENTIEL",
        doc: true,
        fields: [
          ["RÉFÉRENCE", "VAL-SAS-001-A"],
          ["NIVEAU", "CONFIDENTIEL"],
          ["OBJET", "IDENTIFICATION ET PRÉSENTATION GÉNÉRALE"],
        ],
        blocks: [
          { type: "sub", text: "1.1 — PRÉSENTATION" },
          {
            type: "p",
            text: "Valoris est une société privée de sécurité spécialisée dans la protection des personnes, la sécurisation des biens et l'accompagnement des entreprises confrontées à des risques particuliers.",
          },
          {
            type: "p",
            text: "L'entreprise fonde son identité sur quatre principes : professionnalisme, discipline, discrétion et fiabilité.",
          },
          {
            type: "p",
            text: "Sa vocation est de proposer à ses clients des prestations adaptées à leurs besoins, dans un cadre contractuel défini et dans le respect des règles applicables au serveur.",
          },
          {
            type: "p",
            text: "Valoris ne se présente pas comme une force militaire indépendante, mais comme un prestataire professionnel capable de collaborer avec les acteurs économiques et institutionnels de San Andreas.",
          },
          { type: "sub", text: "1.2 — DOMAINES D'INTERVENTION" },
          { type: "p", text: "Les activités principales de la société comprennent :" },
          {
            type: "bullets",
            items: [
              "Protection rapprochée et accompagnement de personnalités.",
              "Sécurisation d'événements privés et professionnels.",
              "Surveillance de propriétés et de sites commerciaux.",
              "Escorte de véhicules et de convois.",
              "Évaluation des risques et conseil en sécurité.",
              "Assistance logistique lors d'opérations commerciales.",
              "Formation interne du personnel.",
              "Gestion des incidents dans le cadre des contrats conclus.",
            ],
          },
          { type: "sub", text: "1.3 — POSITIONNEMENT" },
          {
            type: "p",
            text: "Valoris souhaite devenir un interlocuteur reconnu pour la qualité de ses prestations et sa capacité à entretenir des relations professionnelles durables.",
          },
          {
            type: "p",
            text: "Son développement repose sur l'acquisition de contrats, la satisfaction des clients, la formation des agents et la constitution progressive d'une réputation fiable.",
          },
          { type: "sub", text: "1.4 — OBJECTIF GÉNÉRAL" },
          {
            type: "p",
            text: "Établir une entreprise de sécurité privée pérenne, rentable et reconnue dans l'environnement économique de Los Santos.",
          },
          {
            type: "callout",
            label: "APPRÉCIATION",
            text: "Valoris constitue une structure légale destinée à créer des interactions avec les entreprises, les civils, les institutions et les autres acteurs du serveur.",
          },
        ],
        end: "FIN DE SECTION — 01",
      },
      {
        title: "IDENTITÉ, VALEURS ET DOCTRINE",
        kicker: "PAGE 02 — VAL-SAS-001-B · CONFIDENTIEL",
        stamp: "CONFIDENTIEL",
        doc: true,
        fields: [
          ["RÉFÉRENCE", "VAL-SAS-001-B"],
          ["NIVEAU", "CONFIDENTIEL"],
          ["OBJET", "DOCTRINE PROFESSIONNELLE"],
        ],
        blocks: [
          { type: "sub", text: "2.1 — IDENTITÉ DE L'ENTREPRISE" },
          {
            type: "facts",
            items: [
              ["DÉNOMINATION", "VALORIS"],
              ["SECTEUR", "SÉCURITÉ PRIVÉE ET PROTECTION PROFESSIONNELLE"],
              ["STATUT RP", "ENTREPRISE LÉGALE"],
              ["ZONE PRINCIPALE", "LOS SANTOS"],
              [
                "ZONES SECONDAIRES",
                "BLAINE COUNTY ET CAYO PERICO, SOUS RÉSERVE DES AUTORISATIONS ET DU CONTEXTE RP",
              ],
              ["DEVISE PROPOSÉE", "« VOTRE SÉCURITÉ, NOTRE ENGAGEMENT. »"],
            ],
          },
          {
            type: "p",
            text: "Valoris se distingue par une identité visuelle sobre et une communication institutionnelle maîtrisée.",
          },
          {
            type: "p",
            text: "L'entreprise entend inspirer confiance à ses clients sans recourir à une image excessivement agressive ou militarisée.",
          },
          { type: "sub", text: "2.2 — VALEURS FONDAMENTALES" },
          {
            type: "lead",
            lead: "Intégrité.",
            text: "Chaque agent représente l'entreprise et doit préserver sa réputation par son comportement.",
          },
          {
            type: "lead",
            lead: "Discipline.",
            text: "Les procédures internes, les horaires et les responsabilités sont respectés.",
          },
          {
            type: "lead",
            lead: "Professionnalisme.",
            text: "Chaque prestation doit répondre aux besoins définis dans le contrat.",
          },
          {
            type: "lead",
            lead: "Discrétion.",
            text: "Les informations relatives aux clients et aux missions sont traitées avec prudence.",
          },
          {
            type: "lead",
            lead: "Responsabilité.",
            text: "Les agents agissent dans les limites de leurs fonctions et doivent rendre compte des incidents.",
          },
          {
            type: "lead",
            lead: "Excellence.",
            text: "La qualité du service, la formation et l'amélioration continue constituent des objectifs permanents.",
          },
          { type: "sub", text: "2.3 — DOCTRINE D'INTERVENTION" },
          {
            type: "p",
            text: "Valoris privilégie la prévention, la communication et la désescalade.",
          },
          {
            type: "p",
            text: "La présence d'agents vise d'abord à réduire les risques, à rassurer les clients et à faciliter le déroulement des activités protégées.",
          },
          {
            type: "p",
            text: "En cas d'incident, la priorité est accordée à la sécurité des personnes, à l'alerte des services compétents et au respect des procédures prévues par le contrat.",
          },
          { type: "sub", text: "2.4 — IMAGE PUBLIQUE" },
          {
            type: "p",
            text: "L'entreprise doit être perçue comme une structure fiable, organisée et accessible aux clients professionnels.",
          },
          {
            type: "p",
            text: "Sa réputation se construit à travers ses prestations, la conduite de ses agents et la qualité de ses relations commerciales.",
          },
          {
            type: "callout",
            label: "PRINCIPE DIRECTEUR",
            text: "Protéger, prévenir, assister et rendre compte.",
          },
        ],
        end: "FIN DE SECTION — 02",
      },
      {
        title: "ANNEXES",
        kicker: "PIÈCES JOINTES — VAL-SAS-001",
        stamp: "CONFIDENTIEL",
        doc: true,
        annexes: [
          ["PIÈCE 01", "IDENTITÉ VISUELLE", "JOINTE"],
          ["PIÈCE 02", "PROTOCOLES INTERNES", "SCELLÉE"],
          ["PIÈCE 03", "CONTRATS & MANDATS", "SCELLÉE"],
        ],
        note: "Les pièces 02 et 03 restent scellées jusqu'à autorisation de la Direction générale.",
        end: "FIN DU DOSSIER — VAL-SAS-001",
      },
    ],
  },
};

export function getDossier(id) {
  return DOSSIERS[id] || null;
}

export function dossierExists(id) {
  return Object.prototype.hasOwnProperty.call(DOSSIERS, id);
}
