# Auto Pin

An [Obsidian](https://obsidian.md) plugin that automatically pins tabs based on configurable rules.

## Rules

| Rule Type | Description |
|-----------|-------------|
| **Today's daily note** | Pins today's daily note whenever it's opened. Reads your daily notes folder and date format from Obsidian's core settings. |
| **Path pattern** | Pins files matching a glob pattern (e.g. `Projects/*.md`, `**/*.canvas`). |
| **Exact path** | Pins a specific file by its vault path (e.g. `TODO.md`). |
| **Frontmatter property** | Pins files where a frontmatter property matches a value (e.g. `pinned: true`). Leave value empty to match any value. |

Rules are evaluated in order. The tab is pinned if any enabled rule matches.

## Installation

### From Obsidian Community Plugins

1. Open Settings > Community Plugins
2. Search for "Auto Pin"
3. Install and enable

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/samwildman/obsidian-auto-pin/releases)
2. Create a folder `.obsidian/plugins/auto-pin/` in your vault
3. Copy both files into that folder
4. Reload Obsidian and enable "Auto Pin" in Community Plugins

## Configuration

Go to Settings > Auto Pin to manage your rules. The plugin ships with one default rule: pin today's daily note.

## Notes

- The plugin uses Obsidian's internal `setPinned` API, which is not part of the public type definitions. This is stable and widely used by plugins, but could theoretically break in a future Obsidian update.
- The daily note rule reads your configured daily notes folder and date format, so it works with custom setups.
- Path patterns support `*` (single segment) and `**` (any depth) wildcards.
