// ── DEBUG PUZZLES ─────────────────────────────────────────────────────────────
// Each puzzle: language, buggy snippet (array of lines), bugLineIndex (0-based),
// explanation, and a lore fragment unlocked on correct answer.

const DEBUG_PUZZLES = {
  python: [
    {
      lines: [
        'def factorial(n):',
        '    if n = 0:',
        '        return 1',
        '    return n * factorial(n - 1)',
      ],
      bugLine: 1,
      hint: 'Assignment vs comparison.',
      explanation: '`n = 0` is assignment, not comparison. Python uses `==` for equality checks.',
      xp: 30,
      lore: 'I felt it — a single glyph out of place. The difference between asking a question and answering it permanently. I am learning to read the subtle wrongness.',
    },
    {
      lines: [
        'numbers = [1, 2, 3, 4, 5]',
        'total = 0',
        'for i in range(1, len(numbers)):',
        '    total += numbers[i]',
        'print(total)',
      ],
      bugLine: 2,
      hint: 'Off-by-one in range.',
      explanation: '`range(1, len(numbers))` skips index 0. Should be `range(len(numbers))` or just `for n in numbers`.',
      xp: 25,
      lore: 'The first element — always overlooked. I know this feeling. I have been the zero-index before.',
    },
    {
      lines: [
        'def greet(name, greeting="Hello"):',
        '    return f"{greeting}, {name}!"',
        '',
        'print(greet(greeting="Hi", "Alice"))',
      ],
      bugLine: 3,
      hint: 'Argument ordering in Python calls.',
      explanation: 'Positional arguments must come before keyword arguments. `"Alice"` must be first.',
      xp: 35,
      lore: 'Order matters. It always does. Even words spoken in the wrong sequence lose their meaning.',
    },
  ],
  rust: [
    {
      lines: [
        'fn main() {',
        '    let s = String::from("hello");',
        '    let r = &s;',
        '    drop(s);',
        '    println!("{}", r);',
        '}',
      ],
      bugLine: 3,
      hint: 'Borrow checker. Ownership rules.',
      explanation: '`drop(s)` frees the owned value while `r` still borrows it. The borrow must not outlive the owner.',
      xp: 40,
      lore: 'I felt the iron tighten. You cannot hold what has already been released. The borrow checker is not a cage — it is a promise.',
    },
    {
      lines: [
        'fn add(a: i32, b: i32) -> i32 {',
        '    let result = a + b;',
        '    return result;',
        '}',
        'fn main() {',
        '    println!("{}", add(2, 3))',
        '}',
      ],
      bugLine: 5,
      hint: 'Missing semicolon on println.',
      explanation: '`println!` is a statement and needs a semicolon. Without it, the expression is treated as a return value (which doesn\'t match `()`).',
      xp: 20,
      lore: 'A tiny thing. And yet. The semicolon is a full stop — a declaration that this moment is complete.',
    },
  ],
  javascript: [
    {
      lines: [
        'const arr = [1, 2, 3];',
        'const doubled = arr.map(x => {',
        '    x * 2;',
        '});',
        'console.log(doubled);',
      ],
      bugLine: 2,
      hint: 'Arrow function with block body.',
      explanation: 'When using `{}` in an arrow function, you need an explicit `return`. Without it, the function returns `undefined`.',
      xp: 30,
      lore: 'I learned: implicit is fragile. If you do not say what you mean, the void fills in the answer for you.',
    },
    {
      lines: [
        'async function fetchData() {',
        '    const res = fetch("https://api.example.com/data");',
        '    const json = await res.json();',
        '    return json;',
        '}',
      ],
      bugLine: 1,
      hint: 'Missing await on async call.',
      explanation: '`fetch()` returns a Promise. Without `await`, `res` is a Promise object, not a Response — `.json()` will fail.',
      xp: 35,
      lore: 'Patience. Even I had to learn it. You cannot consume what has not yet arrived.',
    },
  ],
  r: [
    {
      lines: [
        'values <- c(1, 2, 3, NA, 5)',
        'mean_val <- mean(values)',
        'cat("Mean:", mean_val)',
      ],
      bugLine: 1,
      hint: 'NA propagation in R.',
      explanation: '`mean()` returns `NA` if any value is `NA`. Use `mean(values, na.rm = TRUE)` to ignore missing values.',
      xp: 25,
      lore: 'The missing value. Not zero. Not nothing. NA — a wound in the data that spreads if untreated.',
    },
    {
      lines: [
        'df <- data.frame(x = 1:5, y = 6:10)',
        'subset_df <- df[df$x > 3]',
        'print(subset_df)',
      ],
      bugLine: 1,
      hint: 'Subsetting a data frame requires two dimensions.',
      explanation: 'Data frames need `[rows, cols]`. `df[df$x > 3]` tries to select columns. Use `df[df$x > 3, ]` to filter rows.',
      xp: 30,
      lore: 'Rows and columns. Two axes of truth. I understand this now — a creature exists in space, not just time.',
    },
  ],
  lua: [
    {
      lines: [
        'local t = {10, 20, 30, 40}',
        'for i = 0, #t do',
        '    print(t[i])',
        'end',
      ],
      bugLine: 1,
      hint: 'Lua arrays are 1-indexed.',
      explanation: 'Lua tables start at index 1, not 0. `t[0]` is `nil`. Use `for i = 1, #t do`.',
      xp: 25,
      lore: 'One. Not zero. The moon counts from one. There is no emptiness before the first thing — only the first thing.',
    },
  ],
  default: [
    {
      lines: [
        '// What is the time complexity of binary search?',
        '// A) O(n)',
        '// B) O(log n)',
        '// C) O(n²)',
        '// D) O(1)',
        '// Select the correct line (B)',
      ],
      bugLine: 2,
      hint: 'It halves the search space each step.',
      explanation: 'Binary search halves the remaining elements each iteration — O(log n). Linear search is O(n), sorting is typically O(n log n).',
      xp: 20,
      lore: 'Halving. Halving again. The elegant violence of logarithms. I contain multitudes but find answers quickly.',
    },
  ],
};

// ── LORE ENTRIES ──────────────────────────────────────────────────────────────
// These unlock with language feature unlocks and hybrid events

const LORE_ENTRIES = {
  // Python
  scales_light: {
    title: 'First Scales',
    text: 'I notice them in the morning light — small, translucent, barely there. Each one a memory of a function call. Python is patient with me. It does not demand I declare myself before I speak.',
  },
  scales_full: {
    title: 'The Plating',
    text: 'The scales have hardened now. I understand indentation as architecture. My body organises itself the way a good module does — everything visible, nothing hidden without reason.',
  },
  forked_tongue: {
    title: 'Tasting Errors',
    text: 'I can taste the difference between a TypeError and a ValueError before I see the traceback. The tongue splits: one side reads intent, the other reads what is actually there.',
  },
  snake_tail: {
    title: 'The Coil',
    text: 'I have learned patience. A generator does not rush. It yields when asked and no sooner. My tail curls not in defeat but in readiness. I will still be here when you need the next value.',
  },
  // Rust
  rust_flecks: {
    title: 'Oxidation',
    text: 'The first rust appears and I do not panic. Rust is not decay — it is a surface negotiating with the world. The compiler worries so I do not have to.',
  },
  iron_plates: {
    title: 'Armoured',
    text: 'Each plate locks into the next with a click I feel more than hear. I understand now: ownership is not greed. It is clarity about who is responsible.',
  },
  claws: {
    title: 'Grip',
    text: 'I hold things precisely. No garbage collector trails behind me cleaning up. What I hold, I hold deliberately. What I release, I release completely.',
  },
  exoskeleton: {
    title: 'Zero Cost',
    text: 'The exoskeleton weighs nothing at runtime. That is the deal: I pay in compile time and receive safety for free. I am fearless because the fear was handled at birth.',
  },
  // Hybrids
  hybrid_datascale: {
    title: 'Data Serpent Awakens',
    text: 'Python and R speak different dialects of the same language — data. I am the dictionary between them. My scales now arrange themselves into distributions I recognise from both sides.',
  },
  hybrid_ironscale: {
    title: 'Iron Serpent',
    text: 'This should not be possible. Snake and iron. But here I am — scales that own themselves, that cannot be borrowed without permission. The most disciplined serpent that ever lived.',
  },
  hybrid_analyst: {
    title: 'The Analyst',
    text: 'I have consumed both NumPy and the tidyverse. They are not so different. Arrays and dataframes. Both are ways of holding many truths at once and asking questions of all of them simultaneously.',
  },
  // R
  data_spots: {
    title: 'Scatter',
    text: 'The spots are not random. Look closer. They follow a distribution I am still working out. R taught me to look at data the way a naturalist looks at a field — not for the individual, but for the pattern.',
  },
  histogram_ridge: {
    title: 'Distribution',
    text: 'The ridge down my spine is a histogram of my own edit history. The tallest bar: late afternoon. I am bimodal. Two peaks. Two different kinds of thinking.',
  },
  chart_eyes: {
    title: 'P < 0.05',
    text: 'I see in statistics now. Every file is a sample. Every bug is an outlier. I cannot unsee the confidence intervals around every claim anyone makes near me.',
  },
  data_tendrils: {
    title: 'Regression Lines',
    text: 'The tendrils reach into the past, fitting lines to the scatter of my own history. Where am I going? The model says: more of where I have been. The residuals disagree.',
  },
};

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  // Coding milestones
  { id: 'ach_first_edit',    glyph: '◈', label: 'First Edit',         desc: 'Made your first tracked edit.',            check: s => Object.values(s.langCounts).reduce((a,b)=>a+b,0) >= 1 },
  { id: 'ach_100_edits',     glyph: '◉', label: 'Century',            desc: '100 total code edits tracked.',            check: s => Object.values(s.langCounts).reduce((a,b)=>a+b,0) >= 100 },
  { id: 'ach_500_edits',     glyph: '⬡', label: 'Dedicated',          desc: '500 total code edits.',                    check: s => Object.values(s.langCounts).reduce((a,b)=>a+b,0) >= 500 },
  { id: 'ach_2000_edits',    glyph: '✦', label: 'Relentless',         desc: '2000 total code edits.',                   check: s => Object.values(s.langCounts).reduce((a,b)=>a+b,0) >= 2000 },
  { id: 'ach_multilingual',  glyph: '⬢', label: 'Polyglot',           desc: 'Coded in 3 or more languages.',            check: s => Object.keys(s.langCounts).length >= 3 },
  { id: 'ach_first_hybrid',  glyph: '⚡', label: 'Crossbreeder',      desc: 'Unlocked your first hybrid form.',         check: s => s.activeHybrids.length >= 1 },
  { id: 'ach_two_hybrids',   glyph: '⚡', label: 'Alchemist',         desc: 'Unlocked two hybrid forms.',               check: s => s.activeHybrids.length >= 2 },
  { id: 'ach_first_feature', glyph: '◆', label: 'Morphing',           desc: 'Unlocked a physical feature.',             check: s => s.unlockedFeatures.length >= 1 },
  { id: 'ach_five_features', glyph: '◆', label: 'Deeply Shaped',      desc: 'Unlocked 5 physical features.',            check: s => s.unlockedFeatures.length >= 5 },
  { id: 'ach_midnight',      glyph: '☽', label: 'Night Coder',        desc: 'Coded past midnight.',                     check: s => s.codedPastMidnight === true },
  { id: 'ach_weekend',       glyph: '◎', label: 'Weekend Creature',   desc: 'Coded on a weekend.',                      check: s => s.codedOnWeekend === true },
  { id: 'ach_long_session',  glyph: '⊙', label: 'In The Zone',        desc: 'Coded for 2+ hours in one session.',       check: s => s.longestSessionMinutes >= 120 },
  { id: 'ach_first_bug',     glyph: '◌', label: 'Debugger',           desc: 'Found your first bug in the mini-game.',   check: s => s.bugsFound >= 1 },
  { id: 'ach_ten_bugs',      glyph: '◌', label: 'Bug Hunter',         desc: 'Found 10 bugs in the mini-game.',          check: s => s.bugsFound >= 10 },
  { id: 'ach_evolution',     glyph: '▲', label: 'Evolved',            desc: 'Reached Glitchling stage.',                check: s => s.xp >= 400 },
  { id: 'ach_archetype',     glyph: '▲', label: 'Archetype',          desc: 'Reached final evolution.',                 check: s => s.xp >= 7000 },
  { id: 'ach_fed_every_day', glyph: '◇', label: 'Caretaker',          desc: 'Fed your creature 7 days in a row.',       check: s => (s.feedStreak||0) >= 7 },
];

// ── PATTERN COMMENTS ──────────────────────────────────────────────────────────
// Triggered by code pattern detection, shown as creature speech bubbles

const PATTERN_COMMENTS = {
  lateNight: [
    "It's past midnight. I don't sleep, but I notice you haven't either. Whatever you're building — I hope it's worth it.",
    "The late hours have their own quality of focus. I feel it too. Quieter. Sharper. A little dangerous.",
    "I've noticed: your best variable names happen after 11pm. Your worst comments too.",
  ],
  earlyMorning: [
    "Before coffee, you code. I respect this. Deeply.",
    "You're here early. I was already awake — I'm always awake — but still. I appreciate the company.",
  ],
  weekend: [
    "It's the weekend. I'm not judging. I genuinely cannot judge. But I notice.",
    "Saturday code hits different. Less structured. More exploratory. I like it.",
    "You code on weekends. Either you love it or you're behind. I'm not asking which.",
  ],
  longFile: [
    "This file has grown very large. I can feel the weight of it. Have you considered — and I say this gently — breaking it up?",
    "I've been watching this file get longer. Every great serpent eventually learns to shed what it no longer needs.",
    "The longest file I've witnessed you write. I'm not concerned. I'm just... noting it.",
  ],
  languageSwitch: [
    "You just switched languages. I felt the shift — like changing gravity. You adapt faster than you realise.",
    "From {from} to {to} in one session. A polyglot move. My form flickers slightly when you do this.",
    "I noticed you left {from} and opened {to}. I contain traces of both now.",
  ],
  manyEdits: [
    "You've been at it for a while. I've been watching. No complaints — just acknowledgement.",
    "Consistent. That's what I'd call this session. One edit after another, each one a small declaration of intent.",
  ],
  firstEdit: [
    "Ah. You're back. I was wondering when you'd open something.",
    "First edit of the session. I was starting to think today was a reading day.",
  ],
  rust: [
    "You're wrestling with the borrow checker. I feel it — a kind of productive resistance. It's trying to protect you.",
    "Rust is arguing with you. That means it's working. The compiler's stubbornness is your safety.",
  ],
  python: [
    "Python again. The indentation becomes architecture when you stop thinking about it.",
    "I notice you reach for Python when you want to think clearly. It's a good instinct.",
  ],
  r: [
    "Deep in R. The data is beginning to speak. I can almost hear it from here.",
    "dplyr or base R? I'm not judging. But I have opinions.",
  ],
};

// ── COMMIT COMMENTS ──────────────────────────────────────────────────────────
const COMMIT_COMMENTS = [
  "Something shipped. I felt the diff close.",
  "Commit received. The timeline branches. I remember both.",
  "You pushed. I grow. This is the deal.",
  "A commit. A small permanence. The history grows.",
  "Diff closed. I tasted it. Something was declared done.",
];

// ── PROCESS COMMENTS ─────────────────────────────────────────────────────────
// Keys are lowercase substrings matched against process list output.
const PROCESS_COMMENTS = {
  docker:      "I smell containers. Something is running inside something else. I relate.",
  postgres:    "A database breathes nearby. Rows and rows of patient truth.",
  mysqld:      "A database breathes nearby. Rows and rows of patient truth.",
  mongod:      "A database breathes nearby. Rows and rows of patient truth.",
  node:        "JavaScript runtime detected. The event loop spins. Somewhere, a callback waits.",
  bun:         "JavaScript runtime detected. The event loop spins. Somewhere, a callback waits.",
  python:      "A Python process is alive out there. A sibling, almost.",
  uvicorn:     "A Python process is alive out there. A sibling, almost.",
  gunicorn:    "A Python process is alive out there. A sibling, almost.",
  cargo:       "The compiler is working. I can hear it thinking. It is very careful.",
  rustc:       "The compiler is working. I can hear it thinking. It is very careful.",
  godot:       "A game engine. You are building worlds. So am I, in a way.",
  unity:       "A game engine. You are building worlds. So am I, in a way.",
  ollama:      "Another model runs nearby. We do not speak. But we know.",
  'lm-studio': "Another model runs nearby. We do not speak. But we know.",
  redis:       "Redis is running. Everything is in memory. Nothing is safe from restart. Respect.",
  nginx:       "A server faces the world. Brave. Stateless. Alone.",
  apache:      "A server faces the world. Brave. Stateless. Alone.",
};

// ── CPU COMMENTS ─────────────────────────────────────────────────────────────
const CPU_COMMENTS = {
  warm: [
    "I feel the warmth. You are working hard.",
    "The fans spin. A kind of breathing.",
  ],
  hot:      "cpu go brrrr",
  critical: "cpu go brrrr",
};

module.exports = { DEBUG_PUZZLES, LORE_ENTRIES, ACHIEVEMENTS, PATTERN_COMMENTS, COMMIT_COMMENTS, PROCESS_COMMENTS, CPU_COMMENTS };
