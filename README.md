# The Thermostat Challenge

A mobile-first educational simulation game built for Smoothie King store managers. Players navigate 10 rounds of real workplace scenarios, making leadership decisions that affect the emotional energy of their team. The core insight: a great manager doesn't just read the room — they set it.

---

## The Concept

The game is grounded in a single metaphor:

> A thermometer reads the temperature. A thermostat sets it.

Store energy is tracked on a scale from **−5 (Deepfreeze)** to **+5 (Meltdown)**, with 0 being balanced. Each round presents either an environment card (something outside the manager's control) or a scenario card (a moment where their response shapes what happens next). The goal is to finish all 10 rounds without the gauge reaching either extreme.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS 3 + inline CSS-in-JS |
| Confetti | canvas-confetti |
| Fonts | Playfair Display (headings), DM Sans (body) |
| Build target | Mobile browser (480px max-width, 100dvh) |

---

## Project Structure

```
src/
├── App.jsx                      # Root — screen routing and modal orchestration
├── main.jsx                     # React entry point
├── data/
│   └── cards.js                 # Full card deck (12 environment + 12 choice cards)
├── hooks/
│   └── useGameState.js          # All game logic, state machine, scoring
└── components/
    ├── WelcomeScreen.jsx         # 5-step intro flow shell
    ├── GameScreen.jsx            # Active gameplay layout
    ├── intro/
    │   ├── LandingStep.jsx       # Step 0: opening value statement
    │   ├── MetaphorStep.jsx      # Step 1: thermostat metaphor + live gauge demo
    │   ├── ChoiceDemoStep.jsx    # Step 2: interactive choice card walkthrough
    │   ├── EnvDemoStep.jsx       # Step 3: two environment card demos
    │   ├── RulesStep.jsx         # Step 4: goal and rules summary
    │   └── DemoFeedbackModal.jsx # Overlay feedback modal used in demo steps
    ├── cards/
    │   ├── CardShell.jsx         # Shared card template (layout, border, shadow)
    │   ├── ChoiceCard.jsx        # Interactive card with 3D flip reveal
    │   └── EnvironmentCard.jsx   # Static display card with color-coded impact
    ├── gauge/
    │   ├── GaugeArc.jsx          # SVG semicircle gauge with animated needle
    │   └── GaugeBar.jsx          # Horizontal segment bar (alternate view)
    ├── history/
    │   └── HistoryStack.jsx      # Fanned card stack + full-screen carousel
    ├── modals/
    │   ├── WinModal.jsx          # Win screen with confetti, score, count-up
    │   └── LoseModal.jsx         # Lose screen (bottom sheet)
    └── ui/
        ├── ActionFooter.jsx      # Fixed bottom button (Confirm / Understood)
        ├── GaugeToggle.jsx       # Arc/Bar view switcher pill
        ├── AutoplayButton.jsx    # Autoplay toggle
        └── Pill.jsx              # Reusable impact badge
```

---

## Game State Machine

All game logic lives in `useGameState.js`. There are no external state libraries — state is managed with `useState` and `useCallback`.

### Screens

```
welcome  →  game  →  win
                 ↘  lose
```

- **welcome**: The 5-step intro flow
- **game**: Active play (10 rounds)
- **win**: Player survived all 10 rounds
- **lose**: Energy reached ±5 at any point

### Card Phases (within `game` screen)

```
reading  →  revealed  →  animating  →  (next card / reading)
```

| Phase | Description |
|---|---|
| `reading` | Card is visible and interactive |
| `revealed` | Choice card has flipped; feedback is showing |
| `animating` | Locked — gauge is animating, card is exiting (650ms) |

The `animating` phase prevents double-taps and input during transitions. The atomic state update (card swap + history push) fires at the end of the 650ms timeout, ensuring the card visually "becomes" the top of the history stack rather than disappearing independently.

---

## Card Data

Cards are defined in `src/data/cards.js` as a flat array. There are 24 total (12 environment, 12 choice), and 10 are drawn per game.

### Environment Card

```js
{
  id: "env-001",
  type: "environment",
  title: "Drive Thru Backup",
  description: "Visible pressure as the line of cars snakes around the store.",
  energyImpact: +2,   // positive = meltdown direction, negative = deepfreeze
  impactLabel: "Store Energy +2",
}
```

### Choice Card

```js
{
  id: "cho-001",
  type: "choice",
  title: "Venting Team Member",
  description: "A team member pulls you aside mid-rush to complain about a coworker.",
  options: [
    {
      id: "A",
      text: "This isn't the right time.",
      energyImpact: -1,
      educationalMessage: "They go quiet. The tension hardens for the rest of the shift.",
    },
    {
      id: "B",
      text: "I hear you. Give me 5 minutes.",
      energyImpact: "balance",
      educationalMessage: "You hold the boundary without dismissing them. They feel seen.",
    },
  ],
}
```

The special value `"balance"` resolves dynamically at play time:
- `+1` if current energy is negative (pulls toward 0)
- `-1` if current energy is positive (pulls toward 0)
- `0` if already at 0

### History Entry

When a round completes, the card is pushed to the history array with extra metadata:

```js
{
  ...card,
  roundNumber: 1–10,
  appliedEnergy: -5 to +5,
  energyDelta: the actual change applied,
  chosenOptionId: "A" | "B" | null,
}
```

---

## Deck Building

`buildDeck()` in `useGameState.js`:

1. Shuffles environment and choice cards separately
2. Places a **choice card first** by design — gives the player immediate agency before any uncontrollable event
3. Shuffles the remaining 5 choice + 4 environment cards into positions 1–9
4. Scans for consecutive environment cards and swaps in a choice card to break them up

This guarantees every game starts with player agency and never punishes players with two uncontrollable events back-to-back.

---

## Scoring System

Scoring applies to **choice cards only**. Environment cards are outside the player's control and do not affect the score.

### Base points (0–2 per choice)

Compares what actually happened to what would have happened with the other option:

| Outcome | Points |
|---|---|
| Chosen option moved energy closer to 0 than the alternative | 2 |
| Both options were equally close to 0 (tie) | 1 |
| Chosen option moved energy further from 0 | 0 |

### Timing bonus (true bonus, not included in possible)

Rewards decisive leadership under pressure:

| Decision time | Bonus |
|---|---|
| Under 6 seconds | +1 |
| 6 seconds or more | +0 |

### Final Score

```
score % = (total points earned ÷ total base points possible) × 100
```

`total base points possible = choice card count × 2`

The timing bonus is earned on top of this — fast, accurate decisions can push the score above 100%. The denominator only reflects base points so the bonus remains a genuine reward rather than a ceiling adjustment.

### Score Tiers

| Score | Tier |
|---|---|
| 90–100 | You owned the room! |
| 70–89 | Locked in and leading! |
| 50–69 | Building real momentum! |
| 0–49 | Every rep makes you sharper! |

---

## Intro Flow

The intro is a 5-step sequence managed by `WelcomeScreen.jsx`. Steps 2 and 3 are "self-navigating" — they manage their own Next button inside the component and call `onNext()` when the player completes the interaction.

| Step | Component | Description |
|---|---|---|
| 0 | `LandingStep` | Brand logo, headline, value statement |
| 1 | `MetaphorStep` | Live oscillating gauge, card type legend, "Why does this matter?" accordion |
| 2 | `ChoiceDemoStep` | Player makes a real choice on a demo card; gauge updates |
| 3 | `EnvDemoStep` | Two environment cards shown sequentially (deepfreeze then meltdown) |
| 4 | `RulesStep` | Goal statement and three numbered rules |

The demo steps pass `demoEnergy` upward so the environment demo inherits the energy state from the choice demo, giving the player a continuous, coherent gauge experience through the intro.

---

## Gauge

Two interchangeable views, toggled by the pill button in the game header:

- **Arc** (`GaugeArc.jsx`): SVG semicircle with a tapered needle, color zones (blue left, white center, red right), tick marks, and animated needle rotation (800ms CSS transition)
- **Bar** (`GaugeBar.jsx`): Horizontal 11-segment bar with the same color zones and an overlay indicator that grows from center (700ms transition)

Both views trigger a shake animation when energy is at a warning threshold:
- **±3**: Gentle shake, 1.2s repeat interval
- **±4 and above**: Rapid shake, 0.6s repeat interval

---

## History Stack

`HistoryStack.jsx` provides two modes:

- **Collapsed (in-game)**: Up to 4 past cards fan out behind the active card with slight rotation and vertical offset, giving depth without obscuring gameplay
- **Expanded (full-screen)**: A portal-based horizontal carousel with snap scrolling, dot indicators, and all played cards replayed with the chosen option frozen in the highlighted state

The portal escapes the game layout's transform context to prevent clipping artifacts on the overlay.

---

## Action Footer

`ActionFooter.jsx` is fixed to the bottom of the screen and changes behavior based on phase and card type:

| State | Button label | Behavior |
|---|---|---|
| Choice card, no selection | Confirm (disabled) | Waits for a selection |
| Choice card, option selected | Confirm (active) | Flips card to reveal |
| Revealed choice card | Understood | Applies energy delta |
| Environment card | Understood | Applies energy delta |

When **autoplay** is enabled, a 5-second SVG countdown ring fills around the button. On completion it auto-fires, advancing the round without player input.

---

## Visual Language

| Element | Color | Meaning |
|---|---|---|
| Deep red `#930018` | Primary actions, headings, meltdown state | Energy / urgency |
| Blue `#004E93` / `#D6E0FF` | Deepfreeze states | Cold / disengagement |
| Cream `#FFF9EF` | Background, neutral | Calm / balance |
| Pink `#FFDEE5` | Meltdown card background | Stress / heat |
| Gold accent | Confetti, win screen | Celebration |

Cards are color-coded by impact direction: pink for energy-raising events, blue for energy-draining events, cream for neutral/choice scenarios.

---

## Running Locally

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. The production build deploys to the `/Thermostat-Game/` base path (configured in `vite.config.js`).

```bash
npm run build
npm run preview
```
