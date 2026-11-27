// Demo-Assistent: zeigt die Regel-Logik des Chats aus Betüls erstem Projekt. Keine KI, nichts wird gesendet.
const BOT = {
  tr: { hi: 'Merhaba! Ben demo asistanım. Yapay zekâ değilim, sadece birkaç kural.', appt: 'Takvimden uygun bir gün ve saat seçebilirsiniz. (Demo)', who: 'Ben, Betül’ün ilk projesindeki sohbet kutusunun basit bir demosuyum.', help: 'Şunları sorabilirsiniz: Merhaba, Randevu, Sen kimsin?, Teşekkürler.', thanks: 'Rica ederim!', def: 'Bunu henüz bilmiyorum. Şunları deneyin: Merhaba, Randevu, Yardım.', chips: ['Merhaba', 'Randevu', 'Sen kimsin?', 'Yardım'] },
  de: { hi: 'Hallo! Ich bin der Demo-Assistent. Keine KI, nur ein paar Regeln.', appt: 'Im Kalender kannst du einen freien Tag und eine Uhrzeit wählen. (Demo)', who: 'Ich bin eine kleine Demo des Chats aus Betüls erstem Projekt.', help: 'Frag mich zum Beispiel: Hallo, Termin, Wer bist du?, Danke.', thanks: 'Gern geschehen!', def: 'Das weiß ich noch nicht. Probier: Hallo, Termin, Hilfe.', chips: ['Hallo', 'Termin', 'Wer bist du?', 'Hilfe'] },
  en: { hi: 'Hello! I am the demo assistant. Not an AI, just a few rules.', appt: 'In the calendar you can pick a free day and time. (Demo)', who: 'I am a small demo of the chat from Betül’s first project.', help: 'Try asking: Hello, Appointment, Who are you?, Thanks.', thanks: 'You’re welcome!', def: 'I don’t know that yet. Try: Hello, Appointment, Help.', chips: ['Hello', 'Appointment', 'Who are you?', 'Help'] },
};

const reply = (q, l) => {
  q = q.toLocaleLowerCase(l).trim();
  const B = BOT[l];
  if (/merhaba|selam|hallo|hello|\bhi\b|hey/.test(q)) return B.hi;
  if (/randevu|termin|appointment|booking/.test(q)) return B.appt;
  if (/kimsin|\bkim\b|wer bist|\bwer\b|who/.test(q)) return B.who;
  if (/yardım|yardim|hilfe|help/.test(q)) return B.help;
  if (/teşekkür|tesekkur|danke|thank/.test(q)) return B.thanks;
  return B.def;
};

export function initChat(root) {
  if (!root) return;
  const lang = BOT[document.documentElement.lang] ? document.documentElement.lang : 'tr';
  const msgs = root.querySelector('.chat__msgs');
  const chips = root.querySelector('.chat__chips');
  const form = root.querySelector('.chat__form');
  const input = form.querySelector('input');

  const add = (text, me = false) => {
    const m = document.createElement('p');
    m.className = 'msg' + (me ? ' msg--me' : '');
    m.textContent = text;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  };
  const ask = (q) => {
    if (!q.trim()) return;
    add(q, true);
    const typing = add('• • •');
    typing.classList.add('msg--typing');
    setTimeout(() => { typing.textContent = reply(q, lang); typing.classList.remove('msg--typing'); msgs.scrollTop = msgs.scrollHeight; }, 550);
  };

  add(BOT[lang].hi);
  BOT[lang].chips.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = c;
    b.addEventListener('click', () => ask(c));
    chips.appendChild(b);
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value.slice(0, 120)); input.value = ''; });
}
