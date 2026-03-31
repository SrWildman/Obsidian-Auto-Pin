import { App, TFile } from "obsidian";
import { PinRule, RuleType } from "./types";

function getTodaysDailyNotePath(app: App): string | null {
  // @ts-expect-error - internalPlugins is not in the public API
  const dailyNotes = app.internalPlugins?.getPluginById("daily-notes");
  if (!dailyNotes?.enabled) return null;

  const config = dailyNotes.instance?.options;
  const folder = config?.folder?.replace(/\/+$/, "") ?? "";
  const format = config?.format || "YYYY-MM-DD";
  const today = window.moment().format(format);

  return folder ? `${folder}/${today}.md` : `${today}.md`;
}

function matchesPathPattern(filePath: string, pattern: string): boolean {
  const regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]")
    .replace(/{{GLOBSTAR}}/g, ".*");

  return new RegExp(`^${regex}$`).test(filePath);
}

export function shouldPin(
  app: App,
  file: TFile,
  rules: PinRule[]
): boolean {
  for (const rule of rules) {
    if (!rule.enabled) continue;

    switch (rule.type) {
      case RuleType.DailyNote: {
        const dailyPath = getTodaysDailyNotePath(app);
        if (dailyPath && file.path === dailyPath) return true;
        break;
      }
      case RuleType.PathPattern: {
        if (rule.pattern && matchesPathPattern(file.path, rule.pattern)) return true;
        break;
      }
      case RuleType.ExactPath: {
        if (rule.path && file.path === rule.path) return true;
        break;
      }
      case RuleType.Frontmatter: {
        if (rule.property) {
          const cache = app.metadataCache.getFileCache(file);
          const frontmatter = cache?.frontmatter;
          if (!frontmatter) break;

          const actual = frontmatter[rule.property];
          if (rule.value === undefined || rule.value === "") {
            if (actual !== undefined) return true;
          } else if (String(actual) === rule.value) {
            return true;
          }
        }
        break;
      }
    }
  }

  return false;
}
