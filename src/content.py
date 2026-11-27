# Alle Texte der Seite in drei Sprachen. Ändern, dann `python3 src/build.py` ausführen.
# Reihenfolge der Sprachen: tr (Standard, index.html), de (de.html), en (en.html).

LANGS = ["tr", "de", "en"]

T = {
  "title": {
    "tr": "Betül Kılıç · Web geliştirme",
    "de": "Betül Kılıç · Webentwicklung",
    "en": "Betül Kılıç · Web development",
  },
  "description": {
    "tr": "Betül Kılıç, 15 yaşında web geliştirici. Bir kâğıt parçası neden uçamasın? Fikirler, ilgi alanları ve projeler.",
    "de": "Betül Kılıç, 15, entwickelt Websites. Warum sollte ein Blatt Papier nicht fliegen? Ideen, Interessen und Projekte.",
    "en": "Betül Kılıç, 15, builds websites. Why shouldn't a sheet of paper fly? Ideas, interests and projects.",
  },
  "skip": {"tr": "İçeriğe geç", "de": "Zum Inhalt", "en": "Skip to content"},
  "nav_about": {"tr": "Hakkımda", "de": "Über mich", "en": "About"},
  "nav_interests": {"tr": "İlgi alanları", "de": "Interessen", "en": "Interests"},
  "nav_journey": {"tr": "Yolculuk", "de": "Weg", "en": "Journey"},
  "nav_projects": {"tr": "Projeler", "de": "Projekte", "en": "Projects"},
  "nav_contact": {"tr": "Yaz bana", "de": "Schreib mir", "en": "Write me"},
  "lang_label": {"tr": "Dil", "de": "Sprache", "en": "Language"},

  # HERO
  "hero_meta_l": {"tr": "N° 15 — Web geliştirme", "de": "N° 15 — Webentwicklung", "en": "N° 15 — Web development"},
  "hero_meta_r": {"tr": "Portfolyo · 2026", "de": "Portfolio · 2026", "en": "Portfolio · 2026"},
  "hero_lead": {
    "tr": "15 yaşındayım ve web siteleri geliştiriyorum. Her şey bir fikirle başlar, <em>kodla havalanır.</em>",
    "de": "Ich bin 15 und baue Websites. Alles beginnt mit einer Idee und <em>hebt mit Code ab.</em>",
    "en": "I'm 15 and I build websites. Everything starts with an idea and <em>takes off with code.</em>",
  },
  "hero_scroll": {"tr": "Kaydır", "de": "Scrollen", "en": "Scroll"},
  "hero_tag": {"tr": "Teknoloji · Fikirler · Merak", "de": "Technik · Ideen · Neugier", "en": "Technology · Ideas · Curiosity"},

  # MANIFEST
  "manifest_eyebrow": {"tr": "Bir soru", "de": "Eine Frage", "en": "A question"},
  "manifest_q": {
    "tr": "Bir kâğıt parçası neden <em>uçamasın</em> ya da yüzemesin?",
    "de": "Warum sollte ein Blatt Papier nicht <em>fliegen</em> oder schwimmen können?",
    "en": "Why shouldn't a sheet of paper be able to <em>fly</em> or swim?",
  },
  "manifest_text": {
    "tr": "Düşünceleri erken aşamada sınırlamamak gerektiğine inanıyorum. Çünkü alışılmadık bir fikirden değerli bir şey doğabilir.",
    "de": "Ich halte es für wichtig, Gedanken nicht zu früh einzuschränken. Denn aus einer ungewöhnlichen Idee kann etwas Wertvolles entstehen.",
    "en": "I think it is important not to limit your thoughts too early. Because an unusual idea can turn into something valuable.",
  },

  # STORY
  "story_eyebrow": {"tr": "Uçuş planı", "de": "Flugplan", "en": "Flight plan"},
  "story_1": {"tr": "Bir kâğıt.", "de": "Ein Blatt Papier.", "en": "A sheet of paper."},
  "story_2": {"tr": "Bir kıvrım. Bir fikir.", "de": "Ein Falz. Eine Idee.", "en": "One fold. One idea."},
  "story_3": {"tr": "Uçuyor, yıldızlara kadar.", "de": "Es fliegt, bis zu den Sternen.", "en": "It flies, all the way to the stars."},
  "story_4": {"tr": "Ve koda dönüşüyor.", "de": "Und wird zu Code.", "en": "And turns into code."},

  # ABOUT
  "about_eyebrow": {"tr": "Hakkımda", "de": "Über mich", "en": "About me"},
  "about_title": {"tr": "Merhaba, ben <em>Betül.</em>", "de": "Hallo, ich bin <em>Betül.</em>", "en": "Hi, I'm <em>Betül.</em>"},
  "about_text": {
    "tr": "15 yaşındayım; web geliştirme, teknoloji ve yaratıcı fikirlerle ilgileniyorum. Benim için yaratıcılık yazılımla sınırlı değil: Donanımdan robotiğe, gündelik hayatı kolaylaştıran icatlara kadar uzanıyor.",
    "de": "Ich bin 15 Jahre alt und beschäftige mich mit Webentwicklung, Technik und kreativen Ideen. Kreativität endet für mich nicht bei Software: Sie reicht von Hardware und Robotik bis zu Erfindungen, die den Alltag erleichtern.",
    "en": "I'm 15 years old and I work with web development, technology and creative ideas. For me, creativity does not end with software: it ranges from hardware and robotics to inventions that make everyday life easier.",
  },
  "lens_hint": {
    "tr": "Fareyi fotoğrafın üzerinde gezdir: büyüteç bölgeyi koda çevirir.",
    "de": "Fahr mit der Maus über das Foto: Die Lupe verwandelt den Bereich in Code.",
    "en": "Move your mouse over the photo: the lens turns that area into code.",
  },
  "lens_hint_touch": {
    "tr": "Fotoğrafa dokun ve parmağını kaydır: büyüteç bölgeyi koda çevirir.",
    "de": "Tippe aufs Foto und streiche darüber: Die Lupe verwandelt den Bereich in Code.",
    "en": "Tap the photo and swipe across it: the lens turns that area into code.",
  },
  "lens_cursor": {"tr": "Çöz", "de": "Decode", "en": "Decode"},
  "photo_alt": {
    "tr": "Betül, başörtülü ve açık renk elbiseyle denizde duruyor, ufka bakıyor.",
    "de": "Betül steht mit Hijab und hellem Kleid im Meer und blickt zum Horizont.",
    "en": "Betül stands in the sea in a hijab and a light dress, looking at the horizon.",
  },
  "f_name": {"tr": "Ad", "de": "Name", "en": "Name"},
  "f_age": {"tr": "Yaş", "de": "Alter", "en": "Age"},
  "f_int": {"tr": "İlgi alanları", "de": "Interessen", "en": "Interests"},
  "f_int_v": {"tr": "Doğa, astronomi, tarih, siyaset", "de": "Natur, Astronomie, Geschichte, Politik", "en": "Nature, astronomy, history, politics"},
  "f_free": {"tr": "Boş zaman", "de": "Freizeit", "en": "Free time"},
  "f_free_v": {"tr": "Binicilik, okçuluk, yazarlık", "de": "Reiten, Bogenschießen, Schreiben", "en": "Horse riding, archery, writing"},
  "f_id": {"tr": "Kimlik", "de": "Identität", "en": "Identity"},
  "f_id_v": {"tr": "Müslüman, başörtülü", "de": "Muslima, trägt Hijab", "en": "Muslim, wears a hijab"},

  # INTERESTS
  "int_eyebrow": {"tr": "İlgi alanlarım", "de": "Meine Interessen", "en": "My interests"},
  "int_title": {"tr": "Ekranın <em>ötesinde.</em>", "de": "Mehr als <em>Bildschirm.</em>", "en": "Beyond the <em>screen.</em>"},
  "int_text": {
    "tr": "Teknoloji tek ilgi alanım değil. Bu dünyada keşfedilecek, anlaşılacak ve kendi elimizle yaratılacak çok şey var.",
    "de": "Technik ist nicht alles, was mich beschäftigt. Es gibt viel auf dieser Welt, das man entdecken, verstehen oder selbst erschaffen kann.",
    "en": "Technology is not all that occupies me. There is a lot in this world to discover, understand or create yourself.",
  },

  # JOURNEY
  "jr_eyebrow": {"tr": "Web geliştirmeye giden yol", "de": "Mein Weg in die Webentwicklung", "en": "My path into web development"},
  "jr_title": {"tr": "Bir görevden <em>bir tutku.</em>", "de": "Aus einer Aufgabe <em>wurde Leidenschaft.</em>", "en": "From a task <em>to a passion.</em>"},
  "jr_quote": {
    "tr": "“Bir proje hobi oldu, hobi de <em>tutku.</em>”",
    "de": "„Aus einem Projekt wurde ein Hobby, daraus eine <em>Leidenschaft.</em>“",
    "en": "“A project became a hobby, and the hobby became a <em>passion.</em>”",
  },
  "jr_drag": {"tr": "Kaydır →", "de": "Wischen →", "en": "Swipe →"},

  # PROJECTS
  "pr_eyebrow": {"tr": "Projelerim", "de": "Meine Projekte", "en": "My projects"},
  "pr_title": {"tr": "Yaptığım <em>şeyler.</em>", "de": "Was ich <em>gebaut habe.</em>", "en": "Things I've <em>built.</em>"},
  "pr_text": {
    "tr": "Her yeni projeyle koleksiyon büyüyor.",
    "de": "Mit jedem neuen Projekt wächst die Sammlung.",
    "en": "The collection grows with every new project.",
  },
  "p1_meta": {"tr": "Web sitesi · 2026", "de": "Website · 2026", "en": "Website · 2026"},
  "p1_title": {"tr": "Annemin işi için web sitesi", "de": "Website für meine Mutter", "en": "A website for my mother"},
  "p1_text": {
    "tr": "İlk projem: randevu takvimi, danışan portalı, ödeme sayfası, yorumlar ve sohbet asistanı.",
    "de": "Mein erstes Projekt: Terminkalender, Klientenportal, Zahlungsseite, Bewertungen und ein Chat-Assistent.",
    "en": "My first project: appointment calendar, client portal, payment page, reviews and a chat assistant.",
  },
  "p1_link": {"tr": "Siteyi aç", "de": "Website öffnen", "en": "Open website"},
  "p1_alt": {
    "tr": "Derya Kılıç Hipnoz ve Deep EFT web sitesinin ana sayfası",
    "de": "Startseite der Website Derya Kılıç Hypnose & Deep EFT",
    "en": "Home page of the Derya Kılıç hypnosis & Deep EFT website",
  },
  "p2_meta": {"tr": "Uygulama · 2026", "de": "App · 2026", "en": "App · 2026"},
  "p2_title": {"tr": "Lisan", "de": "Lisan", "en": "Lisan"},
  "p2_text": {
    "tr": "Oyun gibi kelime öğrenme uygulaması: kelime öğren, para topla, kendi hayvanını ve odanı süsle. Öğrenme planı, mini oyunlar ve fotoğrafla tarama.",
    "de": "Vokabeln lernen wie im Spiel: Wörter lernen, Münzen sammeln, das eigene Tier und Zimmer gestalten. Mit Lernplan, Minispielen und Foto-Scan.",
    "en": "Learning vocabulary like a game: learn words, collect coins, decorate your own pet and room. With a study plan, mini games and photo scanning.",
  },
  "p2_link": {"tr": "Uygulamayı aç", "de": "App öffnen", "en": "Open app"},
  "p2_alt": {
    "tr": "Lisan uygulamasının giriş ekranı",
    "de": "Anmeldebildschirm der App Lisan",
    "en": "Sign-in screen of the Lisan app",
  },
  "pr_next": {"tr": "Sıradaki proje <em>yolda…</em>", "de": "Das nächste Projekt <em>ist unterwegs…</em>", "en": "The next project <em>is on its way…</em>"},
  "cursor_open": {"tr": "Aç", "de": "Öffnen", "en": "Open"},

  # CLOSE-UP
  "cu_eyebrow": {"tr": "Yakından", "de": "Nahaufnahme", "en": "Close-up"},
  "cu_title": {"tr": "İlk <em>web sitem.</em>", "de": "Meine erste <em>Website.</em>", "en": "My first <em>website.</em>"},
  "cu_text": {
    "tr": "Annemin işi için geliştirdiğim site ilk projemdi. HTML, CSS ve JavaScript ile yazdım; ilk sürümü tamamen sıfırdan oluşturdum. Yandaki demo asistan, o sitedeki sohbet kutusunun mantığını gösteriyor.",
    "de": "Die Website für die Arbeit meiner Mutter war mein erstes Projekt. Ich habe sie mit HTML, CSS und JavaScript geschrieben, die erste Version komplett von Grund auf. Der Demo-Assistent daneben zeigt die Logik des Chats auf dieser Seite.",
    "en": "The website for my mother's work was my first project. I wrote it with HTML, CSS and JavaScript, the first version entirely from scratch. The demo assistant next to it shows the logic of the chat on that site.",
  },
  "st_pages": {"tr": "sayfa", "de": "Seiten", "en": "pages"},
  "st_lines": {"tr": "satır kod", "de": "Zeilen Code", "en": "lines of code"},
  "st_langs": {"tr": "dil: HTML · CSS · JS", "de": "Sprachen: HTML · CSS · JS", "en": "languages: HTML · CSS · JS"},
  "st_site": {"tr": "site dili: TR · DE", "de": "Seitensprachen: TR · DE", "en": "site languages: TR · DE"},
  "features": {
    "tr": ["Online randevu takvimi", "Danışan portalı", "PayPal ödeme", "Yorumlar (Firebase)", "Sohbet asistanı", "Çerez onayı"],
    "de": ["Online-Terminkalender", "Klientenportal", "PayPal-Zahlung", "Bewertungen (Firebase)", "Chat-Assistent", "Cookie-Einwilligung"],
    "en": ["Online appointment calendar", "Client portal", "PayPal payment", "Reviews (Firebase)", "Chat assistant", "Cookie consent"],
  },
  "chat_title": {"tr": "demo-asistan.js", "de": "demo-assistent.js", "en": "demo-assistant.js"},
  "chat_sub": {"tr": "yapay zekâ değil, kurallar", "de": "keine KI, nur Regeln", "en": "not AI, just rules"},
  "chat_ph": {"tr": "Bir şey yaz…", "de": "Schreib etwas…", "en": "Type something…"},
  "chat_send": {"tr": "Gönder", "de": "Senden", "en": "Send"},
  "chat_label": {"tr": "Mesajın", "de": "Deine Nachricht", "en": "Your message"},

  # CONTACT
  "ct_eyebrow": {"tr": "Geri bildirim", "de": "Feedback", "en": "Feedback"},
  "ct_title": {"tr": "Bir fikrin mi var? <em>Yaz bana.</em>", "de": "Eine Idee? <em>Schreib mir.</em>", "en": "Got an idea? <em>Write me.</em>"},
  "ct_text": {
    "tr": "Geri bildirimlerin benim için değerli. Her yorum, kendimi geliştirmeme yardımcı oluyor.",
    "de": "Dein Feedback ist mir wichtig. Jeder Kommentar hilft mir, besser zu werden.",
    "en": "Your feedback means a lot to me. Every comment helps me get better.",
  },
  "ct_btn": {"tr": "Geri bildirim gönder", "de": "Feedback geben", "en": "Send feedback"},
  "ct_mail_subject": {"tr": "Geri bildirim", "de": "Feedback", "en": "Feedback"},

  # FOOTER
  "ft_privacy": {"tr": "Gizlilik", "de": "Datenschutz", "en": "Privacy"},
  "ft_top": {"tr": "Başa dön", "de": "Nach oben", "en": "Back to top"},
  "ft_made": {"tr": "Sıfırdan kodlandı", "de": "Von Grund auf programmiert", "en": "Coded from scratch"},
}

INTERESTS = {
  "tr": [["Teknoloji ve icatlar", "Yazılım, donanım ve robotik: Tasarlanıp denenebilecek her şey ilgimi çekiyor."], ["Okumak ve yazmak", "Çok okurum ve kendi kitaplarımı ile kısa hikâyelerimi yazarım."], ["Doğa ve astronomi", "Doğadan yıldızlı göğe: Dünyanın nasıl işlediğini anlamak istiyorum."], ["Binicilik ve okçuluk", "Açık havada ve hareket halinde ekran başındaki çalışmaya denge buluyorum."], ["Tarih ve siyaset", "Dünyanın nasıl bu hale geldiğini anlamak ve nasıl devam edeceği konusunda söz sahibi olmak istiyorum."], ["Kendi fikirlerim", "Kendi fikirlerimi tutarlı biçimde takip ediyor ve sürekli yeni şeyler öğreniyorum."]],
  "de": [["Technik & Erfindungen", "Software, Hardware und Robotik: Mich interessiert alles, was man konstruieren und testen kann."], ["Lesen & Schreiben", "Ich lese viel und schreibe eigene Bücher und Kurzgeschichten."], ["Natur & Astronomie", "Von der Natur bis zum Sternenhimmel: Ich möchte verstehen, wie die Welt funktioniert."], ["Reiten & Bogenschießen", "Draußen und in Bewegung finde ich den Ausgleich zur Arbeit am Bildschirm."], ["Geschichte & Politik", "Ich will verstehen, wie die Welt geworden ist, und mitreden, wie es weitergeht."], ["Eigene Ideen", "Ich verfolge eigene Ideen konsequent und lerne ständig dazu."]],
  "en": [["Technology & inventions", "Software, hardware and robotics: I am interested in everything you can build and test."], ["Reading & writing", "I read a lot and write my own books and short stories."], ["Nature & astronomy", "From nature to the night sky: I want to understand how the world works."], ["Riding & archery", "Being outside and on the move balances the work at the screen."], ["History & politics", "I want to understand how the world came to be and have a say in what comes next."], ["Original ideas", "I follow my own ideas consistently and keep learning."]],
}

JOURNEY = {
  "tr": [["Başlangıç", "Annemin işi için bir web sitesine ihtiyacı vardı. Siteyi kendim geliştirmeye karar verdim."], ["Gelişim", "Her adımda yeni özellikler eklendi: randevu takvimi, danışan portalı, ödeme sayfası ve yorumlar."], ["Bugün", "Teknoloji ve programlama bugün hayatımın sabit bir parçası. Öğrenmeye devam ediyor ve kendi fikirlerimi hayata geçiriyorum."]],
  "de": [["Anfang", "Meine Mutter brauchte eine Website für ihre Arbeit. Ich habe mich entschieden, sie selbst zu entwickeln."], ["Weiterentwicklung", "Mit jedem Schritt kamen neue Funktionen hinzu: Terminkalender, Klientenportal, Zahlungsseite und Bewertungen."], ["Heute", "Technik und Programmieren sind heute ein fester Teil meines Lebens. Ich lerne weiter und setze eigene Ideen um."]],
  "en": [["Beginning", "My mother needed a website for her work. I decided to build it myself."], ["Growth", "With every step, new features were added: an appointment calendar, a client portal, a payment page and reviews."], ["Today", "Technology and programming are a fixed part of my life today. I keep learning and turn my own ideas into reality."]],
}

MARQUEE = {
  "tr": ["Web geliştirme", "Teknoloji", "Robotik", "Astronomi", "Binicilik", "Okçuluk", "Kitaplar", "Tarih", "Siyaset", "Yaratıcı fikirler"],
  "de": ["Webentwicklung", "Technik", "Robotik", "Astronomie", "Reiten", "Bogenschießen", "Bücher", "Geschichte", "Politik", "Kreative Ideen"],
  "en": ["Web development", "Technology", "Robotics", "Astronomy", "Riding", "Archery", "Books", "History", "Politics", "Creative ideas"],
}

# Datenschutz (Stand an neue Seite angepasst: keine Themen-Wahl mehr, Schriften selbst gehostet)
PRIVACY = {
  "title": {"tr": "Gizlilik", "de": "Datenschutz", "en": "Privacy"},
  "doc_title": {"tr": "Gizlilik politikası", "de": "Datenschutzerklärung", "en": "Privacy policy"},
  "updated": {"tr": "Güncelleme: Kasım 2026", "de": "Stand: November 2026", "en": "Last updated: November 2026"},
  "back": {"tr": "Ana sayfa", "de": "Startseite", "en": "Home"},
  "sections": {
    "tr": [
      ["Sorumlu kişi", '<p>Bu web sitesinden sorumlu kişi: Betül Kılıç. İletişim: <a href="mailto:goldensunderya9@gmail.com">goldensunderya9@gmail.com</a></p>'],
      ["Kısaca", "<ul><li>Çerez (cookie) kullanılmaz.</li><li>Analiz veya izleme araçları (örneğin Google Analytics) kullanılmaz.</li><li>Yazı tipleri, görseller ve tüm kod doğrudan bu sitede bulunur; Google Fonts veya CDN gibi harici hizmetlerden yüklenmez.</li><li>Sitede form yoktur; benim tarafımdan veri toplanmaz.</li></ul>"],
      ["Barındırma (GitHub Pages)", '<p>Bu site GitHub Pages üzerinde barındırılmaktadır. Sağlayıcı: GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, ABD. Siteyi ziyaret ettiğinizde GitHub, teknik olarak gerekli bilgileri (örneğin IP adresi, tarih ve saat, tarayıcı türü, yönlendiren sayfa) sunucu kayıtlarında işleyebilir. Bu, sitenin güvenli ve sorunsuz çalışması için gereklidir (GDPR md. 6 f. 1 lit. f – meşru menfaat). Veriler ABD’ye aktarılabilir. Ayrıntılar için: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub gizlilik bildirimi</a>.</p>'],
      ["E-posta ile iletişim", "<p>“Geri bildirim gönder” düğmesi yalnızca kendi e-posta programınızı açar. Bana e-posta yazarsanız, adresinizi ve mesajınızı yalnızca yanıt vermek için kullanırım (GDPR md. 6 f. 1 lit. f). Veriler artık gerekli olmadığında silinir ve üçüncü kişilerle paylaşılmaz. E-postalar Google (Gmail) üzerinden alınır.</p>"],
      ["Tarayıcıda yerel kayıt", "<p>Seçtiğiniz dil yalnızca kendi tarayıcınızda saklanır (<code>localStorage</code>). Açılış animasyonunun aynı oturumda tekrar uzun gösterilmemesi için tarayıcı oturumunda küçük bir işaret tutulur (<code>sessionStorage</code>). Bu bilgiler bana veya başka birine gönderilmez ve yalnızca istediğiniz işlevi sağlamak için gereklidir. Tarayıcı ayarlarınızdan istediğiniz zaman silebilirsiniz.</p>"],
      ["Demo asistan", "<p>Ana sayfadaki demo asistan tamamen tarayıcınızda çalışır. Yazdıklarınız hiçbir yere gönderilmez ve kaydedilmez.</p>"],
      ["Harici bağlantılar", "<p>Site, GitHub gibi başka web sitelerine bağlantılar içerir. Bir bağlantıya tıkladığınızda ilgili sitenin gizlilik politikası geçerlidir.</p>"],
      ["Haklarınız", "<p>GDPR kapsamında bilgi alma, düzeltme, silme, işlemeyi kısıtlama, veri taşınabilirliği ve itiraz haklarına sahipsiniz (md. 15–21). Bunun için bana yukarıdaki e-posta adresinden ulaşabilirsiniz. Ayrıca bir veri koruma denetim makamına şikâyette bulunma hakkınız vardır.</p>"],
    ],
    "de": [
      ["Verantwortliche", '<p>Verantwortlich für diese Website ist Betül Kılıç. Kontakt: <a href="mailto:goldensunderya9@gmail.com">goldensunderya9@gmail.com</a></p>'],
      ["Das Wichtigste in Kürze", "<ul><li>Es werden keine Cookies gesetzt.</li><li>Es gibt keine Analyse- oder Tracking-Werkzeuge (zum Beispiel kein Google Analytics).</li><li>Schriften, Bilder und der gesamte Code liegen direkt auf dieser Website und werden nicht von Drittanbietern wie Google Fonts oder einem CDN geladen.</li><li>Es gibt keine Formulare; ich selbst erhebe keine Daten über die Website.</li></ul>"],
      ["Hosting (GitHub Pages)", '<p>Diese Website wird über GitHub Pages bereitgestellt. Anbieter ist die GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der Seite kann GitHub technisch notwendige Daten in Server-Logfiles verarbeiten, zum Beispiel IP-Adresse, Datum und Uhrzeit, Browsertyp und die zuvor besuchte Seite. Das ist für den sicheren und stabilen Betrieb der Website erforderlich (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse). Dabei können Daten in die USA übermittelt werden. Mehr dazu in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von GitHub</a>.</p>'],
      ["Kontakt per E-Mail", "<p>Der Button „Feedback geben“ öffnet nur dein eigenes E-Mail-Programm. Wenn du mir schreibst, verwende ich deine Adresse und Nachricht ausschließlich, um dir zu antworten (Art. 6 Abs. 1 lit. f DSGVO). Die Daten werden gelöscht, sobald sie nicht mehr benötigt werden, und nicht an Dritte weitergegeben. E-Mails werden über Google (Gmail) empfangen.</p>"],
      ["Speicherung im Browser", "<p>Deine Sprachwahl wird nur in deinem eigenen Browser gespeichert (<code>localStorage</code>). Damit die Lade-Animation in derselben Sitzung nicht noch einmal lang läuft, merkt sich der Browser das für die Sitzung (<code>sessionStorage</code>). Diese Informationen werden weder an mich noch an andere übertragen und sind nur für die von dir gewünschte Funktion nötig (§ 25 Abs. 2 TDDDG). Du kannst sie jederzeit über die Browser-Einstellungen löschen.</p>"],
      ["Demo-Assistent", "<p>Der Demo-Assistent auf der Startseite läuft vollständig in deinem Browser. Was du eintippst, wird nirgendwohin gesendet und nicht gespeichert.</p>"],
      ["Externe Links", "<p>Die Website enthält Links zu anderen Seiten, zum Beispiel zu GitHub. Wenn du einen Link anklickst, gilt dort die Datenschutzerklärung des jeweiligen Anbieters.</p>"],
      ["Deine Rechte", "<p>Du hast nach der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Schreib mir dafür einfach an die oben genannte E-Mail-Adresse. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren.</p>"],
    ],
    "en": [
      ["Controller", '<p>The person responsible for this website is Betül Kılıç. Contact: <a href="mailto:goldensunderya9@gmail.com">goldensunderya9@gmail.com</a></p>'],
      ["In short", "<ul><li>No cookies are set.</li><li>No analytics or tracking tools are used (for example, no Google Analytics).</li><li>Fonts, images and all code are hosted on this website and are not loaded from third parties such as Google Fonts or a CDN.</li><li>There are no forms; I do not collect any data through the website myself.</li></ul>"],
      ["Hosting (GitHub Pages)", '<p>This website is hosted on GitHub Pages. The provider is GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. When you visit the site, GitHub may process technically necessary data in server log files, such as your IP address, date and time, browser type and the referring page. This is required for the secure and stable operation of the website (Art. 6(1)(f) GDPR, legitimate interest). Data may be transferred to the USA. For details, see the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub privacy statement</a>.</p>'],
      ["Contact by email", "<p>The “Send feedback” button only opens your own email program. If you write to me, I use your address and message solely to reply (Art. 6(1)(f) GDPR). The data is deleted once it is no longer needed and is not shared with third parties. Emails are received via Google (Gmail).</p>"],
      ["Storage in your browser", "<p>Your language choice is stored only in your own browser (<code>localStorage</code>). So that the loading animation does not run at full length again in the same session, your browser remembers this for the session (<code>sessionStorage</code>). This information is not sent to me or anyone else and is only needed for the function you requested. You can delete it at any time in your browser settings.</p>"],
      ["Demo assistant", "<p>The demo assistant on the home page runs entirely in your browser. What you type is not sent anywhere and is not stored.</p>"],
      ["External links", "<p>The website contains links to other sites, such as GitHub. When you click a link, the privacy policy of that site applies.</p>"],
      ["Your rights", "<p>Under the GDPR, you have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15–21 GDPR). Just write to me at the email address above. You also have the right to lodge a complaint with a data protection supervisory authority.</p>"],
    ],
  },
}


# Projekte (neu): Highlight Kartenatelier + Liste
T.update({
  "k_meta": {"tr": "Web uygulaması", "de": "Web-App", "en": "Web app"},
  "k_text": {
    "tr": "Babam için bir doğum günü kartı tasarlamak istedim ama kolay, ücretsiz ve tam istediğim gibi bir uygulama bulamadım. Ben de kendim yaptım.",
    "de": "Ich wollte eine Geburtstagskarte für meinen Vater gestalten, fand aber keine App, die einfach, kostenlos und so war, wie ich sie wollte. Also habe ich selbst eine gebaut.",
    "en": "I wanted to design a birthday card for my dad, but couldn't find an app that was easy, free and the way I wanted. So I built one myself.",
  },
  "k_link": {"tr": "Atölyeyi aç", "de": "Atelier öffnen", "en": "Open the studio"},
  "k_card": {"tr": "İyi ki doğdun", "de": "Alles Gute", "en": "Happy birthday"},
  "k_card_sub": {"tr": "kendi tasarımın", "de": "selbst gestaltet", "en": "designed by you"},
  "pl_eyebrow": {"tr": "Daha fazlası", "de": "Noch mehr", "en": "More"},
  "st_live": {"tr": "Yayında", "de": "Live", "en": "Live"},
  "st_wip": {"tr": "Yapım aşamasında", "de": "Im Bau", "en": "In progress"},
  "st_private": {"tr": "Özel", "de": "Privat", "en": "Private"},
})

PROJECTS = [
  {"name": "Digital Wardrobe", "status": "live", "tone": "accent",
   "type": {"tr": "Web uygulaması", "de": "Web-App", "en": "Web app"},
   "desc": {
     "tr": "Kıyafetlerini eklersin, uygulama zevkine ve havaya göre kombin önerir. Favori kombinlerini işaretledikçe ya da kendin oluşturup kaydettikçe seni daha iyi tanır.",
     "de": "Du legst deine Klamotten an, und die App schlägt dir Outfits vor, passend zu deinem Geschmack und zum Wetter. Je mehr Lieblingsoutfits du markierst oder selbst erstellst und speicherst, desto besser lernt sie dich kennen.",
     "en": "You add your clothes, and the app suggests outfits based on your taste and the weather. The more favourite outfits you mark or create and save yourself, the better it gets to know you.",
   },
   "links": [
     ({"tr": "Uygulama", "de": "App", "en": "App"}, "https://beki-byte.github.io/digital-wardrobe/"),
     ({"tr": "3D dolap", "de": "3D-Schrank", "en": "3D closet"}, "https://beki-byte.github.io/digital-wardrobe/neu/"),
     ({"tr": "Y2K", "de": "Y2K", "en": "Y2K"}, "https://beki-byte.github.io/digital-wardrobe/y2k/"),
   ]},
  {"name": "The Dinner Society", "status": "wip", "tone": "ink",
   "type": {"tr": "Yapay zekâ uygulaması", "de": "KI-App", "en": "AI app"},
   "desc": {
     "tr": "Yapay zekâyla eksiksiz, her şey dahil bir cinayet gizemi akşam yemeği planlayan uygulama: yazdırılabilir materyaller, menü, kıyafet fikirleri ve daha fazlası.",
     "de": "Eine App, die mit KI ein komplettes All-inclusive-Krimidinner plant: mit Sachen zum Ausdrucken, Menü, Outfit-Ideen und mehr.",
     "en": "An app that uses AI to plan a complete all-inclusive murder mystery dinner: printables, menu, outfit ideas and more.",
   }},
  {"name": "Mochi Town", "status": "wip", "tone": "sky",
   "type": {"tr": "Dijital şehir", "de": "Digitale Stadt", "en": "Digital town"},
   "desc": {
     "tr": "Arkadaşlarınla buluşup birlikte ders çalışabildiğin dijital bir şehir. E-kitap bağlayıcısıyla kendi kitaplarını da orada okuyabilirsin.",
     "de": "Eine digitale Stadt, in der man sich mit Freunden trifft und zusammen lernt. Mit dem E-Book-Connector kann man dort auch seine eigenen Bücher lesen.",
     "en": "A digital town where you meet friends and study together. With the e-book connector, you can also read your own books there.",
   }},
  {"name": "Lisan", "status": "private", "tone": "img", "img": "img/lisan.webp",
   "type": {"tr": "Uygulama", "de": "App", "en": "App"},
   "desc": {
     "tr": "Oyun gibi kelime öğrenme uygulaması: kelime öğren, para topla, kendi hayvanını ve odanı süsle. Öğrenme planı, mini oyunlar ve fotoğrafla tarama.",
     "de": "Vokabeln lernen wie im Spiel: Wörter lernen, Münzen sammeln, das eigene Tier und Zimmer gestalten. Mit Lernplan, Minispielen und Foto-Scan.",
     "en": "Learning vocabulary like a game: learn words, collect coins, decorate your own pet and room. With a study plan, mini games and photo scanning.",
   }},
  {"name": "Niko", "status": "private", "tone": "night",
   "type": {"tr": "Yapay zekâ · yerel", "de": "KI · lokal", "en": "AI · local"},
   "desc": {
     "tr": "Kendine has karakteri olan kişisel yapay zekâ arkadaşım. Tamamen kendi bilgisayarımda çalışıyor; sohbet ve sesli mod var.",
     "de": "Mein persönlicher KI-Begleiter mit eigenem Charakter. Läuft komplett lokal auf meinem Rechner, mit Chat- und Sprachmodus.",
     "en": "My personal AI companion with its own character. Runs entirely on my own computer, with chat and voice mode.",
   }},
]
