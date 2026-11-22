const lessonTitle = 'La journée d’un moine';
const places = [
  { answer: 'Église', image: 'priere', description: 'Les moines chantent des psaumes et écoutent des textes de la Bible.' },
  { answer: 'Dortoir', image: 'repos', description: 'Les moines dorment dans une grande salle commune, chacun dans un lit simple.' },
  { answer: 'Salle capitulaire', image: 'reunion', description: 'Les moines écoutent la règle de Saint Benoît. L’abbé donne les consignes pour la journée.' },
  { answer: 'Scriptorium', image: 'copie', description: 'Les moines copient des livres à la main avec des plumes et décorent les lettres.' },
  { answer: 'Réfectoire', image: 'repas', description: 'Les moines mangent en silence à de longues tables pendant qu’un moine lit un texte religieux.' },
  { answer: 'Cloître', image: 'meditation', description: 'Les moines se promènent ou s’assoient autour du jardin pour réfléchir et prier en silence.' },
  { answer: 'Infirmerie', image: 'soins', description: 'Des moines soignent les malades avec des plantes médicinales et leur apportent du réconfort.' },
  { answer: 'Hôtellerie', image: 'accueil', description: 'Des moines accueillent les voyageurs et les pauvres. Ils leur offrent un repas et un endroit pour se reposer.' }
];

const schedule = [
  { hours: '1 h – 2 h', title: 'Matines', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines se réveillent en pleine nuit dans le dortoir et marchent en silence jusqu’à l’église. Dans la pénombre, éclairés par quelques bougies, ils chantent des psaumes et écoutent des textes de la Bible. Ils portent une longue robe sombre avec une capuche.' },
  { hours: '2 h – 3 h 30', title: 'Repos', place: 'Dortoir', image: 'repos', kind: 'repos', text: 'Après la prière, les moines retournent se coucher dans le dortoir. Ils dorment dans une grande salle commune, chacun dans un lit simple, souvent sans parler.' },
  { hours: '3 h 30 – 4 h 30', title: 'Laudes', place: 'Église', image: 'priere', kind: 'priere', text: 'À l’aube, les moines se lèvent à nouveau et rejoignent l’église. Les laudes sont une prière pour remercier Dieu pour le jour qui commence. La lumière du matin entre doucement dans l’église pendant qu’ils chantent.' },
  { hours: '4 h 30 – 6 h', title: 'Repos', place: 'Dortoir', image: 'repos', kind: 'repos', text: 'Les moines retournent dormir encore un peu avant le début de la journée.' },
  { hours: '6 h – 6 h 30', title: 'Prime', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines prient dans l’église pour commencer officiellement la journée. Ils chantent ensemble et se tiennent debout ou assis sur des bancs en bois.' },
  { hours: '6 h 30 – 7 h', title: 'Réunion dans la salle capitulaire', place: 'Salle capitulaire', image: 'reunion', kind: 'communaute', text: 'Les moines s’installent en cercle dans la salle capitulaire. Ils écoutent un passage de la règle de Saint Benoît, puis l’abbé donne les consignes pour la journée. C’est un moment important de vie collective.' },
  { hours: '7 h – 9 h', title: 'Travail', place: 'Dans ou autour de l’abbaye', image: 'copie', kind: 'travail', text: 'Certains moines travaillent dans les champs ou le potager. Ils plantent, arrosent et récoltent des légumes pour nourrir toute la communauté. D’autres fabriquent des objets ou entretiennent les bâtiments. Dans le scriptorium, les moines copient des livres à la main avec des plumes. Ils décorent les lettres avec des couleurs et parfois de l’or : ce sont des enluminures.' },
  { hours: '9 h – 9 h 30', title: 'Tierce', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines arrêtent leur travail et se rendent à l’église. Ils prient ensemble pendant un court moment avant de reprendre leurs activités.' },
  { hours: '9 h 30 – 11 h 30', title: 'Travail', place: 'Dans ou autour de l’abbaye', image: 'copie', kind: 'travail', text: 'Les moines reprennent leur travail dans le calme. Certains lisent et étudient, d’autres travaillent à l’extérieur ou copient des manuscrits.' },
  { hours: '11 h 30 – 12 h 30', title: 'Sexte', place: 'Église', image: 'priere', kind: 'priere', text: 'À midi, les moines se rassemblent dans l’église pour prier. Ils chantent des psaumes et prennent un moment de recueillement au milieu de la journée.' },
  { hours: '12 h 30 – 13 h', title: 'Repas', place: 'Réfectoire', image: 'repas', kind: 'repas', text: 'Les moines se lavent les mains au lavabo avant d’entrer dans le réfectoire. Ils mangent en silence à de longues tables pendant qu’un moine lit un texte religieux. Le repas est simple : pain, soupe, légumes, parfois du poisson.' },
  { hours: '13 h – 15 h', title: 'Repos', place: 'Dortoir', image: 'repos', kind: 'repos', text: 'Les moines retournent se reposer dans le dortoir. Certains dorment, d’autres restent silencieux pour se détendre.' },
  { hours: '15 h – 15 h 30', title: 'None', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines prient à nouveau dans l’église. Ils interrompent leurs activités pour se concentrer sur la prière.' },
  { hours: '15 h 30 – 18 h', title: 'Travail et rôles', place: 'Dans ou autour de l’abbaye', image: 'soins', kind: 'travail', text: 'Certains moines travaillent encore dans les champs ou le jardin. Ils s’occupent des plantes et des récoltes. À l’infirmerie, des moines soignent les malades avec des plantes médicinales et leur apportent du réconfort. À l’hôtellerie, des moines accueillent les voyageurs et les pauvres. Ils leur offrent un repas et un endroit pour se reposer.' },
  { hours: '18 h – 18 h 30', title: 'Vêpres', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines se rendent à l’église pour la prière du soir. Ils chantent ensemble dans une ambiance plus calme, parfois à la lumière des bougies. C’est un moment pour remercier Dieu pour la journée.' },
  { hours: '18 h 30 – 19 h', title: 'Repas du soir', place: 'Réfectoire', image: 'repas', kind: 'repas', text: 'Les moines mangent un second repas simple au réfectoire. Comme à midi, ils restent en silence et écoutent une lecture.' },
  { hours: '19 h – 19 h 30', title: 'Méditation', place: 'Cloître', image: 'meditation', kind: 'priere', text: 'Les moines se promènent ou s’assoient dans le cloître, autour du jardin. Ils réfléchissent à leur journée, prient en silence ou pensent à leur relation avec Dieu.' },
  { hours: '19 h 30 – 20 h', title: 'Complies', place: 'Église', image: 'priere', kind: 'priere', text: 'Les moines prient une dernière fois dans l’église. Ils chantent doucement et demandent protection pour la nuit. L’ambiance est calme et silencieuse.' },
  { hours: '20 h – 1 h', title: 'Nuit', place: 'Dortoir', image: 'repos', kind: 'repos', text: 'Les moines retournent dormir dans le dortoir. Ils dorment habillés simplement, prêts à se lever dans la nuit pour prier à nouveau.' }
];

const dayChallenges = [
  { period: 0, answer: 'Matines' },
  { period: 4, answer: 'Prime' },
  { period: 5, answer: 'Réunion avec l’abbé' },
  { period: 6, answer: 'Travail du matin' },
  { period: 10, answer: 'Repas de midi' },
  { period: 12, answer: 'None' },
  { period: 16, answer: 'Méditation' },
  { period: 18, answer: 'Nuit au dortoir' }
];

const rhythmQuestions = [
  { question: 'Qu’est-ce qui interrompt souvent le travail des moines ?', options: ['La prière', 'Le repas', 'Le sommeil'], answer: 'La prière' },
  { question: 'Comment les moines prennent-ils leurs repas ?', options: ['En bavardant', 'En silence, en écoutant une lecture', 'Chacun dans sa chambre'], answer: 'En silence, en écoutant une lecture' }
];

// Synthèse rédigée à partir des documents fournis pour la séance 9.
const trace = [
  'Au Moyen Âge, les moines vivent ensemble dans des monastères ou des {abbayes}, comme à Cluny. Ils suivent la règle de {Saint Benoît}.',
  'Leur journée est rythmée par la {prière}, le {travail} et le {repos}. Ils se lèvent même la nuit pour prier.',
  'Ils prient dans l’{église}, dorment dans le {dortoir} et mangent en silence au {réfectoire}.',
  'Dans le {scriptorium}, ils copient les livres à la main et les décorent avec des {enluminures}. Ils travaillent aussi dans les champs, soignent les malades et accueillent les voyageurs et les pauvres.'
];

const missions = [
  { title: 'À chaque activité son lieu', shortTitle: 'Les lieux', instruction: 'Observe les scènes. Sélectionne un lieu dans la banque, puis touche la case sous la scène correspondante. Tu peux consulter le guide de l’abbaye.', scenes: places },
  { title: 'Reconstitue la journée du moine', shortTitle: 'La journée', instruction: 'Consulte l’emploi du temps, puis place les huit moments à la bonne heure. Réponds ensuite aux deux questions. Tu peux retirer une étiquette en touchant sa case.' },
  { title: 'Ce que je retiens', shortTitle: 'La synthèse', instruction: 'Sélectionne un mot de la banque, puis touche le trou à compléter. Pour retirer un mot, touche-le dans le texte.' }
];
