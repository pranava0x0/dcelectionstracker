# CLAUDE.md — Universal Development Principles

> Distilled from patterns across multiple projects. Apply universally; skip sections irrelevant to the current project type.

---

## Agent Workflow: Explore → Plan → Code → Verify

Never blindly write code. Always follow this loop:

1. **Explore** — Search the codebase. Find relevant files, understand existing patterns before touching anything.
2. **Plan** — Assess the blast radius (how many files touched, how long it takes). For significant changes, present 2–3 high-level approaches with pros/cons and ask for human approval before writing code.
3. **Code** — Implement following the rules below.
4. **Verify** — Run tests. Fix all failures before declaring the task complete.

**Read before edit:** Always read a file before editing it, even if it was read earlier in the conversation.

**Ask for options first.** On non-trivial tasks, propose approaches before writing code. The human needs to evaluate options — don't assume the first plausible approach is the right one.

---

## Communication Style

- **Concise output.** No filler, no apologies, no moralizing. Skip generic advice.
- **Show your work.** Use short internal monologues to break down complex problems.
- **Fail loud.** Never use catch-all exception handlers that silently swallow errors. Always raise or log explicitly.

---

## Architecture Principles

- **No over-engineering.** Only make changes directly requested or clearly necessary. Keep solutions simple.
- **Single source of truth.** Constants, configs, and shared types derive from one place.
- **Modular design.** Separate concerns: data fetching, processing, storage, and presentation are distinct layers.
- **Idempotent operations.** Re-running any operation should be safe and produce the same result. Use `INSERT OR IGNORE` patterns, cache checks, or deduplication by unique key.
- **Static when possible.** Prefer baked-in data over runtime backends when the data update cycle allows it.
- **Cost-optimized.** Stay on free tiers and use the cheapest resources that meet requirements.
- **CLI-first.** Build CLI entry points before UI. Agents can invoke CLIs directly to self-validate output, closing the feedback loop without human intervention.
- **Minimize page weight and request count.** Audit total payload size and number of requests. Content-focused sites should be lightweight — aim for fewest requests and smallest payload possible.
- **Tree-shake and code-split.** Don't bundle every controller/feature for every page. Use code-splitting and lazy loading so pages only load the code they actually need.
- **Benchmark against best-in-class.** Compare your site/app against well-optimized reference points. If the simplest site in your org is orders of magnitude lighter, your build process needs review.
- **Document subsystems.** Maintain a `docs/` folder with notes on non-obvious subsystems, design decisions, and correct CLI invocations. One line of documentation prevents repeated mistakes.

---

## Error Resilience

- **Never let a single item failure crash the pipeline.** Wrap individual record processing in try/except. Log and continue.
- **Log aggressively.** Every request, parse, API call, cache hit/miss, and filter decision should be logged.
- **Cache everything.** Re-runs should be fast and cheap. Multi-layer caching where appropriate.
- **Validate everything.** Invalid responses from external services → log and skip, never crash.
- **Track errors visibly.** Use an `issues.md` file or errors array — failures must be visible, not silent.

---

## Security & Credential Handling

- **Never commit secrets.** API keys, tokens, and passwords must never appear in committed code.
- Read credentials from environment variables only (e.g., `os.environ["API_KEY"]`). Halt with a clear error if missing.
- Never log or print credential values.
- Always `.gitignore`: `.env`, `.env.local`, `credentials.json`, `secrets/`, `node_modules/`, `__pycache__/`, `dist/`, `*.pyc`.
- Before committing: `git diff --cached | grep -iE "apikey|password|token|secret"`.
- **Before pushing to a remote**, audit the full commit history for leaked secrets: `git log --all -p | grep -iE "sk-|apikey|password|token|secret|DATABASE_URL|AUTH_SECRET"`. If secrets are found, remove with `git filter-repo` or BFG Repo-Cleaner before pushing. **Never push to GitHub without verifying the entire history is clean.**
- **Respect user privacy choices.** Don't circumvent ad blockers or privacy tools by proxying tracking SDKs through your own domain. This erodes user trust.

---

## Testing & Validation

- **Write tests alongside code, not as an afterthought.** Every new module or bug fix includes corresponding tests.
- Write a regression test for every bug fix.
- Validate output data against expected schemas before writing to disk.
- **Cover edge cases, not just happy paths:**
  - Empty input: `[]`, `{}`, `""`
  - Null/undefined for every optional field
  - Boundary values (first/last page, exact date boundaries, zero counts)
  - Combined states (e.g., multiple filters active simultaneously)
- Run the full test suite before committing to catch regressions.
- **Never ship test files to production.** Ensure build pipelines exclude test files, dev fixtures, and debug artifacts from production bundles. Use build exclusions and CI checks to enforce this.

---

## Git Discipline

- **Commit often** at natural checkpoints — small, focused commits over large monolithic ones.
  - After each new module/feature is built
  - After fixing a bug or resolving a failing test
  - After updating documentation
- Write descriptive commit messages explaining *what* and *why*.
- Never commit large binary files, downloaded data, or API keys.

---

## Data Handling

- **Append-only data.** Append new records rather than overwriting. Deduplicate via unique keys.
- **Source attribution.** Every data record must include its origin (source URL, connector name, etc.). Users must be able to trace data back to its source.
- **Defensive optional field handling.** Null-check every optional field before rendering or processing.
- Null values show explicit placeholders ("N/A", "TBD", "Value TBD") — never blank UI elements or missing fields.

---

## Issue Tracking (`issues.md`)

Maintain `issues.md` in the project root. **Update it on every bug encounter and fix.**

- Log bugs to the **Active Issues** table with: ID, date, area, description, severity (critical/high/medium/low), size (S/M/L), root cause (**code bug** vs. **test bug**), and status.
- When fixed: remove from Active, add a one-line entry to **Resolved Summary** with the fix commit hash.
- Keep the file under token limits — never let Active grow past ~20 rows.
- After every bug fix, check whether a new regression test is needed.

---

## Backlog (`backlog.md`)

Maintain a `backlog.md` for ideas, features, and enhancements.

- Add items to the **Active Backlog** table with: ID, feature, priority, complexity (simple/moderate/complex), size (S/M/L/XL), impact statement, and status.
- When shipped: remove from Active, add a one-line entry to **Shipped Summary** with the commit/PR.
- Keep the file under token limits — never let Active grow past ~20 rows.

---

## Python Standards

*(Apply when the project uses Python)*

- Type hints on all functions.
- Use `pathlib.Path` for file paths.
- Use the `logging` module — no bare `print` for runtime output.
- All constants in a single config module.
- Pin dependencies in `requirements.txt`.
- Use Pydantic for data validation.
- Python 3.9+ compatible unless specified otherwise.

---

## Frontend Standards

*(Apply when the project has a web frontend)*

- Functional components + hooks only. No class components.
- Colors, enums, and constants in a dedicated constants file — never hardcoded inline.
- Data transforms belong in hooks or utility functions, not in components.
- Proper loading, error, and empty states on every view.
- All interactive elements must have visible focus indicators for accessibility.
- **Mobile-first responsive design.** All features must work on both mobile and desktop.
- Use TypeScript strict mode when the project uses TypeScript. No `any` types.
- **Deduplicate image assets.** Serve each image exactly once. Use `<picture>` with `srcset` so the browser selects the best format (AVIF > WebP > PNG) rather than downloading all variants.
- **Serve optimized image formats.** Always use an image CDN or optimization pipeline. Never serve uncompressed PNGs for content images in production.
- **Only load libraries used on the page.** Don't let backend-only dependencies leak into read-only frontend pages.
- **Write descriptive `alt` attributes.** Every content image needs meaningful alt text for accessibility — never leave `alt=""`.
- **Use responsive CSS, not duplicate DOM trees.** Handle mobile/desktop layouts with CSS media queries — never render the same content twice in the DOM.
- **Touch targets must be at least 44px.** Every tappable element on a touch device needs a minimum 44×44px hit area.
- **Respect safe area insets.** Account for notch/dynamic island/home indicator on iOS — use `env(safe-area-inset-*)` where content would otherwise be clipped.

---

## Network Ethics & Rate Limiting

*(Apply when the project fetches from external sources)*

- Minimum 1.5–2s delay between requests to any single host.
- Set an informative `User-Agent` header.
- Handle 429 responses with exponential backoff (start at 10s).
- Cache all fetched content to disk. Re-runs should never re-download already-cached content.
- If a service persistently blocks after retries, log to `issues.md` and gracefully skip. Never crash.
- Start small when testing scrapers — validate against a handful of pages before scaling to full runs.
- **Use an image CDN or optimization pipeline.** Never serve raw, uncompressed images directly from object storage. Compress and convert to modern formats (WebP/AVIF) before delivery.

---

## AI/API Cost Optimization

*(Apply when the project uses LLM APIs)*

- Use the cheapest model that meets quality requirements by default (e.g., Haiku before Opus).
- Apply keyword pre-filtering to skip irrelevant content before sending to expensive APIs.
- Truncate/excerpt input text to reduce token usage.
- Cache API responses by content hash. Never re-classify identical content.
- Log cost impact at each optimization layer. Print a cost summary at the end of each run.
- `--dry-run` and `--fetch-only` modes must work without an API key.

---

## Working with AI Agents

*Meta-principles for getting the most out of AI-assisted development.*

- **Context engineering over prompt engineering.** Fill the context window with exactly what's needed — no more, no less. Watch for three failure modes: *context poisoning* (early errors that compound), *context distraction* (irrelevant content that buries what matters), and *context clash* (contradictory instructions).
- **Start fresh on topic switches.** Use `/clear` when moving to an unrelated problem. Long mixed-topic contexts degrade quality. Break complex tasks into small steps and commit between them.
- **AI has no taste.** Actively review output for: excessive try/catch blocks, unnecessary abstractions, code bloat instead of refactoring, and poor judgment on simplicity vs. structure. These are recurring failure modes that require human correction.
- **AI is a tool, not a substitute for engineering discipline.** Always apply fundamentals to AI-generated code: performance auditing, bundle analysis, code review, and optimization passes. High LOC output is meaningless if the code is bloated, duplicated, and unoptimized. Shipping fast doesn't mean shipping well.
- **Closed-loop validation.** Build projects so the agent can compile, lint, run tests, and verify its own output without human intervention. When the agent can close the loop itself, you can trust the result.
- **Read local framework docs before writing code.** Your training data may be stale. When working with a framework that could have breaking changes (especially if the project pins a recent major version), read the local docs in `node_modules/*/dist/docs/` or the project's own `docs/` before writing anything. Heed deprecation notices.
- **Keep this file current.** When something unexpected happens — a pattern that failed, a correct CLI invocation, a library quirk — add a concise note here. This file should grow incrementally as organizational scar tissue, not be rewritten from scratch.
- **Write big plans to files.** For large tasks, write the spec to a `docs/` markdown file and review it before executing. This persists context across sessions and allows a second-opinion review before building.
- **Sweep for orphaned wrapper shells after every commit / push.** Bash `run_in_background` calls that wrap long-running data refreshes — especially polling-loop wrappers like `until ps -p $(pgrep -f "...") >/dev/null; do sleep N; done` — can outlive the process they were watching. Once the watched PID exits, `pgrep` returns empty, `$(pgrep)` is `""`, `ps -p ""` always fails, and the `until` loop can never resolve, so the wrapper shell sleeps forever. Run `pgrep -fl "<project-path>"` (or check `jobs -l`) before declaring a session done; `kill` any lingering wrappers. Two design fixes: (1) prefer the `Monitor` tool over inline `until`+`sleep` polling — `Monitor` cleans up when its body exits; (2) if you must use Bash, invert the test to `while pgrep -f "..."; do sleep N; done` so the loop exits *when* the process disappears, instead of the unsatisfiable `until ps -p $(pgrep)` shape.

---

## Design System (`design.md`)

*(Apply when the project has a non-trivial visual UI)*

- Maintain `design.md` as the single source of truth for visual design decisions.
- All color tokens, typography rules, spacing scales, component patterns, and layout principles live here.
- **Update `design.md` before writing UI code** when adding new components or changing visual patterns. Reference it to ensure consistency.
- When the project has a data-dense analytical aesthetic, document that explicitly — it affects component density, whitespace, and color choices throughout.

---

## Writing & Long-Form Drafting

*(Apply when the project involves essays, reports, policy documents, or any extended prose)*

### Before you write

- **Build a style corpus first.** Feed the AI 15–20 of your best existing pieces and ask it to generate a style guide. Tiago Forte extracted an 8,000-word style guide this way; it becomes the system prompt for every subsequent writing session. Without this, AI defaults to generic prose and sands off your voice.
- **Get the lay of the land before drafting.** Upload everything relevant to the domain — papers, sources, prior notes — and query the AI to build your mental model first. Dwarkesh Patel does this before every interview: "I really can't ask good questions unless I have a good mental model of what's going on." Writing is the same: understand the territory before putting words down.
- **Use AI gaps as a signal.** Where the AI gives weak or hedged answers is often where the interesting questions live. If Claude can't give you a crisp answer on something, that's usually worth exploring — either it's genuinely contested, or you need a primary source rather than a synthesis.
- **Outline before drafting.** Get AI to build and challenge the structure before any prose is written. Structural problems caught at the outline stage cost nothing to fix; structural problems caught after a full draft cost everything.

### During writing

- **Co-write, don't ghost-write.** AI should draft sections you direct, not produce a piece you lightly edit. The human's judgment and voice must be present in every paragraph. As one practitioner put it: "you must ultimately do some writing yourself to think and write well."
- **Write in passes, not in one shot.** A single top-to-bottom generation will be mediocre. Work section by section with full context in the window. First pass: structure. Second pass: argument and voice. Third pass: compression and flow.
- **Paste complete sections, not fragments.** AI performs best when it can see the full scene, chapter, or argument. A paragraph handed over in isolation gets polished in a vacuum — AI can't feel the rhythm of what comes before and after.
- **Brainstorm before drafting.** When starting any piece, ask AI to generate too many angles, framings, and counterarguments — then you prune. Starting with a draft skips the ideation phase where the best ideas often come from.
- **The first response is a draft, not a product.** Always iterate. Karpathy's rule applies here: AI is jagged — it may nail the macro argument and mangle a key sentence in the same pass. The second and third outputs are always better than the first.

### Voice and quality

- **Protect your voice explicitly.** After every AI draft pass, instruct: "Keep the imperfections that make this sound human. Don't over-polish." AI naturally sands off idiosyncrasy in pursuit of clarity. Push back.
- **Use objective instructions, not subjective ones.** "Cut this by 200 words" works. "Make this more engaging" doesn't — subjective words are open to AI interpretation and produce mush. Be specific: word counts, sentence lengths, structural moves.
- **Ask Claude to be critical.** AI's default is agreeableness. Explicitly ask: "What's the weakest part of this argument?" or "Play devil's advocate on this claim." Without the prompt, you will not get genuine pushback.
- **AI excels at compression.** Paste a 2,000-word draft and ask for 1,200 words while preserving flow, rhythm, and voice. This is one of the highest-leverage uses: compression forces clarity and Claude is very good at it.

### Structure and editing

- **Diagnose before editing.** When handing over a draft, ask Claude to "tell me what this piece is really about and where it loses energy or focus" before touching a word. Structural problems (wrong argument order, buried lede, missing transitions) must be fixed before sentence-level editing begins.
- **Check consistency before publishing.** Ask Claude to review the full draft for contradictions, repeated points, and factual claims that need verification. It catches internal inconsistencies faster than a human read-through.
- **When stuck on a passage, request alternatives.** Don't struggle alone — ask for three different phrasings of the same idea. Seeing the options breaks the block and usually produces something better than what you were reaching for.

### Context management for long documents

- **Context engineering is the craft.** Karpathy's principle applies directly to writing: "the delicate art and science of filling the context window with just the right information." For a long essay, that means feeding the AI your style guide, the outline, the relevant research, and the specific section you're working on — not the whole 10,000-word draft every time.
- **Break long projects into sessions with explicit handoffs.** At the end of each session, write a summary of decisions made (argument choices, structural choices, tone decisions) and paste it at the top of the next session. Without this, AI re-derives context and drifts.
- **Use `/clear` between distinct pieces.** Don't let the context from one essay bleed into the next. Mixed-topic contexts produce averaged-out, generic prose.

### The writer's discipline

- **AI acceleration requires stronger editorial judgment, not less.** Karpathy notes that high LOC output is meaningless if the code is bloated — the same is true for prose. Faster drafting means more reviewing, not less. The bottleneck shifts from production to judgment.
- **Strong notes compound.** Dwarkesh Patel and Andy Matuschak both emphasize that ideas developed through writing — not just reading — compound over time. Use AI to accelerate drafting and synthesis, but the thinking itself still requires the writer.
