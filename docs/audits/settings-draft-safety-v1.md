# Settings Draft Safety v1

**Date:** 2026-08-19  
**Related:** KI leftover after page decomposition (autosave clobbering unsaved Settings draft).

## Old bug

`useSettingsDraft` kept a full `AppSettings` snapshot and synced it with:

```ts
useEffect(() => { setLocal(settings); }, [settings]);
```

Autosave (theme, sidebar, sleep, body map) wrote to the store, the effect replaced `local`, and any unsaved draft fields were lost.

Explicit Save also did `saveSettings({ ...local, enableSleepTracking: storeValue })`, which could roll back a theme/sidebar change that happened after the page opened.

## New state model

| Layer | What | Persistence |
|-------|------|-------------|
| Persisted | Zustand `settings` / MySQL | Immediate |
| Autosave | theme, sidebar visibility, sleep tracking, body-map regenerate | Immediate via `getState()` |
| Draft-owned | goals, hero, avatar, nutrition, weeks, coins, XP, habits | Local until Save |
| Transient | `saving`, `dirtyKeys` | Memory |

Draft-owned keys: `SETTINGS_DRAFT_OWNED_KEYS` in `src/utils/settingsDraftMerge.ts`.

Autosave call sites use `useAppStore.getState()` so they do not spread a stale render snapshot.

## Dirty merge

When persisted settings change:

```
next = { ...persisted }
for key of dirtyKeys: next[key] = draft[key]
```

Pristine draft-owned fields follow the store. Dirty fields keep the user's value. Autosave fields are never dirty in this set.

## Save merge

```
persisted = getState().settings
payload = mergePersistedIntoDraft({ persisted, draft, dirtyKeys })
saveSettings(payload)
clear dirtyKeys
```

Theme/sidebar/sleep changes made while the draft was open stay on the saved object.

Save with empty dirty keys writes the current persisted object (button stays enabled — same UX).

## Tests

`src/utils/settingsDraftMerge.test.ts` — cases A–H (theme/sidebar/sleep autosave, save overlay, pristine/dirty external updates, empty dirty).

Playwright: existing settings autosave + architecture smoke + draft-weight vs theme autosave.

No Settings navigation leave-guard existed before this pass; none was added (no new browser `beforeunload` dialogs). Reset buttons still only reset XP / coins / avatar defaults after confirm.
