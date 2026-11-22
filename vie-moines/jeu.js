const board = document.querySelector('#mission');
const progress = document.querySelector('#progress');
const zoom = document.querySelector('#zoom');
const zoomImage = document.querySelector('#zoom-image');
const zoomIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="5.5"/><path d="m14 14 5 5M7.5 10h5M10 7.5v5"/></svg>';
const audioIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zM15.5 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></svg>';
const sound = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  ? window.speechSynthesis : null;
const traceParts = trace.map(paragraph => paragraph.split(/\{([^}]+)\}/u));
const traceWords = traceParts.flatMap(parts => parts.filter((_, index) => index % 2));
let stage = 0;
let attempt;
let activeSpeech;

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function button(label, className, onClick) {
  const control = element('button', className, label);
  control.type = 'button';
  control.addEventListener('click', onClick);
  return control;
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  if (result.length > 1 && result.every((item, index) => item === items[index])) {
    result.push(result.shift());
  }
  return result;
}

function endSpeech() {
  if (!activeSpeech) return;
  const { control, block, label } = activeSpeech;
  activeSpeech = null;
  control.setAttribute('aria-pressed', 'false');
  control.setAttribute('aria-label', label);
  block.classList.remove('reading');
}

function stopSpeech() {
  endSpeech();
  if (sound) sound.cancel();
}

function audio(label, speechText, block) {
  const control = button('', 'audio', () => {
    const wasPlaying = activeSpeech?.control === control;
    stopSpeech();
    if (wasPlaying) return;

    const utterance = new SpeechSynthesisUtterance(speechText());
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    const voices = sound.getVoices();
    utterance.voice = voices.find(voice => /^fr[-_]FR$/i.test(voice.lang))
      || voices.find(voice => /^fr\b/i.test(voice.lang)) || null;
    activeSpeech = { utterance, control, block, label };
    control.setAttribute('aria-pressed', 'true');
    control.setAttribute('aria-label', 'Arrêter la lecture');
    block.classList.add('reading');
    const finish = () => {
      if (activeSpeech?.utterance === utterance) endSpeech();
    };
    const failed = () => {
      if (activeSpeech?.utterance !== utterance) return;
      endSpeech();
      const feedback = document.querySelector('#audio-feedback');
      feedback.textContent = 'La lecture audio est indisponible dans ce navigateur.';
      feedback.hidden = false;
    };
    const feedback = document.querySelector('#audio-feedback');
    feedback.hidden = true;
    feedback.textContent = '';
    utterance.onend = finish;
    utterance.onerror = failed;
    try {
      sound.speak(utterance);
    } catch {
      failed();
    }
  });
  control.innerHTML = audioIcon;
  control.setAttribute('aria-label', label);
  control.setAttribute('aria-pressed', 'false');
  control.title = label;
  control.hidden = !sound;
  return control;
}

function readRow(node, label, speechText, block) {
  const row = element('div', 'read-row');
  row.append(node, audio(label, speechText, block || row));
  return row;
}

function updateProgress() {
  progress.replaceChildren();
  missions.forEach((mission, index) => {
    const complete = index < stage || (index === stage && attempt.passed);
    const item = element('li', complete ? 'done' : '');
    if (!complete && index === stage) item.setAttribute('aria-current', 'step');
    if (complete) item.setAttribute('aria-label', `Mission ${index + 1} réussie. ${mission.shortTitle}`);
    const number = element('span', 'number', complete ? '✓' : String(index + 1));
    number.setAttribute('aria-hidden', 'true');
    item.append(number, element('span', '', mission.shortTitle));
    progress.append(item);
  });
}

function setStatus(message, type = '') {
  const status = document.querySelector('#feedback');
  status.className = type ? `status ${type}` : 'status';
  status.textContent = message;
}

function setAnswer(entry, value) {
  entry.value = value;
  entry.result = '';
  if (value !== null && value !== entry.answer) attempt.hadError = true;
  if (!attempt.hadError || !document.querySelector('#feedback').classList.contains('error')) {
    setStatus('');
  }
  refreshAnswers();
}

function refreshAnswers() {
  const used = new Set(attempt.entries.map(entry => entry.value));
  for (const [value, token] of attempt.tokens) {
    token.disabled = used.has(value) || attempt.passed;
    token.setAttribute('aria-pressed', String(attempt.selected === value));
  }
  for (const entry of attempt.entries) {
    if (entry.slot) {
      const filled = entry.value !== null;
      const label = filled ? entry.value : entry.emptyLabel;
      entry.slot.textContent = entry.inline && !filled ? '…' : label;
      entry.slot.setAttribute('aria-label', entry.result
        ? `${entry.context} : ${label}. ${entry.result === 'incorrect' ? 'À corriger.' : 'Réponse correcte.'}`
        : `${entry.context} : ${label}`);
      entry.slot.disabled = attempt.passed;
      entry.slot.classList.toggle('filled', filled);
      entry.slot.classList.toggle('correct', entry.result === 'correct');
      entry.slot.classList.toggle('incorrect', entry.result === 'incorrect');
    }
    for (const [value, control] of entry.choices || []) {
      const selected = entry.value === value;
      control.setAttribute('aria-pressed', String(selected));
      control.disabled = attempt.passed;
      control.classList.toggle('correct', selected && entry.result === 'correct');
      control.classList.toggle('incorrect', selected && entry.result === 'incorrect');
    }
  }
}

function createSlot(entry, context, inline = false) {
  entry.context = context;
  entry.inline = inline;
  entry.emptyLabel = inline ? 'Trou vide' : 'Placer une étiquette';
  entry.slot = button('', 'slot', () => {
    if (attempt.selected !== null) {
      const value = attempt.selected;
      attempt.selected = null;
      setAnswer(entry, value);
      entry.slot.focus({ preventScroll: true });
    } else if (entry.value !== null) {
      setAnswer(entry, null);
    } else {
      setStatus('Choisis d’abord une étiquette dans la banque.', 'notice');
    }
  });
  if (inline) entry.slot.style.setProperty('--blank-width', `${Math.max(7, entry.answer.length + 2)}ch`);
  return entry.slot;
}

function createBank(title, words) {
  const bank = element('section', 'bank');
  const head = element('div', 'bank-head');
  const tokens = element('div', 'tokens');
  const orderedWords = shuffled(words);
  const selectedWord = element('span', 'sr-only');
  selectedWord.setAttribute('role', 'status');
  head.append(element('h3', '', title),
    audio('Écouter les étiquettes de la banque', () => orderedWords.join('. '), bank));
  for (const word of orderedWords) {
    const token = button(word, 'token', () => {
      attempt.selected = attempt.selected === word ? null : word;
      selectedWord.textContent = attempt.selected ? `Étiquette sélectionnée : ${word}.` : 'Sélection annulée.';
      refreshAnswers();
    });
    attempt.tokens.set(word, token);
    tokens.append(token);
  }
  bank.append(head, tokens, selectedWord);
  return bank;
}

function createGuide() {
  const details = element('details', 'document');
  details.append(element('summary', '', 'Le guide de l’abbaye'));
  const intro = element('p', 'guide-intro', 'Une abbaye est un grand monastère. Les moines y vivent ensemble selon la règle de Saint Benoît. À Cluny, la prière occupe une place très importante.');
  details.append(readRow(intro, 'Écouter la présentation de l’abbaye', () => intro.textContent));
  const gallery = element('div', 'source-gallery');
  for (const [file, caption] of [
    ['plan-cluny', 'Vue de l’abbaye de Cluny'],
    ['cloitre-cluny', 'Le cloître'],
    ['salle-cluny', 'Une salle de l’abbaye']
  ]) {
    const figure = element('figure');
    figure.append(artButton(file, caption), element('figcaption', '', caption));
    gallery.append(figure);
  }
  details.append(gallery);
  const definitions = element('div', 'definitions');
  for (const place of places) {
    const article = element('article');
    article.append(readRow(element('h3', '', place.answer), 'Écouter « ' + place.answer + ' »',
      () => place.answer + '. ' + place.description, article), element('p', '', place.description));
    definitions.append(article);
  }
  details.append(definitions);
  stopWhenClosed(details);
  return details;
}

function stopWhenClosed(details) {
  details.addEventListener('toggle', () => {
    if (!details.open && details.contains(activeSpeech?.block)) stopSpeech();
  });
}

function artButton(image, description) {
  const art = button('', 'art', () => {
    zoomImage.src = artwork.src;
    zoomImage.alt = description;
    zoom.showModal();
  });
  art.setAttribute('aria-label', 'Agrandir la scène : ' + description);
  const artwork = element('img');
  artwork.src = './images/' + image + '.webp';
  artwork.alt = '';
  const magnifier = element('span');
  magnifier.innerHTML = zoomIcon;
  art.append(artwork, magnifier);
  return art;
}

function createScene(entry, index) {
  const { image, description } = entry.scene;
  const sceneName = 'Scène ' + (index + 1);
  const card = element('article', 'card');
  card.setAttribute('aria-label', sceneName);
  const body = element('div', 'card-body');
  body.append(readRow(element('p', '', description), 'Écouter la scène ' + (index + 1), () => description));
  body.append(createSlot(entry, sceneName));
  card.append(artButton(image, description), body);
  return card;
}

function createSchedule() {
  const details = element('details', 'document timetable');
  details.open = true;
  details.append(element('summary', '', 'Consulter l’emploi du temps complet'));
  const intro = element('p', '', 'La journée alterne prières, travail, repas et repos. Sélectionne un moment pour lire ou écouter ce que font les moines.');
  details.append(readRow(intro, 'Écouter la présentation de la journée', () => intro.textContent));
  for (const period of schedule) {
    const item = element('details', 'period ' + period.kind);
    item.append(element('summary', '', period.hours + ' · ' + period.title));
    const block = element('div', 'period-body');
    const place = element('p', 'period-place', period.place);
    const text = element('p', '', period.text);
    block.append(readRow(place, 'Écouter ' + period.title + ', ' + period.hours,
      () => period.hours + '. ' + period.title + '. ' + period.text, block), text);
    item.append(block);
    stopWhenClosed(item);
    details.append(item);
  }
  stopWhenClosed(details);
  return details;
}

function createDay() {
  const wrapper = element('div', 'day-exercise');
  const timeline = element('div', 'timeline');
  attempt.entries.slice(0, dayChallenges.length).forEach((entry, index) => {
    const period = schedule[entry.scene.period];
    const row = element('article', 'time-slot');
    row.append(element('h3', 'hour', period.hours), createSlot(entry, period.hours));
    timeline.append(row);
  });
  const questions = element('div', 'questions');
  attempt.entries.slice(dayChallenges.length).forEach(entry => {
    const article = element('article', 'question');
    const label = element('h3', '', entry.scene.question);
    article.append(readRow(label, 'Écouter la question', () => entry.scene.question));
    const options = element('div', 'role-list');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', entry.scene.question);
    entry.choices = new Map();
    for (const value of shuffled(entry.scene.options)) {
      const row = element('div', 'choice-row');
      const choice = button(value, 'role', () => setAnswer(entry, value));
      entry.choices.set(value, choice);
      row.append(choice, audio('Écouter « ' + value + ' »', () => value, row));
      options.append(row);
    }
    article.append(options);
    questions.append(article);
  });
  wrapper.append(timeline, questions);
  return wrapper;
}

function createBookWorkshop() {
  const workshop = element('section', 'workshop');
  const heading = element('h3', '', 'Le livre de la classe');
  const instruction = 'Choisis un moment de la journée, imprime ta page et illustre la scène. La classe pourra ensuite réunir les pages dans l’ordre chronologique.';
  workshop.append(readRow(heading, 'Écouter la consigne pour le livre', () => instruction), element('p', '', instruction));
  const label = element('label', '', 'Mon moment à illustrer');
  label.htmlFor = 'book-period';
  const select = element('select');
  select.id = 'book-period';
  schedule.forEach((period, index) => {
    const option = element('option', '', period.hours + ' · ' + period.title);
    option.value = String(index);
    select.append(option);
  });
  const preview = element('div', 'book-page');
  preview.id = 'book-page';
  const update = () => {
    stopSpeech();
    const period = schedule[Number(select.value)];
    const title = element('h2', '', period.hours + ' · ' + period.title);
    const text = element('p', '', period.text);
    const drawing = element('div', 'drawing-space');
    drawing.setAttribute('aria-label', 'Espace pour dessiner la scène');
    preview.replaceChildren(title, text, drawing);
  };
  select.addEventListener('change', update);
  const print = button('Imprimer ma page à illustrer', 'secondary', () => {
    stopSpeech();
    document.body.classList.add('print-book');
    window.print();
  });
  const listen = audio('Écouter le moment choisi', () => schedule[Number(select.value)].text, preview);
  workshop.append(label, select, listen, preview, print);
  update();
  return workshop;
}

function createTrace() {
  const sheet = element('div', 'trace');
  sheet.append(readRow(element('h3', '', lessonTitle), 'Écouter la trace écrite',
    () => traceParts.map(parts => parts.map((part, index) => index % 2 ? ' mot manquant ' : part).join('')).join('\n'), sheet));
  let blank = 0;
  for (const parts of traceParts) {
    const paragraph = element('p');
    parts.forEach((part, index) => {
      if (index % 2) {
        const entry = attempt.entries[blank];
        blank++;
        paragraph.append(createSlot(entry, `Trou ${blank}`, true));
      } else {
        paragraph.append(document.createTextNode(part));
      }
    });
    sheet.append(paragraph);
  }
  return sheet;
}

function paperLinks() {
  const links = element('div', 'paper-links');
  for (const [filename, label] of [
    ['trace-classique.pdf', 'Imprimer la trace'],
    ['trace-dys.pdf', 'Imprimer la version DYS']
  ]) {
    const link = element('a', 'secondary', label);
    link.href = `./${filename}`;
    link.target = '_blank';
    link.rel = 'noopener';
    links.append(link);
  }
  return links;
}

function createControls() {
  const area = element('div', 'control-area');
  const feedback = element('div', 'status');
  feedback.id = 'feedback';
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-atomic', 'true');
  const controls = element('div', 'controls');
  controls.append(
    button('Vérifier', 'primary', verify),
    button('Recommencer', 'secondary', () => renderMission(true))
  );
  area.append(feedback, controls);
  return area;
}

function verify() {
  if (attempt.entries.some(entry => entry.value === null)) {
    setStatus('Il reste des réponses à placer. Termine la mission avant de vérifier.', 'notice');
    return;
  }

  const allCorrect = attempt.entries.every(entry => entry.value === entry.answer);
  if (!allCorrect || attempt.hadError) {
    for (const entry of attempt.entries) {
      entry.result = entry.value === entry.answer ? 'correct' : 'incorrect';
    }
    refreshAnswers();
    setStatus(allCorrect
      ? 'Toutes tes réponses sont maintenant justes. Clique sur « Recommencer » pour réussir la mission sans erreur.'
      : 'Les réponses à corriger sont en rouge. Tu peux les corriger, puis cliquer sur « Recommencer » pour réussir la mission sans erreur.', 'error');
    return;
  }

  attempt.passed = true;
  attempt.selected = null;
  for (const entry of attempt.entries) entry.result = 'correct';
  refreshAnswers();
  updateProgress();
  setStatus('Bravo ! Tu as réussi cette mission sans erreur.', 'success');
  const last = stage === missions.length - 1;
  const next = button(last ? 'Terminer le jeu' : 'Mission suivante', 'primary', () => {
    stage++;
    renderMission(true);
  });
  board.querySelector('.controls').replaceChildren(next);
  next.focus({ preventScroll: true });
}

function renderMission(focusHeading = false) {
  stopSpeech();
  board.replaceChildren();
  const mission = missions[stage];
  if (!mission) {
    board.classList.add('finish');
    const title = element('h2', '', 'Les trois missions sont réussies !');
    title.id = 'mission-title';
    title.tabIndex = -1;
    const controls = element('div', 'controls');
    controls.append(button('Rejouer', 'primary', () => {
      stage = 0;
      renderMission(true);
    }));
    board.append(title, element('p', '', 'Tu connais les lieux de l’abbaye et les moments qui rythment la vie des moines.'), controls, paperLinks(), createBookWorkshop());
    updateProgress();
    title.focus();
    return;
  }

  board.classList.remove('finish');
  const scenes = stage === 0 ? shuffled(places) : [...dayChallenges, ...rhythmQuestions];
  const entries = stage < 2
    ? scenes.map(scene => ({ scene, answer: scene.answer, value: null }))
    : traceWords.map(answer => ({ answer, value: null }));
  attempt = { entries, tokens: new Map(), hadError: false, passed: false, selected: null };
  updateProgress();
  const title = element('h2', '', mission.title);
  title.id = 'mission-title';
  title.tabIndex = -1;
  const instructions = readRow(element('p', '', mission.instruction), 'Écouter la consigne', () => mission.instruction);
  instructions.classList.add('instruction');
  const audioFeedback = element('p', 'status notice');
  audioFeedback.id = 'audio-feedback';
  audioFeedback.setAttribute('role', 'status');
  audioFeedback.hidden = true;
  board.append(title, instructions, audioFeedback);

  if (stage === 0) {
    board.append(createGuide(), createBank('Les lieux de l’abbaye', places.map(place => place.answer)));
    const grid = element('div', 'grid places');
    grid.append(...entries.map(createScene));
    board.append(grid);
  } else if (stage === 1) {
    board.append(createSchedule(), createBank('Les moments de la journée', dayChallenges.map(item => item.answer)), createDay());
  } else {
    board.append(createBank('Banque de mots', traceWords), createTrace());
  }
  board.append(createControls());
  if (stage === 2) board.append(paperLinks());
  refreshAnswers();
  if (focusHeading) title.focus();
}

window.addEventListener('afterprint', () => document.body.classList.remove('print-book'));
window.addEventListener('pagehide', stopSpeech);
renderMission();
