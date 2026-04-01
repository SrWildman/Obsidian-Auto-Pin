import { MarkdownView, Plugin, WorkspaceLeaf } from "obsidian";
import { shouldPin } from "./rules";
import { AutoPinSettingTab } from "./settings";
import { AutoPinSettings, DEFAULT_SETTINGS, PinnableLeaf } from "./types";

export default class AutoPinPlugin extends Plugin {
  settings: AutoPinSettings = DEFAULT_SETTINGS;
  private deduping = false;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf: WorkspaceLeaf | null) => {
        if (!leaf || this.deduping) return;

        const file = (leaf.view as MarkdownView)?.file;
        if (!file) return;
        if (!shouldPin(this.app, file, this.settings.rules)) return;

        let existingPinned: PinnableLeaf | null = null;
        this.app.workspace.iterateAllLeaves((other) => {
          const otherPinnable = other as PinnableLeaf;
          if (
            other !== leaf &&
            otherPinnable.pinned &&
            (other.view as MarkdownView)?.file?.path === file.path
          ) {
            existingPinned = otherPinnable;
          }
        });

        if (existingPinned) {
          this.deduping = true;
          this.app.workspace.setActiveLeaf(existingPinned);
          setTimeout(() => {
            leaf.detach();
            this.deduping = false;
          }, 150);
        } else if (!(leaf as PinnableLeaf).pinned) {
          (leaf as PinnableLeaf).setPinned(true);
        }
      })
    );

    this.addSettingTab(new AutoPinSettingTab(this.app, this));
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
