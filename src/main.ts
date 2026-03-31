import { Plugin, TFile } from "obsidian";
import { shouldPin } from "./rules";
import { AutoPinSettingTab } from "./settings";
import { AutoPinSettings, DEFAULT_SETTINGS, PinnableLeaf } from "./types";

export default class AutoPinPlugin extends Plugin {
  settings: AutoPinSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerEvent(
      this.app.workspace.on("file-open", (file: TFile | null) => {
        if (!file) return;
        if (!shouldPin(this.app, file, this.settings.rules)) return;

        const leaf = this.app.workspace.activeLeaf as PinnableLeaf | null;
        if (leaf && !leaf.pinned) {
          leaf.setPinned(true);
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
