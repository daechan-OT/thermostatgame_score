// src/data/cards.js
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO EDIT THIS FILE:
// - Add a new card object to the CARD_DECK array below.
// - "type" must be either "environment" or "choice".
// - For environment cards, "energyImpact" is a number (positive raises energy,
//   negative lowers it). Keep values between -3 and +3.
// - For choice cards, each option has its own "energyImpact" and
//   "educationalMessage" shown after the player confirms their pick.
// - The game randomly selects 10 cards per session, so you can have more than
//   10 cards in this file for replayability.
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_DECK = [
  // ── ENVIRONMENT CARDS ────────────────────────────────────────────────────
  {
    id: "env-001",
    type: "environment",
    label: "Environment",
    title: "Drive Thru Backup",
    description: "Visible pressure as you see the line of cars snake around the store.",
    energyImpact: +2,
    impactLabel: "Store Energy +2",
  },
  {
    id: "env-002",
    type: "environment",
    label: "Environment",
    title: "Soccer Team Swarm",
    description: "High pressure, lots of tickets, potential for panic.",
    energyImpact: +2,
    impactLabel: "Store Energy +2",
  },
  {
    id: "env-003",
    type: "environment",
    label: "Environment",
    title: "New Product Launch",
    description: "Excitement but also confusion over new recipes.",
    energyImpact: +2,
    impactLabel: "Store Energy +2",
  },
  {
    id: "env-004",
    type: "environment",
    label: "Environment",
    title: "AC is acting up",
    description: "Physical discomfort leads to shorter tempers.",
    energyImpact: +1,
    impactLabel: "Store Energy +1",
  },
  {
    id: "env-005",
    type: "environment",
    label: "Environment",
    title: "Early Truck Delivery",
    description: "Unexpected heavy lifting during a rush.",
    energyImpact: +1,
    impactLabel: "Store Energy +1",
  },
  {
    id: "env-006",
    type: "environment",
    label: "Environment",
    title: "Blender Breakdown",
    description: "One of the blenders is down, and everything is taking longer.",
    energyImpact: +1,
    impactLabel: "Store Energy +1",
  },
  {
    id: "env-007",
    type: "environment",
    label: "Environment",
    title: "Cold Spell",
    description: "It's 25 degrees outside and no one is thinking smoothies.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },
  {
    id: "env-008",
    type: "environment",
    label: "Environment",
    title: "Goodbye friend",
    description: "Everyone's favorite teammate just had their last day. Vibes are sad.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },
  {
    id: "env-009",
    type: "environment",
    label: "Environment",
    title: "Staff Shortage",
    description: "You are short on team members and everyone is overworked.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },
  {
    id: "env-010",
    type: "environment",
    label: "Environment",
    title: "Speaker Breaks",
    description: "The store is silent and the \"vibe\" is off.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },
  {
    id: "env-011",
    type: "environment",
    label: "Environment",
    title: "Regular Relocating",
    description: "Your favorite regular is moving away and just said bye.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },
  {
    id: "env-012",
    type: "environment",
    label: "Environment",
    title: "Rainy Day Blues",
    description: "Low guest count; team gets bored and sluggish.",
    energyImpact: -2,
    impactLabel: "Store Energy −2",
  },

  // ── CHOICE CARDS ─────────────────────────────────────────────────────────
  {
    id: "cho-001",
    type: "choice",
    label: "Your Move",
    title: "Venting Team Member",
    description: "A team member pulls you aside mid-rush to complain about a coworker.",
    options: [
      {
        id: "A",
        text: "This isn't the right time.",
        energyImpact: "balance",
        educationalMessage: "They go quiet. The tension between them hardens for the rest of the shift.",
      },
      {
        id: "B",
        text: "I hear you. Give me 5 minutes.",
        energyImpact: -1,
        educationalMessage: "You hold the boundary without dismissing them. They feel seen, not sidelined.",
      },
    ],
  },
  {
    id: "cho-002",
    type: "choice",
    label: "Your Move",
    title: "The $40 Mistake",
    description: "A team member just remade a large order wrong. The guest is annoyed. Everyone saw it.",
    options: [
      {
        id: "A",
        text: "Give in the moment feedback.",
        energyImpact: +2,
        educationalMessage: "Point made. But now the whole team is watching their back instead of the line.",
      },
      {
        id: "B",
        text: "Handle the guest, debrief after the rush.",
        energyImpact: "balance",
        educationalMessage: "The team watches you stay steady. That steadiness spreads.",
      },
    ],
  },
  {
    id: "cho-003",
    type: "choice",
    label: "Your Move",
    title: "Slow Afternoon",
    description: "2:30pm. No guests. Two people on their phones. The store has flatlined.",
    options: [
      {
        id: "A",
        text: "Say nothing.",
        energyImpact: -1,
        educationalMessage: "The silence stretches. Everyone gets slower and more distant.",
      },
      {
        id: "B",
        text: "Invent a small challenge.",
        energyImpact: "balance",
        educationalMessage: "A quick game or task resets the energy before it fully drains.",
      },
    ],
  },
  {
    id: "cho-004",
    type: "choice",
    label: "Your Move",
    title: "You're Having a Bad Day",
    description: "You didn't sleep. Hard morning. You walk in carrying it on your face.",
    options: [
      {
        id: "A",
        text: "Push through and hope no one notices.",
        energyImpact: +1,
        educationalMessage: "They noticed.",
      },
      {
        id: "B",
        text: "Name it before it names you.",
        energyImpact: 0,
        educationalMessage: "\"Rough morning—give me a sec.\" Your honesty gives them permission to be human too.",
      },
    ],
  },
  {
    id: "cho-005",
    type: "choice",
    label: "Your Move",
    title: "The Call-Out",
    description: "Someone called out 30 minutes before their shift. The team already knows.",
    options: [
      {
        id: "A",
        text: "Let the team know.",
        energyImpact: +1,
        educationalMessage: "\"We're short again.\" Every person on shift tenses up.",
      },
      {
        id: "B",
        text: "Make a plan, then let the team know.",
        energyImpact: "balance",
        educationalMessage: "\"We're short—here's the plan.\" You hand out clear roles and ask about staying. The team leans in.",
      },
    ],
  },
  {
    id: "cho-006",
    type: "choice",
    label: "Your Move",
    title: "Guest Goes Off",
    description: "A guest is being openly rude and yelling at a team member at the register.",
    options: [
      {
        id: "A",
        text: "Step in to de-escalate.",
        energyImpact: "balance",
        educationalMessage: "You calmly de-escalate the situation, telling the guest they can't speak to your team that way. Then re-make a smoothie.",
      },
      {
        id: "B",
        text: "Just make the guest a new smoothie.",
        energyImpact: +2,
        educationalMessage: "The guest is gone but the team feels unsupported. They worry you don't have their back.",
      },
    ],
  },
  {
    id: "cho-007",
    type: "choice",
    label: "Your Move",
    title: "New Hire's First Rush",
    description: "Your newest team member is making mistakes and starting to panic.",
    options: [
      {
        id: "A",
        text: "Quietly reassign them to something easier.",
        energyImpact: -1,
        educationalMessage: "They interpret the silence as failure. They mentally check out.",
      },
      {
        id: "B",
        text: "Slide next to them.",
        energyImpact: "balance",
        educationalMessage: "\"Watch me once, then you've got it.\" They finish the rush standing taller.",
      },
    ],
  },
  {
    id: "cho-008",
    type: "choice",
    label: "Your Move",
    title: "The Gossip Spiral",
    description: "Two team members are whispering about a third who isn't there.",
    options: [
      {
        id: "A",
        text: "Ignore it.",
        energyImpact: -1,
        educationalMessage: "By end of shift, there is a clear tension in the air.",
      },
      {
        id: "B",
        text: "Pull everyone into a task together.",
        energyImpact: 0,
        educationalMessage: "You don't lecture. The cooperation does the work.",
      },
    ],
  },
  {
    id: "cho-009",
    type: "choice",
    label: "Your Move",
    title: "Schedule Mess-up",
    description: "Moving quickly you accidentally scheduled someone you knew was on vacation. Now we are short.",
    options: [
      {
        id: "A",
        text: "Take the shift yourself.",
        energyImpact: +1,
        educationalMessage: "The team fills your silence with anxiety about their own mistakes and worry vacations aren't valued.",
      },
      {
        id: "B",
        text: "Own it out loud.",
        energyImpact: "balance",
        educationalMessage: "\"That was on me. I forgot to write it down.\" The team learns mistakes don't have to be disasters.",
      },
    ],
  },
  {
    id: "cho-010",
    type: "choice",
    label: "Your Move",
    title: "Recognition Drought",
    description: "You realize you haven't genuinely praised anyone in over a week. The shift has a \"just getting through it\" feel.",
    options: [
      {
        id: "A",
        text: "Your team is strong, don't worry.",
        energyImpact: -1,
        educationalMessage: "People stop going above the minimum.",
      },
      {
        id: "B",
        text: "Put down inventory and show appreciation.",
        energyImpact: "balance",
        educationalMessage: "One real, specific compliment lands harder than ten generic ones.",
      },
    ],
  },
  {
    id: "cho-011",
    type: "choice",
    label: "Your Move",
    title: "The Argument",
    description: "Two team members had a disagreement before the shift. The tension is now on the floor.",
    options: [
      {
        id: "A",
        text: "Address it in the moment.",
        energyImpact: +2,
        educationalMessage: "The rest of the team looks on. You mean well. It escalates anyway.",
      },
      {
        id: "B",
        text: "Separate, then reconnect.",
        energyImpact: "balance",
        educationalMessage: "Talk to each quietly. Ask them to get through the shift. Then bring them together privately.",
      },
    ],
  },
  {
    id: "cho-012",
    type: "choice",
    label: "Your Move",
    title: "End of a Hard Shift",
    description: "You just survived a brutal rush. The team is exhausted and about to leave without anyone acknowledging it.",
    options: [
      {
        id: "A",
        text: "Get everyone home quickly.",
        energyImpact: -1,
        educationalMessage: "People leave tired and invisible. The next shift starts from a hole.",
      },
      {
        id: "B",
        text: "Gather for 60 seconds.",
        energyImpact: "balance",
        educationalMessage: "\"That was hard. You didn't fold. I noticed.\" They leave as a team.",
      },
    ],
  },
];
