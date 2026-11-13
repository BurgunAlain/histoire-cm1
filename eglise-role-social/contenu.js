const roles = [
  { id: 'soigner', label: 'Soigner' },
  { id: 'enseigner', label: 'Enseigner et transmettre le savoir' },
  { id: 'proteger', label: 'Protéger et faire la paix' }
];

const ceremonies = [
  { image: 'messe', answer: 'Messe', description: 'Deux personnages se tiennent près d’un autel.' },
  { image: 'mariage', answer: 'Mariage', description: 'Deux personnes en habits de fête se tiennent côte à côte devant un religieux.' },
  { image: 'bapteme', answer: 'Baptême', description: 'Un enfant est tenu au-dessus d’une cuve, entouré d’adultes.' },
  { image: 'enterrement', answer: 'Enterrement', description: 'Des personnages entourent un cercueil recouvert d’un tissu bleu.' }
];

const socialScenes = [
  { image: 'ecole', answer: 'enseigner', description: 'Un religieux lit un livre devant un groupe qui l’écoute. Des livres sont rangés tout autour.' },
  { image: 'hospice', answer: 'soigner', description: 'Des religieuses se tiennent devant des rangées de lits occupés.' },
  { image: 'copie', answer: 'enseigner', description: 'Un moine écrit dans un livre ouvert. Autour de lui, le manuscrit est décoré de dessins colorés.' },
  { image: 'protection', answer: 'proteger', description: 'Un religieux et un paysan sont représentés de part et d’autre d’un homme en armure.' },
  { image: 'paix', answer: 'proteger', description: 'Un religieux parle à un chevalier en armure.' },
  { image: 'soins', answer: 'soigner', description: 'Un homme s’occupe de la jambe d’une personne assise. D’autres personnes sont allongées derrière eux.' }
];

const documentary = [
  {
    title: 'Soigner les malades',
    paragraphs: [
      'Les moines et les religieuses accueillent les malades dans des hospices, souvent près des monastères. Ils soignent aussi les pauvres et les voyageurs.',
      'Ils utilisent des plantes pour fabriquer des remèdes et apportent du réconfort aux personnes en difficulté. À une époque où il y a peu de médecins, l’Église aide les plus fragiles.'
    ]
  },
  {
    title: 'Enseigner et transmettre le savoir',
    paragraphs: [
      'Les religieux enseignent dans des écoles, surtout aux garçons qui apprennent à lire, à écrire et à connaître la religion chrétienne. Dans les monastères, les moines copient les livres à la main dans des salles appelées scriptoriums. Ils décorent les textes avec de belles lettres et des dessins colorés : ce sont des enluminures.',
      'Grâce à ce travail, les connaissances sont conservées.'
    ]
  },
  {
    title: 'Pacifier la société',
    paragraphs: [
      'Au Moyen Âge, les seigneurs se font souvent la guerre.',
      'L’Église met en place la Paix de Dieu pour limiter les violences. Elle interdit d’attaquer certaines personnes et certains lieux.',
      'Elle protège les plus faibles : les paysans, les femmes, les enfants et les lieux religieux.'
    ]
  }
];

const trace = [
  'Au Moyen Âge, l’{Église} tient une place très importante dans la vie des {chrétiens}. Elle accompagne les hommes et les femmes tout au long de leur vie.',
  'Elle rythme les grands moments : {baptême} à la naissance, {mariage}, messes régulières et {funérailles}.',
  'Mais l’Église ne s’occupe pas seulement de la religion. Elle joue aussi un {rôle social} important.',
  'Elle soigne les {malades} et accueille les pauvres dans des {hospices}. Elle enseigne dans les {écoles}. Les {moines} copient aussi les livres en les décorant : ce sont des {enluminures}. Enfin, elle cherche à limiter les violences grâce à la {Paix de Dieu}.',
  'Ainsi, l’Église organise la vie des chrétiens et participe à la société.'
];

const missions = [
  {
    title: 'Reconnais les cérémonies',
    shortTitle: 'Les cérémonies',
    instruction: 'Observe les quatre enluminures. Sélectionne une cérémonie, puis touche la case sous l’image qui lui correspond.',
    scenes: ceremonies
  },
  {
    title: 'Découvre le rôle social de l’Église',
    shortTitle: 'Les rôles de l’Église',
    instruction: 'Lis ou écoute le texte documentaire. Pour chaque enluminure, choisis le rôle de l’Église qu’elle permet d’illustrer.',
    scenes: socialScenes
  },
  {
    title: 'Complète la trace écrite',
    shortTitle: 'La trace écrite',
    instruction: 'Sélectionne un mot de la banque, puis touche le trou où tu veux le placer. Pour retirer un mot, touche-le dans le texte.'
  }
];
