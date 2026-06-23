# Locales

Visible LinkedIn section titles LinkOff matches against to hide UI, instead of
brittle HTML selectors. The extension finds an element by its text content (see
`findElementsByTextContent` in `../utils.js`) and hides one of its ancestors.

## Files

One JSON file per language, named by the **base language code** (`en.json`,
`fr.json`, …). `getLocaleTranslations()` reads `<html lang="...">` and loads the matching file — falling back
to `en.json`. A few names use LinkedIn's legacy codes (`in` Indonesian, `iw`
Hebrew) since that's what the `lang` attribute uses.

## Structure

Each key matches a popup checkbox `id`; its value is an **array of substrings**
of that section's on-screen title. An element matches if its text contains any
entry in the array (matched with `includes()`), so a section can have several
possible titles:

```json
{
  "hide-news": ["LinkedIn News"],
  "hide-premium": {
    "top": ["Retry Premium for", "Try Premium for"],
    "sidebar": ["Retry Premium for", "Try Premium for"]
  },
  "common": { "sidebar": "Sidebar" }
}
```

- `hide-premium` is nested because it has two targets (`top` nav prompt,
  `sidebar` card).
- `common` is not a hideable section: it holds reusable language strings that
  help locate elements — e.g. `common.sidebar` is the **aria-label** of the
  sidebar region, used to scope a search to that container (kept as a plain
  string since it's a selector, not a match list).
- An empty array (`[]`) means that language isn't translated yet.

`en.json` is canonical — copy its keys when adding a language.
