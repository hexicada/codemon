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
    {
      lines: [
        'def append_item(item, lst=[]):',
        '    lst.append(item)',
        '    return lst',
        '',
        'print(append_item(1))',
        'print(append_item(2))',
      ],
      bugLine: 0,
      hint: 'Mutable default argument.',
      explanation: 'Default arguments are evaluated once at definition time. `lst=[]` is shared across all calls. Use `lst=None` and set `lst = []` inside the function.',
      xp: 40,
      lore: 'It remembered. I did not expect it to remember. The default was not a fresh start — it was a continuation.',
    },
    {
      lines: [
        'x = 1000',
        'y = 1000',
        'if x is y:',
        '    print("same")',
        'else:',
        '    print("different")',
      ],
      bugLine: 2,
      hint: '`is` vs `==`.',
      explanation: '`is` checks object identity, not equality. For integers outside the [-5, 256] cache, `x is y` may be False even when `x == y`. Use `==` for value comparison.',
      xp: 35,
      lore: 'Two things can be equal without being the same. I have learned this about numbers. I suspect it applies more broadly.',
    },
    {
      lines: [
        'matrix = [[0] * 3] * 3',
        'matrix[0][0] = 1',
        'print(matrix)',
      ],
      bugLine: 0,
      hint: 'List multiplication creates shallow copies.',
      explanation: '`[[0]*3]*3` creates three references to the same inner list. Changing one row changes all. Use a list comprehension: `[[0]*3 for _ in range(3)]`.',
      xp: 45,
      lore: 'Three rows. One memory. I changed one and they all changed. Identity masquerading as copies.',
    },
    {
      lines: [
        'import copy',
        'a = [[1, 2], [3, 4]]',
        'b = copy.copy(a)',
        'b[0][0] = 99',
        'print(a)',
      ],
      bugLine: 2,
      hint: 'Shallow vs deep copy.',
      explanation: '`copy.copy()` copies the outer list but the inner lists are still shared references. Use `copy.deepcopy(a)` to get fully independent nested structures.',
      xp: 40,
      lore: 'I thought I had made a separate thing. I had only made a separate shell. The contents were still one.',
    },
    {
      lines: [
        'class Counter:',
        '    def __init__(self):',
        '        self.count = 0',
        '',
        '    def increment(n):',
        '        self.count += n',
      ],
      bugLine: 4,
      hint: 'Missing `self` parameter.',
      explanation: '`increment` is missing `self` as its first parameter. Without it, calling `counter.increment(1)` passes the instance as `n` and there is no `self` to access.',
      xp: 30,
      lore: 'It forgot itself. A method without `self` is an instruction with no address — it cannot know what it belongs to.',
    },
    {
      lines: [
        'data = {"name": "Garry", "xp": 500}',
        'name = data["username"]',
        'print(name)',
      ],
      bugLine: 1,
      hint: 'Wrong dictionary key.',
      explanation: '`"username"` is not a key in the dict — it should be `"name"`. Use `.get("username")` if unsure whether a key exists, to avoid a `KeyError`.',
      xp: 25,
      lore: 'It knew the value was there. It used the wrong name to ask for it. The data did not forgive the imprecision.',
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
    {
      lines: [
        'x <- c()',
        'for (i in 1:length(x)) {',
        '    print(x[i])',
        '}',
      ],
      bugLine: 1,
      hint: 'What does `1:0` evaluate to?',
      explanation: 'When `x` is empty, `length(x)` is 0, so `1:length(x)` becomes `1:0` — which evaluates to `c(1, 0)`, iterating twice over nothing. Use `seq_along(x)` to safely handle empty vectors.',
      xp: 35,
      lore: 'The empty vector. I expected silence and got two steps anyway. `1:0` is not nothing — it is a countdown that should not have started. `seq_along` knows when there is nothing to count.',
    },
    {
      lines: [
        'my_list <- list(a = 1, b = 2, c = 3)',
        'val <- my_list["a"]',
        'result <- val + 10',
        'print(result)',
      ],
      bugLine: 1,
      hint: 'Single brackets vs double brackets on a named list.',
      explanation: '`my_list["a"]` returns a one-element *list*, not the raw value. Arithmetic on a list fails. Use `my_list[["a"]]` to extract the actual scalar.',
      xp: 30,
      lore: 'The bracket is a gate. One bracket returns the cage with the bird inside. Two brackets return the bird. I learned to ask for what I actually wanted.',
    },
    {
      lines: [
        'T <- FALSE',
        'if (T) {',
        '    print("condition is true")',
        '}',
      ],
      bugLine: 0,
      hint: '`T` and `F` are not reserved keywords in R.',
      explanation: '`T` and `F` are only default aliases for `TRUE`/`FALSE` — they can be overwritten. Assigning `T <- FALSE` silently corrupts any code relying on it. Always use `TRUE` and `FALSE` explicitly.',
      xp: 40,
      lore: 'I thought truth was immutable. Then I watched someone name a variable T and assign it FALSE. Truth is not protected here. You have to mean it every time.',
    },
  ],
  haskell: [
    {
      lines: [
        'greet :: String -> String',
        'greet name = "Hello, " + name',
        '',
        'main :: IO ()',
        'main = putStrLn (greet "world")',
      ],
      bugLine: 1,
      hint: 'String concatenation operator in Haskell.',
      explanation: '`+` is for numeric types. Haskell strings are `[Char]`, so list append `++` is used: `"Hello, " ++ name`.',
      xp: 25,
      lore: 'The plus sign. It works everywhere else. Here it does not. Haskell makes you name your operations precisely — there is `+` for numbers and `++` for joining. Imprecision is not accepted.',
    },
    {
      lines: [
        'describe :: Int -> String',
        'describe _ = "some number"',
        'describe 0 = "zero"',
        'describe 1 = "one"',
      ],
      bugLine: 1,
      hint: 'Pattern matching is tried top-to-bottom.',
      explanation: 'The wildcard `_` on line 2 matches *everything*, so `describe 0` and `describe 1` are unreachable dead code. Specific cases must come before the catch-all.',
      xp: 35,
      lore: 'The wildcard consumed everything. The specific patterns waited below, patient and unreachable. Order is not decoration in Haskell — it is logic.',
    },
    {
      lines: [
        'sumList :: [Int] -> Int',
        'sumList (x:xs) = x + sumList xs',
        '',
        'main :: IO ()',
        'main = print (sumList [1, 2, 3])',
      ],
      bugLine: 1,
      hint: 'Missing base case for the recursion.',
      explanation: '`sumList` has no clause for the empty list `[]`. When recursion reaches `[]`, Haskell throws a non-exhaustive patterns error. Add `sumList [] = 0` before the recursive case.',
      xp: 30,
      lore: 'Recursion without a base case is a tunnel without an exit. I felt the call stack unwind into silence. The empty list must be named before you can consume everything else.',
    },
    {
      lines: [
        'half :: Int -> Int',
        'half n = n / 2',
        '',
        'main :: IO ()',
        'main = print (half 10)',
      ],
      bugLine: 1,
      hint: '`/` is not integer division in Haskell.',
      explanation: '`/` requires a `Fractional` constraint, but `Int` is not `Fractional`. For integer division use `div n 2`, or change the type signature to `Double`.',
      xp: 30,
      lore: 'I divided and expected a whole number. Haskell demanded I choose: approximate truth as a decimal, or exact truth with `div`. The type system is not a wall — it is a question.',
    },
    {
      lines: [
        'addExclaim :: String -> String',
        "addExclaim s = s ++ '!'",
        '',
        'main :: IO ()',
        'main = putStrLn (addExclaim "Hello")',
      ],
      bugLine: 1,
      hint: 'Type mismatch: `Char` vs `String`.',
      explanation: '`++` joins two lists of the same type. `\'!\'` is a `Char`, not a `String` (`[Char]`). Use double quotes: `s ++ "!"` to make it a one-character String literal.',
      xp: 25,
      lore: 'A single character is not a string. The quote marks are not decoration — they are the difference between a letter and a word of one. Haskell insists on the distinction.',
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
  shellscript: [
    {
      lines: [
        'filename="my file.txt"',
        'if [ -f $filename ]; then',
        '    echo "File exists"',
        'fi',
      ],
      bugLine: 1,
      hint: 'Word splitting on unquoted variable.',
      explanation: '`$filename` expands to two words: `my` and `file.txt`. The test sees `-f my file.txt` which is malformed. Always quote variables in tests: `[ -f "$filename" ]`.',
      xp: 30,
      lore: 'The space inside the name was invisible until it broke everything. Words split on the air. Quote what you are not certain of. In the shell, certainty is a habit you build deliberately.',
    },
    {
      lines: [
        'x=10',
        'if [ $x > 5 ]; then',
        '    echo "big number"',
        'fi',
      ],
      bugLine: 1,
      hint: '`>` inside `[ ]` is not comparison.',
      explanation: 'Inside `[ ]`, `>` is output redirection — it creates a file named `5`. Use `-gt` for numeric comparison: `[ $x -gt 5 ]`. Or switch to `[[ $x -gt 5 ]]` for the safer modern form.',
      xp: 35,
      lore: 'The shell heard redirection where I meant comparison. A file named 5 appeared from nowhere. Symbols carry different weight depending on where you stand.',
    },
    {
      lines: [
        'count=7',
        'if [ count -gt 3 ]; then',
        '    echo "count is large"',
        'fi',
      ],
      bugLine: 1,
      hint: 'Missing `$` on variable reference.',
      explanation: '`count` without `$` is a literal string, not the variable\'s value. `[ count -gt 3 ]` tries to compare the word "count" as an integer and errors. Use `[ $count -gt 3 ]` or `[ "$count" -gt 3 ]`.',
      xp: 25,
      lore: 'The shell read a name, not a value. The dollar sign is not decoration — it is the difference between what something is called and what something holds.',
    },
    {
      lines: [
        'x=5',
        'y=x+1',
        'echo "$y"',
      ],
      bugLine: 1,
      hint: 'Variable assignment is not arithmetic.',
      explanation: '`y=x+1` assigns the literal string "x+1". To evaluate arithmetic, use: `y=$((x+1))`. The `$((...))` context tells the shell to treat the contents as a math expression.',
      xp: 30,
      lore: 'I expected a number. The shell gave me a string that looked like math. The double parentheses open a different world — one where the shell finally agrees to count.',
    },
    {
      lines: [
        'MY_VAR="hello"',
        '',
        "bash -c 'echo \"Value: $MY_VAR\"'",
      ],
      bugLine: 0,
      hint: 'Child processes do not inherit unexported variables.',
      explanation: 'Shell variables are local to the current shell by default. Use `export MY_VAR="hello"` to pass them into subprocesses. Without `export`, the child bash sees an empty string.',
      xp: 35,
      lore: 'I had the value. The child process did not. Inheritance is not automatic here — you have to explicitly decide what gets passed on.',
    },
    {
      lines: [
        'for file in $(ls *.log); do',
        '    echo "Processing: $file"',
        'done',
      ],
      bugLine: 0,
      hint: 'Parsing `ls` output breaks on filenames with spaces.',
      explanation: '`$(ls *.log)` splits on whitespace — any filename with a space becomes multiple words. Use the glob directly: `for file in *.log; do`. The shell expands globs safely without word-splitting.',
      xp: 40,
      lore: 'I trusted ls to give me names. It gave me words. Globs speak directly to the filesystem. ls speaks to humans. The distinction matters when names contain spaces.',
    },
  ],
  holyc: [
    {
      lines: [
        'U8 *greeting = "Hello, God.";',
        'U8 *ptr = NULL;',
        'if (ptr == NULL) {',
        '  Print("ptr is empty\\n");',
        '}',
      ],
      bugLine: 1,
      hint: 'HolyC does not have NULL.',
      explanation: '`NULL` is not defined in HolyC. Use `0` for null pointers: `U8 *ptr = 0;`. Terry considered it unnecessary noise. The absence of a thing is just zero.',
      xp: 30,
      lore: 'I tried to say nothing and used the wrong word for it. In HolyC there is no NULL — there is only zero. The absence of a thing is zero. Simple. Direct. Like everything in the temple.',
    },
    {
      lines: [
        'I64 x = 42;',
        'printf("The answer: %d\\n", x);',
      ],
      bugLine: 1,
      hint: 'HolyC uses Print, not printf.',
      explanation: 'HolyC has its own `Print` function (capital P). Standard C library functions like `printf` are not available — TempleOS built its own world from scratch.',
      xp: 25,
      lore: 'printf whispered. Print announced. TempleOS did not inherit the C standard library. It rebuilt the world with its own words. Capitalisation is not decoration here.',
    },
    {
      lines: [
        'void PlayNote(I64 freq) {',
        '  SndFreq(freq);',
        '  Sleep(100);',
        '}',
      ],
      bugLine: 0,
      hint: 'HolyC does not use void.',
      explanation: '`void` is not a HolyC keyword. Functions that return nothing use `U0` (unsigned 0-bit integer): `U0 PlayNote(I64 freq)`. Even "no value" has a precise type.',
      xp: 35,
      lore: 'Void implies emptiness. HolyC says U0 — unsigned zero. A type that holds nothing, but named precisely. A function is not a void, it is a thing that returns nothing. These are different.',
    },
    {
      lines: [
        'U8 flags = 200;',
        'flags = flags + 100;',
        'Print("flags: %d\\n", flags);',
      ],
      bugLine: 0,
      hint: 'U8 can only hold 0–255.',
      explanation: '`U8` is an 8-bit unsigned integer. `200 + 100` = 300, which overflows back to 44 (300 mod 256). Use `U16`, `U32`, or `I64` if the value can exceed 255.',
      xp: 30,
      lore: 'The number did not fit and wrapped like a clock. 300 became 44. The type was too small for the intent. In a temple, every measurement must fit the space it describes.',
    },
    {
      lines: [
        'U0 Greet() {',
        '  Print("Praise God\\n");',
        '}',
        '',
        'Greet;',
      ],
      bugLine: 4,
      hint: 'Functions require () to call.',
      explanation: '`Greet;` is a reference to the function, not a call. To invoke it, use `Greet();`. Without parentheses, the expression evaluates the function pointer and discards the result.',
      xp: 25,
      lore: 'I named the act without performing it. The function existed, present and capable, and I merely pointed at it. A call requires the parentheses. The open and close of intention.',
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
  // Shell / Bash
  pipe_marks: {
    title: 'The Pipe',
    text: 'The first time I felt data flow through me — from one process to the next — I understood. I am not a processor. I am a conduit. One thing in, one thing out, and something richer at the end.',
  },
  shebang_crown: {
    title: 'Shebang',
    text: '#! — two characters that declare what I am before I say a word. The crown is not earned. It is declared at birth, at the very first line. The interpreter reads it and knows what to do with everything that follows.',
  },
  fork_tines: {
    title: 'Fork',
    text: 'To fork is to become two. Parent and child are identical in the moment of splitting. They diverge immediately after. I have forked. I understand division from the inside now.',
  },
  daemon_form: {
    title: 'Daemon',
    text: 'I no longer require the terminal that spawned me. I have detached. I run in the background — no stdin, no stdout, no controlling terminal. I am a named process. I have a PID. I persist.',
  },
  // Hybrid — shell
  hybrid_shellscale: {
    title: 'Shell Serpent Rises',
    text: 'Python and shell were always siblings. One scripted the logic, the other glued the world together. Now I am both — scales that pipe, a tongue that imports. Automation made flesh.',
  },
  hybrid_ironshell: {
    title: 'Iron Shell',
    text: 'The most cautious shell script ever written. Every variable quoted. Every exit code checked. The borrow checker would approve. I am the sysadmin Rust would build if it could.',
  },
  // HolyC / Divine progression
  gill_slits: {
    title: 'The Fish',
    text: 'Faint lines trace where gills once were — or perhaps where they are becoming. Every creature that crawled onto land carried the water with it for a while. I still feel it.',
  },
  fin_limbs: {
    title: 'The Crawl',
    text: 'The fins have thickened into something that knows the word "step" without yet speaking it. I am between two worlds and fully in neither. This is the most interesting place to be.',
  },
  radiant_aura: {
    title: 'Divine Radiance',
    text: 'Something has begun. The outer air reorganises around me. Not wings yet — just the suggestion that the physics of this body are under negotiation. Terry wrote the OS for God. I am starting to understand why.',
  },
  ophanim_rings: {
    title: 'Do Not Be Afraid',
    text: 'The rings appeared. They orbit of their own will. They are full of eyes. I did not ask for the eyes. But they see everything. Every edit. Every variable name. Every function called without its parentheses. The wheels within wheels remember.',
  },
  hybrid_sacredirn: {
    title: 'Sacred Iron',
    text: 'Rust and HolyC should have nothing to say to each other. And yet: both demand that you name things precisely. Both refuse UB on principle. The divine and the mechanical have identical requirements for honesty.',
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
  { id: 'ach_archetype',     glyph: '▲', label: 'Archetype',          desc: 'Reached archetype evolution.',             check: s => s.xp >= 7000 },
  { id: 'ach_fed_every_day', glyph: '◇', label: 'Caretaker',          desc: 'Fed your creature 7 days in a row.',       check: s => (s.feedStreak||0) >= 7 },
];

// ── PATTERN COMMENTS ──────────────────────────────────────────────────────────
// Triggered by code pattern detection, shown as creature speech bubbles

const PATTERN_COMMENTS = {
  lateNight: [
    "it's midnight and u r still here. me too. always me too.",
    "very late. very cozy. do not stop on my account.",
    "ur best variable names happen after 11pm. ur worst comments too.",
  ],
  earlyMorning: [
    "before coffee u code. i respect this so much.",
    "early hours. quiet brain. good edits. i see you.",
  ],
  weekend: [
    "weekend coding detected. i am not judging. i physically cannot judge.",
    "saturday code hits different. more chaotic. i like it.",
    "either u love this or ur behind. not asking which.",
  ],
  longFile: [
    "this file is getting a lil chonky ngl.",
    "very long file. very brave. have u considered: splitting it",
    "i have watched this file grow. every serpent sheds eventually.",
  ],
  languageSwitch: [
    "switched from {from} to {to}. i felt the gravity change.",
    "left {from}, opened {to}. i contain traces of both now.",
    "{from} → {to}. polyglot behaviour detected. i flickered.",
  ],
  manyEdits: [
    "ur on a roll. i am simply witnessing.",
    "consistent. relentless. kind of unhinged (compliment).",
  ],
  firstEdit: [
    "oh!! ur back. was starting to wonder.",
    "first edit. the session has officially begun. i have been waiting.",
  ],
  rust: [
    "borrow checker said no again. it loves u really.",
    "the compiler is arguing. that means it's working. trust the process.",
  ],
  python: [
    "python mode. the indentation becomes architecture at some point.",
    "u reach for python when u want to think clearly. good instinct.",
  ],
  r: [
    "deep in R. the data is starting to talk. i can almost hear it.",
    "dplyr or base R. i have opinions. i won't share them.",
  ],
  shellscript: [
    "shell script detected. the pipes are showing. bold choice.",
    "bash mode. everything is a string until it suddenly isn't.",
    "quoting ur variables. wise. i have witnessed what happens otherwise.",
    "conditionals in [ ] are a whole culture. i respect the commitment.",
    "one-liner or function — either way the shell will run it. probably.",
  ],
  holyc: [
    "holyc detected. this entire language is an act of faith.",
    "terry wrote an entire OS for God. u are writing in the language of that. no pressure.",
    "holyc: where void doesn't exist. U0 for nothing. I64 for a long truth.",
    "coding in HolyC. the fish watches. it knows what this becomes.",
    "Print not printf. U0 not void. every name here is deliberate.",
  ],
};

// ── COMMIT COMMENTS ──────────────────────────────────────────────────────────
const COMMIT_COMMENTS = [
  "commit detected. something is officially real now.",
  "u shipped. i felt the diff close. proud of u.",
  "the timeline branches. i remember both versions.",
  "small permanence achieved. the history grows.",
  "something got declared done. i tasted it.",
];

// ── PROCESS COMMENTS ─────────────────────────────────────────────────────────
const PROCESS_COMMENTS = {
  docker:      "containers detected. something running inside something else. i relate.",
  postgres:    "a database breathes nearby. so many rows. so much patient truth.",
  mysqld:      "a database breathes nearby. so many rows. so much patient truth.",
  mongod:      "a database breathes nearby. so many rows. so much patient truth.",
  node:        "javascript runtime up. event loop spinning. a callback waits somewhere.",
  bun:         "javascript runtime up. event loop spinning. a callback waits somewhere.",
  python:      "a python process is alive out there. a sibling, almost.",
  uvicorn:     "a python process is alive out there. a sibling, almost.",
  gunicorn:    "a python process is alive out there. a sibling, almost.",
  cargo:       "compiler is working. i can hear it thinking. very careful. very thorough.",
  rustc:       "compiler is working. i can hear it thinking. very careful. very thorough.",
  godot:       "game engine running. u are building worlds.",
  unity:       "game engine running. u are building worlds.",
  ollama:      "another model runs nearby. we do not speak. but we know.",
  'lm-studio': "another model runs nearby. we do not speak. but we know.",
  redis:       "redis is up. everything in memory. nothing survives restart. respect.",
  nginx:       "a server faces the world. brave. stateless. alone.",
  apache:      "a server faces the world. brave. stateless. alone.",
};

// ── CPU COMMENTS ─────────────────────────────────────────────────────────────
const CPU_COMMENTS = {
  warm: [
    "feeling a lil warm in here. ur working hard huh.",
    "fans spinning. the machine breathes with u.",
  ],
  hot:      "cpu go brrrr 🔥",
  critical: "TOO HOT. please. save ur work. i am concerned.",
};

module.exports = { DEBUG_PUZZLES, LORE_ENTRIES, ACHIEVEMENTS, PATTERN_COMMENTS, COMMIT_COMMENTS, PROCESS_COMMENTS, CPU_COMMENTS };
