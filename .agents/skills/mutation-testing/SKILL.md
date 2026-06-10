---
name: mutation-testing
description: Use when analysing mutation test results to identify test coverage gaps and recommend tests to write. Use after running mutation tests, or when improving test quality before a refactor.
---

# Mutation Testing Analysis

## Overview

Use mutation testing results as the control signal for test coverage quality. After running Stryker, read the summary report, distinguish actionable survivors from equivalent mutants, then recommend the minimal tests that kill the most survivors. The goal is not 100% mutation score, but ensuring that the logic being refactored is meaningfully covered.

## When to Use

- Before refactoring a file — verify tests cover the target logic.
- After writing new tests — confirm they kill the intended mutants.
- When a mutation score is lower than expected and you need to know why.

Do not use this skill for deciding which files to refactor. Use `code_health_review` for that.

## Quick Reference

- `npm run mutate:report` — runs Stryker and writes `reports/mutation/mutation-summary.md`
- `npm run mutate` — runs Stryker only (no summary extraction)
- Summary format: per-file scores + one entry per actionable survivor with original vs mutant

## Implementation

1. Run `npm run mutate:report` to execute mutation tests and generate the summary.
2. Read `reports/mutation/mutation-summary.md`.
3. For each file with survivors, group them by the underlying coverage gap (e.g. "path never triggered", "boundary not tested", "second call never made").
4. For each group, identify the minimal test that would kill all mutants in the group. One well-designed test often kills 3–6 related survivors.
5. Identify survivors that are genuinely equivalent — mutations that cannot be killed without changing observable behaviour. State clearly why each is equivalent.
6. Write the recommended tests, then re-run `npm run mutate:report` to confirm the score improved.
7. Stop when the remaining survivors are all equivalent, or the user explicitly accepts the gap.

## Common Mistakes

- Treating every survivor as actionable — many are equivalent (fast-path checks, console.log strings, initial values immediately overwritten).
- Writing one test per mutant instead of grouping related mutants and killing them together.
- Declaring coverage sufficient after writing tests without re-running mutation tests to verify the survivors are actually killed.
- Writing tests that pass with the mutation — verify the mutant is killed, not just that the test runs.
- Reporting a low score without explaining which survivors are equivalent vs killable.
