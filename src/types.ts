import { WorkspaceLeaf } from "obsidian";

export enum RuleType {
  DailyNote = "daily-note",
  PathPattern = "path-pattern",
  ExactPath = "exact-path",
  Frontmatter = "frontmatter",
}

export interface PinRule {
  type: RuleType;
  enabled: boolean;
  pattern?: string;
  path?: string;
  property?: string;
  value?: string;
}

export interface AutoPinSettings {
  rules: PinRule[];
}

export const DEFAULT_SETTINGS: AutoPinSettings = {
  rules: [
    {
      type: RuleType.DailyNote,
      enabled: true,
    },
  ],
};

export interface PinnableLeaf extends WorkspaceLeaf {
  pinned: boolean;
  setPinned(pinned: boolean): void;
}
