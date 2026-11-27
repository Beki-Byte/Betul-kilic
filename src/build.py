#!/usr/bin/env python3
"""Erzeugt die statischen Seiten aus src/content.py.

    python3 src/build.py

Ausgabe (im Repo-Hauptordner):
    index.html, de.html, en.html                      Startseite TR / DE / EN
    datenschutz.html, datenschutz-de.html, datenschutz-en.html
"""
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from content import LANGS, T, INTERESTS, JOURNEY, MARQUEE, PRIVACY  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = {"tr": "index.html", "de": "de.html", "en": "en.html"}
PRIV = {"tr": "datenschutz.html", "de": "datenschutz-de.html", "en": "datenschutz-en.html"}
MAIL = "goldensunderya9@gmail.com"
GITHUB = "https://github.com/Beki-Byte"
URL_DERYA = "https://beki-byte.github.io/Derya-Kilic-Hipnoz-ve-Deep-EFT-Merkezi-/"
URL_LISAN = "https://lisan.goldensunderya.workers.dev/"

# Weiterleitung nur auf den TR-Seiten (Standard-Adresse): gespeicherte Sprache oder Browsersprache.
REDIRECT = """<script>(function(){var P=%s,s=null;if(/[?&]lang=/.test(location.search))return;
try{s=localStorage.getItem('bk-lang')}catch(e){}
if(!s){var n=(navigator.language||'').slice(0,2).toLowerCase();if(n==='de'||n==='en')s=n;}
if(s&&s!=='tr'&&P[s])location.replace(P[s]+location.search+location.hash);})();</script>"""

IMPORTMAP = """<script type="importmap">
{ "imports": {
  "three": "./vendor/three/three.module.min.js",
  "three/addons/": "./vendor/three/addons/",
  "gsap": "./vendor/gsap/index.js",
  "gsap/": "./vendor/gsap/",
  "lenis": "./vendor/lenis/lenis.mjs"
} }
</script>"""


def t(key, lang):
    return T[key][lang]


def strip(s):
    return re.sub(r"<[^>]+>", "", s)


def lang_switch(lang, pages):
    out = []
    for l in LANGS:
        cur = ' aria-current="true"' if l == lang else ""
        out.append(f'<a href="{pages[l]}" hreflang="{l}" lang="{l}" data-lang="{l}"{cur}>{l.upper()}</a>')
    return f'<nav class="langs" aria-label="{t("lang_label", lang)}">' + "".join(out) + "</nav>"


def alternates(pages):
    return "\n  ".join(f'<link rel="alternate" hreflang="{l}" href="{pages[l]}">' for l in LANGS)


def head(lang, title, desc, pages, extra=""):
    redirect = (REDIRECT % ("{" + ",".join(f"{l}:'{pages[l]}'" for l in LANGS) + "}")) if lang == "tr" else ""
    return f"""<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <meta name="theme-color" content="#070d1a">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:image" content="img/og.jpg">
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  {alternates(pages)}
  {redirect}
  <link rel="preload" href="fonts/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/instrument-serif-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="fx/fx.css">
  <link rel="stylesheet" href="style.css">
  {extra}
</head>"""


def index(lang):
    L = lambda k: t(k, lang)  # noqa: E731
    marq = "".join(f"<span>{html.escape(w)}</span><i>✦</i>" for w in MARQUEE[lang])
    interests = "".join(
        f"""
        <li class="int__row" data-reveal-row>
          <span class="int__no">0{i + 1}</span>
          <h3 class="int__name">{html.escape(n)}</h3>
          <p class="int__desc">{html.escape(d)}</p>
        </li>""" for i, (n, d) in enumerate(INTERESTS[lang]))
    journey = "".join(
        f"""
          <article class="jr__panel">
            <p class="jr__level">Level 0{i + 1} <span>/ 03</span></p>
            <p class="jr__num" aria-hidden="true">0{i + 1}</p>
            <h3 class="jr__name">{html.escape(n)}</h3>
            <p class="jr__text">{html.escape(d)}</p>
          </article>""" for i, (n, d) in enumerate(JOURNEY[lang]))
    stories = "".join(f'<li><span>0{i}</span>{L("story_" + str(i))}</li>' for i in range(1, 5))
    feats = "".join(f"<li>{html.escape(f)}</li>" for f in T["features"][lang])
    subject = L("ct_mail_subject")
    mailto = f"mailto:{MAIL}?subject={subject.replace(' ', '%20')}"

    body = f"""
<body>
  <a class="skip" href="#main">{L("skip")}</a>

  <header class="nav">
    <a class="nav__logo" href="#top" data-magnetic="0.25" aria-label="Betül Kılıç">B<em>.</em>K</a>
    <nav class="nav__links" aria-label="Navigation">
      <a href="#about">{L("nav_about")}</a><a href="#interests">{L("nav_interests")}</a><a href="#journey">{L("nav_journey")}</a><a href="#projects">{L("nav_projects")}</a>
    </nav>
    <div class="nav__end">
      {lang_switch(lang, HOME)}
      <a class="nav__cta" href="#contact" data-magnetic="0.3">{L("nav_contact")}</a>
    </div>
  </header>

  <main id="main">
    <!-- 1 · HERO: Tag am Meer. Seiden-Shader in den Farben des Fotos, riesiger Name -->
    <section class="hero" id="top" data-theme-bg="#ebe5d9" data-theme-fg="#0c1a2e">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="hero__top"><span>{L("hero_meta_l")}</span><span class="hero__horizon" aria-hidden="true"></span><span>{L("hero_meta_r")}</span></div>
      <h1 class="hero__title" aria-label="Betül Kılıç">
        <span class="hero__line">Betül</span>
        <span class="hero__line hero__line--it">Kılıç</span>
      </h1>
      <div class="hero__foot">
        <p class="hero__lead">{L("hero_lead")}</p>
        <p class="hero__tag">{L("hero_tag")}</p>
        <a class="hero__scroll" href="#manifest"><span>{L("hero_scroll")}</span><i aria-hidden="true"></i></a>
      </div>
    </section>

    <div class="marquee fx-marquee" aria-hidden="true"><div>{marq}</div></div>

    <!-- 2 · MANIFEST: die Frage, die alles startet -->
    <section class="manifest" id="manifest" data-theme-bg="#ebe5d9" data-theme-fg="#0c1a2e">
      <p class="eyebrow">{L("manifest_eyebrow")}</p>
      <p class="manifest__q">{L("manifest_q")}</p>
      <p class="manifest__text" data-reveal>{L("manifest_text")}</p>
    </section>

    <!-- 3 · STORY: Papier -> Flieger -> Sterne -> Code (gepinnt, Partikel) -->
    <section class="story" id="flight" data-theme-bg="#070d1a" data-theme-fg="#f1eadc">
      <div class="story__stage">
        <div class="story__sky" aria-hidden="true"></div>
        <div class="story__particles" aria-hidden="true"></div>
        <div class="story__hud" aria-hidden="true">
          <span>{L("story_eyebrow")}</span>
          <span class="story__count"><b>01</b> / 04</span>
        </div>
        <ol class="story__captions">{stories}</ol>
        <div class="story__bar" aria-hidden="true"><i></i></div>
      </div>
    </section>

    <!-- 4 · ÜBER MICH: Foto mit Code-Lupe -->
    <section class="about" id="about" data-theme-bg="#070d1a" data-theme-fg="#f1eadc">
      <div class="about__media">
        <div class="lens" data-cursor="{L("lens_cursor")}">
          <figure class="about__photo" data-img-reveal="up">
            <img src="img/betul-meer.webp" width="840" height="1120" alt="{html.escape(L("photo_alt"))}">
          </figure>
          <canvas class="lens__canvas" aria-hidden="true"></canvas>
          <span class="lens__tag" aria-hidden="true">betul.jpg <b>decoded</b></span>
        </div>
        <p class="about__hint"><span class="hint--fine">{L("lens_hint")}</span><span class="hint--touch">{L("lens_hint_touch")}</span></p>
      </div>
      <div class="about__body">
        <p class="eyebrow">{L("about_eyebrow")}</p>
        <h2 class="h2" data-reveal>{L("about_title")}</h2>
        <p class="about__text">{L("about_text")}</p>
        <dl class="facts">
          <div><dt>{L("f_name")}</dt><dd>Betül Erva Kılıç</dd></div>
          <div><dt>{L("f_age")}</dt><dd>15</dd></div>
          <div><dt>{L("f_int")}</dt><dd>{L("f_int_v")}</dd></div>
          <div><dt>{L("f_free")}</dt><dd>{L("f_free_v")}</dd></div>
          <div><dt>{L("f_id")}</dt><dd>{L("f_id_v")}</dd></div>
        </dl>
      </div>
    </section>

    <!-- 5 · INTERESSEN: Nachthimmel, nummerierte Riesenliste -->
    <section class="interests" id="interests" data-theme-bg="#070d1a" data-theme-fg="#f1eadc">
      <div class="interests__bg" aria-hidden="true"></div>
      <header class="sec-head">
        <p class="eyebrow">{L("int_eyebrow")}</p>
        <h2 class="h2" data-reveal>{L("int_title")}</h2>
        <p class="sec-head__text" data-reveal>{L("int_text")}</p>
      </header>
      <ol class="int">{interests}
      </ol>
    </section>

    <!-- 6 · WEG: Morgen. Horizontal gepinnt -->
    <section class="journey" id="journey" data-theme-bg="#ebe5d9" data-theme-fg="#0c1a2e">
      <header class="sec-head sec-head--row">
        <div><p class="eyebrow">{L("jr_eyebrow")}</p>
        <h2 class="h2" data-reveal>{L("jr_title")}</h2></div>
        <p class="jr__drag" aria-hidden="true">{L("jr_drag")}</p>
      </header>
      <div class="jr__track">{journey}
          <article class="jr__panel jr__panel--quote">
            <p class="jr__quote">{L("jr_quote")}</p>
          </article>
      </div>
      <div class="jr__line" aria-hidden="true"><i></i></div>
    </section>

    <!-- 7 · PROJEKTE -->
    <section class="projects" id="projects" data-theme-bg="#ebe5d9" data-theme-fg="#0c1a2e">
      <header class="sec-head">
        <p class="eyebrow">{L("pr_eyebrow")}</p>
        <h2 class="h2 h2--xl" data-reveal>{L("pr_title")}</h2>
        <p class="sec-head__text" data-reveal>{L("pr_text")}</p>
      </header>

      <article class="proj">
        <a class="proj__img" href="{URL_DERYA}" target="_blank" rel="noopener noreferrer" data-cursor="{L("cursor_open")}" tabindex="-1" aria-hidden="true">
          <figure data-img-reveal="left"><img src="img/derya.webp" width="1000" height="514" alt="" loading="lazy"></figure>
        </a>
        <div class="proj__body">
          <p class="proj__meta"><span>01</span>{L("p1_meta")}</p>
          <h3 class="proj__title">{L("p1_title")}</h3>
          <p class="proj__text">{L("p1_text")}</p>
          <a class="link" href="{URL_DERYA}" target="_blank" rel="noopener noreferrer">{L("p1_link")} <i aria-hidden="true">↗</i></a>
        </div>
      </article>

      <article class="proj proj--flip">
        <a class="proj__img" href="{URL_LISAN}" target="_blank" rel="noopener noreferrer" data-cursor="{L("cursor_open")}" tabindex="-1" aria-hidden="true">
          <figure data-img-reveal="up"><img src="img/lisan.webp" width="800" height="500" alt="" loading="lazy"></figure>
        </a>
        <div class="proj__body">
          <p class="proj__meta"><span>02</span>{L("p2_meta")}</p>
          <h3 class="proj__title proj__title--big">{L("p2_title")}</h3>
          <p class="proj__text">{L("p2_text")}</p>
          <a class="link" href="{URL_LISAN}" target="_blank" rel="noopener noreferrer">{L("p2_link")} <i aria-hidden="true">↗</i></a>
        </div>
      </article>

      <p class="proj__next"><span>03</span><b>{L("pr_next")}</b></p>
    </section>

    <!-- 8 · NAHAUFNAHME: Zahlen + Demo-Chat -->
    <section class="closeup" data-theme-bg="#ebe5d9" data-theme-fg="#0c1a2e">
      <div class="closeup__text">
        <p class="eyebrow">{L("cu_eyebrow")}</p>
        <h2 class="h2" data-reveal>{L("cu_title")}</h2>
        <p class="closeup__p" data-reveal>{L("cu_text")}</p>
        <div class="stats">
          <div><strong data-count="9">9</strong><span>{L("st_pages")}</span></div>
          <div><strong data-count="4200" data-suffix="+">4200+</strong><span>{L("st_lines")}</span></div>
          <div><strong data-count="3">3</strong><span>{L("st_langs")}</span></div>
          <div><strong data-count="2">2</strong><span>{L("st_site")}</span></div>
        </div>
        <ul class="feats">{feats}</ul>
      </div>
      <div class="chat" data-cursor="-">
        <div class="chat__head"><b>{L("chat_title")}</b><span>{L("chat_sub")}</span><i aria-hidden="true"></i></div>
        <div class="chat__msgs" role="log" aria-live="polite" data-lenis-prevent></div>
        <div class="chat__chips"></div>
        <form class="chat__form" autocomplete="off">
          <label class="sr" for="chat-in">{L("chat_label")}</label>
          <input id="chat-in" type="text" placeholder="{L("chat_ph")}" maxlength="120">
          <button type="submit">{L("chat_send")}</button>
        </form>
      </div>
    </section>

    <!-- 9 · KONTAKT: Nacht, Höhenlinien, Magnet-Button -->
    <section class="contact" id="contact" data-theme-bg="#070d1a" data-theme-fg="#f1eadc">
      <div class="contact__bg" aria-hidden="true"></div>
      <p class="eyebrow">{L("ct_eyebrow")}</p>
      <h2 class="contact__title" data-reveal>{L("ct_title")}</h2>
      <p class="contact__text" data-reveal>{L("ct_text")}</p>
      <div class="contact__actions">
        <a class="btn" href="{mailto}" data-magnetic="0.4"><span data-magnetic-inner>{L("ct_btn")} <i aria-hidden="true">→</i></span></a>
        <a class="btn btn--ghost" href="{GITHUB}" target="_blank" rel="noopener noreferrer" data-magnetic="0.3"><span data-magnetic-inner>GitHub <i aria-hidden="true">↗</i></span></a>
      </div>
    </section>
  </main>

  <footer class="footer" data-theme-bg="#070d1a" data-theme-fg="#f1eadc">
    <p class="footer__giant" aria-hidden="true">Betül <em>Kılıç</em></p>
    <div class="footer__row">
      <span>© 2026 Betül Kılıç · {L("ft_made")}</span>
      <a href="{PRIV[lang]}">{L("ft_privacy")}</a>
      <a href="{GITHUB}" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="#top">{L("ft_top")} ↑</a>
      {lang_switch(lang, HOME)}
    </div>
  </footer>
</body>
</html>
"""
    extra = IMPORTMAP + '\n  <script type="module" src="main.js"></script>'
    return head(lang, L("title"), strip(L("description")), HOME, extra) + body


def privacy(lang):
    P = PRIVACY
    secs = "".join(
        f"""
      <section class="priv__sec">
        <h2><span>0{i + 1}</span>{html.escape(h)}</h2>
        <div class="priv__body">{b}</div>
      </section>""" for i, (h, b) in enumerate(P["sections"][lang]))
    title = f'{P["title"][lang]} · Betül Kılıç'
    body = f"""
<body class="priv">
  <a class="skip" href="#main">{t("skip", lang)}</a>
  <header class="nav nav--static">
    <a class="nav__logo" href="{HOME[lang]}" aria-label="Betül Kılıç">B<em>.</em>K</a>
    <div class="nav__end">
      {lang_switch(lang, PRIV)}
      <a class="nav__cta" href="{HOME[lang]}">← {P["back"][lang]}</a>
    </div>
  </header>
  <main id="main" class="priv__main">
    <p class="eyebrow">{P["updated"][lang]}</p>
    <h1 class="priv__title">{P["doc_title"][lang]}</h1>
    {secs}
  </main>
  <footer class="footer footer--small">
    <p class="footer__giant" aria-hidden="true">Betül <em>Kılıç</em></p>
    <div class="footer__row"><span>© 2026 Betül Kılıç</span><a href="{HOME[lang]}">{P["back"][lang]}</a></div>
  </footer>
  <script src="lang.js"></script>
</body>
</html>
"""
    return head(lang, title, title, PRIV) + body


def main():
    for lang in LANGS:
        for name, fn in ((HOME[lang], index), (PRIV[lang], privacy)):
            with open(os.path.join(ROOT, name), "w", encoding="utf-8") as f:
                f.write(fn(lang))
            print("wrote", name)


if __name__ == "__main__":
    main()
