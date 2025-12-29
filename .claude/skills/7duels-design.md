# 7 Wonders Duel Design System

## Spielübersicht
7 Wonders Duel ist ein Zwei-Spieler-Strategiespiel in einer antiken Welt. Das Spiel umfasst drei Zeitalter, in denen Spieler Gebäude errichten, Weltwunder bauen und um militärische, wissenschaftliche oder politische Überlegenheit kämpfen.

## Visuelle Identität

### Farbpalette

#### Basis-Thema (Antik-Dunkel)
| Name | Hex | Verwendung |
|------|-----|------------|
| Background | `#1a1510` | Haupt-Hintergrund |
| Background Light | `#252017` | Erhöhte Elemente |
| Background Card | `#1f1a14` | Karten-Hintergrund |
| Foreground | `#e8dcc8` | Haupt-Text |
| Foreground Muted | `#9a8b75` | Gedämpfter Text |

#### Pergament-Palette (aus den Spielregeln-PDFs)
| Name | Hex | Verwendung |
|------|-----|------------|
| Parchment | `#e8d5b5` | Pergament-Effekte |
| Parchment Dark | `#d4c4a8` | Dunkleres Pergament |
| Parchment Light | `#f5e8d0` | Helleres Pergament |
| Sand | `#c4a77d` | Sand-Akzente |

#### Metallische Akzente (Münzen & Rahmen)
| Name | Hex | Verwendung |
|------|-----|------------|
| Gold | `#d4a853` | Haupt-Akzentfarbe |
| Gold Light | `#e6c068` | Hover-Zustände |
| Gold Dark | `#a67c3d` | Schatten |
| Bronze | `#b87333` | Sekundäre Akzente |
| Bronze Dark | `#8b5a2b` | Bronze Schatten |
| Copper | `#c47f45` | Kupfer-Details |
| Silver | `#a8a8a8` | 2. Platz Rangliste |

#### Spielplan-Farben (Militär-Track)
| Name | Hex | Verwendung |
|------|-----|------------|
| Teal | `#3a8a8c` | Primäre Aktionsfarbe |
| Teal Dark | `#0d7377` | Buttons, aktive Zustände |
| Teal Light | `#4db6ac` | Hover |
| Board Red | `#8b2020` | Militär-Bereich |
| Board Green | `#2d5a3d` | Positiver Bereich |

### Kartentyp-Farben (Original aus Spielregeln Seite 5)

Diese Farben sind **essentiell** für die App, da sie die 7 Gebäudetypen repräsentieren:

| Typ | Deutsch | Farbe | Hex | Verwendung |
|-----|---------|-------|-----|------------|
| Brown | Rohstoffe | Braun | `#8b5a2b` | Holz, Stein, Lehm |
| Gray | Manufakturprodukte | Grau | `#6b7280` | Glas, Papyrus |
| Blue | Profangebäude | Blau | `#2563eb` | Siegpunkte |
| Green | Forschungsgebäude | Grün | `#16a34a` | Wissenschaft |
| Yellow | Handelsgebäude | Gelb | `#ca8a04` | Münzen, Handel |
| Red | Militärische Gebäude | Rot | `#dc2626` | Schilde |
| Purple | Gilden | Violett | `#7c3aed` | Spezielle Gebäude |

### Siegbedingungen mit Farben

| Bedingung | Farbe | Badge-Klasse |
|-----------|-------|--------------|
| Punkte (Ziviler Sieg) | Gold-Bronze Gradient | `win-badge-points` |
| Militär (Militärische Überlegenheit) | Rot | `win-badge-military` |
| Forschung (Wissenschaftliche Überlegenheit) | Grün | `win-badge-science` |
| Senat (Politische Überlegenheit - Agora) | Violett | `win-badge-senate` |
| Seemacht (Naval - Custom) | Teal | `win-badge-naval` |

## Typografie

### Schriftarten
- **Überschriften**: Georgia, serif - gibt antikes Flair
- **Fließtext**: Georgia, 'Times New Roman', serif
- **UI-Elemente**: Geist Sans (Variable Font)

### Textklassen
```css
.page-title     /* Seitentitel, Gold, 2rem */
.section-title  /* Abschnittstitel, Gold, weight 600 */
.text-gold      /* Goldener Text */
.text-bronze    /* Bronzener Text */
.text-muted     /* Gedämpfter Text */
```

## UI-Komponenten

### Karten
```css
.antique-card   /* Haupt-Karte mit Pergament-Gradient und Gold-Border */
.simple-card    /* Einfache Karte ohne Top-Border */
.game-card      /* Spielkarte mit Hover-Effekt */
```

### Buttons
```css
.btn-primary    /* Teal-Gradient Button */
.btn-gold       /* Gold-Bronze Gradient Button */
```

### Navigation
```css
.nav-bar        /* Sticky Navigation */
.nav-logo       /* Logo mit Gold-Gradient */
.nav-item       /* Nav-Link */
.nav-item-active/* Aktiver Nav-Link */
```

## Dekorative Elemente

### Goldene Akzente
- Top-Border auf `.antique-card` mit Gold-Gradient
- Goldene Divider-Linien
- Griechisches Mäander-Muster (`.greek-border-bottom`)

### Animations
```css
@keyframes glow   /* Leucht-Animation für wichtige Elemente */
@keyframes fadeIn /* Sanftes Einblenden */
```

## Bilder & Assets

### Empfohlene Bildquellen
Da wir keine offiziellen Assets verwenden dürfen, empfehle ich:

1. **Antike Texturen** - Für Hintergründe
   - Pergament-Texturen (Public Domain)
   - Marmor-Texturen
   - Stein-Texturen

2. **Icons** - Für Ressourcen & Aktionen
   - Heroicons (MIT License)
   - Lucide Icons (ISC License)
   - Custom SVG Icons im antiken Stil

3. **Illustrationen**
   - Antike Säulen
   - Weltwunder-Silhouetten
   - Münzen & Schilde

### Icon-Empfehlungen für Spielelemente

| Element | Icon-Idee |
|---------|-----------|
| Holz | Baumstamm/Log |
| Stein | Steinquader |
| Lehm | Ziegel |
| Glas | Glasfläschchen |
| Papyrus | Schriftrolle |
| Münzen | Antike Münze |
| Schild | Runder Schild |
| Wissenschaft | Waage/Kompass |
| Siegpunkte | Lorbeerkranz |

## Mythologien (für Pantheon-Erweiterung)

| Mythologie | Fokus | Farbton |
|------------|-------|---------|
| Griechisch | Profanes | Türkis/Grün |
| Phönizisch | Handel | Gelb |
| Mesopotamisch | Forschung | Grün |
| Ägyptisch | Weltwunder | Orange/Gold |
| Römisch | Militär | Rot |

## Design-Prinzipien

1. **Antike Atmosphäre** - Warme, goldene Töne dominieren
2. **Lesbarkeit** - Heller Text auf dunklem Grund
3. **Konsistenz** - Kartenfarben immer gleich verwenden
4. **Subtile Animationen** - Glow-Effekte für wichtige Elemente
5. **Mobile-First** - Responsive Design

## CSS Custom Properties (vollständig)

```css
:root {
  /* Base Theme */
  --background: #1a1510;
  --background-light: #252017;
  --background-card: #1f1a14;
  --foreground: #e8dcc8;
  --foreground-muted: #9a8b75;

  /* Parchment */
  --parchment: #e8d5b5;
  --parchment-dark: #d4c4a8;
  --parchment-light: #f5e8d0;
  --sand: #c4a77d;

  /* Metallic */
  --gold: #d4a853;
  --gold-light: #e6c068;
  --gold-dark: #a67c3d;
  --bronze: #b87333;
  --bronze-dark: #8b5a2b;
  --copper: #c47f45;
  --silver: #a8a8a8;

  /* Board Colors */
  --teal: #3a8a8c;
  --teal-dark: #0d7377;
  --teal-light: #4db6ac;
  --board-red: #8b2020;
  --board-green: #2d5a3d;

  /* Card Type Colors */
  --card-brown: #8b5a2b;
  --card-gray: #6b7280;
  --card-blue: #2563eb;
  --card-green: #16a34a;
  --card-yellow: #ca8a04;
  --card-red: #dc2626;
  --card-purple: #7c3aed;

  /* Semantic */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

## Verwendungsbeispiele

### Siegbedingung anzeigen
```tsx
<span className={`win-badge win-badge-${winType}`}>
  {winConditionName}
</span>
```

### Punktekategorie mit Farbe
```tsx
<div className="score-category">
  <div
    className="category-dot"
    style={{ backgroundColor: 'var(--card-blue)' }}
  />
  <span>Profangebäude</span>
</div>
```

### Antike Karte
```tsx
<div className="antique-card p-6">
  <h2 className="section-title">Titel</h2>
  <p>Inhalt...</p>
</div>
```
