# Konzept: „Ein Blatt Papier lernt fliegen“

Ausgangspunkt ist Betüls eigener Satz: *„Warum sollte ein Blatt Papier nicht fliegen oder schwimmen können?“*
Man scrollt vom Tag am Meer (hell, das Foto) in die Nacht (Sterne, Neugier) und wieder in den Morgen (Projekte).

**Stimmung:** neugierig, ruhig, mutig, klar, ein bisschen Poesie.
**Palette:** Nacht `#070d1a` · Meer `#2c5677` · Himmel `#9dbad3` · Papier `#ebe5d9` / Creme `#f1eadc` · Akzent Abendrot `#e0906a`
**Schriften:** Instrument Serif (Display, mit Kursive) + Instrument Sans (Text), beide lokal.

| Sektion | Szene | Antrieb | Baustein | Fallback (low / ohne WebGL) |
|---|---|---|---|---|
| Einstieg | Zähler auf Nachtblau, Vorhang öffnet | Zeit | `runPreloader` | aus |
| Hero | Riesiger Name, Seiden-Shader wie Wasser in Fotofarben | Zeit + Maus | `shader silk`, `revealText chars` | Verlauf/Standbild |
| Frage | Die Papier-Frage färbt sich Wort für Wort ein | Scroll | `scrubHighlight` | sofort sichtbar |
| Flugplan | Gepinnt: Partikel = Blatt → Papierflieger → Sternenhimmel mit Sternbild → `</>` | Scroll | `particle-morph` mit eigenen Formen (`js/shapes.js`) | Bildunterschriften als Liste |
| Über mich | Foto öffnet sich, Code-Lupe verwandelt es in Zeichen | Scroll + Maus/Finger | `revealImages`, `js/lens.js` | Foto |
| Interessen | Nummerierte Riesenliste vor Polarlicht | Scroll | `shader aurora` | Liste |
| Weg | Level 01–03 horizontal + Zitat | Scroll | `horizontalScroll` | wischbar |
| Projekte | Große Bilder, Cursor „Öffnen“ | Scroll + Maus | `revealImages`, `cursor` | Bilder |
| Nahaufnahme | Zahlen zählen hoch, Demo-Chat zum Ausprobieren | Scroll + Klick | `countUp`, `js/chat.js` | Zahlen stehen |
| Kontakt | Höhenlinien bei Nacht, Magnet-Buttons | Scroll + Maus | `shader contour`, `magnetic` | Verlauf |
| Footer | Riesige Wortmarke | Scroll | – | – |

## Funktions-Inventar (aus der alten Seite übernommen)
- Sprachen TR/DE/EN, Wahl in `localStorage` (`bk-lang`), Browsersprache als Vorschlag
- Feedback per `mailto:`, GitHub-Link, Projekt-Links (Derya-Kılıç-Website, Lisan)
- Demo-Assistent mit denselben Regeln wie vorher
- Foto-Lupe („betul.jpg decoded“)
- Datenschutzerklärung in drei Sprachen (an die neue Seite angepasst)

Nicht übernommen: die „klassische“ und die „interaktive“ Version als getrennte Seiten (die neue Seite ersetzt beide),
Farbthemen-Wahl, Papierflieger-Minispiel und Wendekarten. Die Papierflieger-Idee lebt in der Partikel-Szene weiter.
