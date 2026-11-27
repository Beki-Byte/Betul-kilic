# Betül Kılıç · Portfolio

Persönliche Website von Betül Kılıç (15), Webentwicklerin.
**Idee:** „Ein Blatt Papier lernt fliegen“. Man scrollt vom Tag am Meer in den Sternenhimmel, wo ein Blatt zum Papierflieger, zu Sternen und schließlich zu Code wird. Details in [`CONCEPT.md`](CONCEPT.md).

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` / `de.html` / `en.html` | Startseite TR / DE / EN |
| `datenschutz.html` / `datenschutz-de.html` / `datenschutz-en.html` | Datenschutz TR / DE / EN |

## Texte ändern
Alle Texte stehen in `src/content.py`. Danach die Seiten neu erzeugen:
```bash
python3 src/build.py
```

## Lokal ansehen
```bash
python3 -m http.server 8080
# http://localhost:8080/   (?tier=low zeigt die Version für „Bewegung reduzieren“)
```

## Technik
Statische Seite ohne Build-Schritt. three.js 0.170, GSAP 3.13 und Lenis 1.3 liegen in `vendor/`,
die Effekt-Bausteine in `fx/`, eigene Module in `js/` (Papierflieger-Formen, Code-Lupe, Demo-Chat).
Schriften (Instrument Serif, Instrument Sans, SIL Open Font License) liegen in `fonts/`. Keine Cookies, kein Tracking, keine externen Anfragen.

## Veröffentlichen
GitHub → Settings → Pages → Source: „Deploy from a branch“, Branch wählen, Ordner `/ (root)`.
