import { App, PluginSettingTab, Setting } from "obsidian";
import type AutoPinPlugin from "./main";
import { PinRule, RuleType } from "./types";

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  [RuleType.DailyNote]: "Today's daily note",
  [RuleType.PathPattern]: "Path pattern",
  [RuleType.ExactPath]: "Exact path",
  [RuleType.Frontmatter]: "Frontmatter property",
};

const RULE_TYPE_DESCRIPTIONS: Record<RuleType, string> = {
  [RuleType.DailyNote]: "Pins today's daily note whenever it's opened.",
  [RuleType.PathPattern]:
    "Pins files matching a glob pattern (e.g. Projects/*.md, **/*.canvas).",
  [RuleType.ExactPath]: "Pins a specific file by its exact vault path.",
  [RuleType.Frontmatter]:
    "Pins files where a frontmatter property matches a value.",
};

function createDefaultRule(type: RuleType): PinRule {
  const rule: PinRule = { type, enabled: true };

  switch (type) {
    case RuleType.PathPattern:
      rule.pattern = "";
      break;
    case RuleType.ExactPath:
      rule.path = "";
      break;
    case RuleType.Frontmatter:
      rule.property = "";
      rule.value = "";
      break;
  }

  return rule;
}

export class AutoPinSettingTab extends PluginSettingTab {
  plugin: AutoPinPlugin;

  constructor(app: App, plugin: AutoPinPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    let selectedType = RuleType.DailyNote;

    new Setting(containerEl)
      .setName("Add rule")
      .setDesc("Add a new auto-pin rule.")
      .addDropdown((dropdown) => {
        for (const type of Object.values(RuleType)) {
          dropdown.addOption(type, RULE_TYPE_LABELS[type]);
        }
        dropdown.onChange((value: string) => {
          selectedType = value as RuleType;
        });
      })
      .addButton((button) => {
        button.setButtonText("Add").onClick(async () => {
          this.plugin.settings.rules.push(createDefaultRule(selectedType));
          await this.plugin.saveSettings();
          this.display();
        });
      });

    containerEl.createEl("hr");

    const rules = this.plugin.settings.rules;
    for (let i = 0; i < rules.length; i++) {
      this.renderRule(containerEl, rules[i], i);
    }
  }

  private renderRule(containerEl: HTMLElement, rule: PinRule, index: number): void {
    new Setting(containerEl)
      .setName(RULE_TYPE_LABELS[rule.type])
      .setDesc(RULE_TYPE_DESCRIPTIONS[rule.type])
      .addToggle((toggle) => {
        toggle.setValue(rule.enabled).onChange(async (value) => {
          rule.enabled = value;
          await this.plugin.saveSettings();
        });
      })
      .addButton((button) => {
        button
          .setIcon("trash")
          .setWarning()
          .onClick(async () => {
            this.plugin.settings.rules.splice(index, 1);
            await this.plugin.saveSettings();
            this.display();
          });
      });

    switch (rule.type) {
      case RuleType.PathPattern:
        new Setting(containerEl).setName("Pattern").addText((text) => {
          text
            .setPlaceholder("Daily/*.md")
            .setValue(rule.pattern ?? "")
            .onChange(async (value) => {
              rule.pattern = value;
              await this.plugin.saveSettings();
            });
        });
        break;

      case RuleType.ExactPath:
        new Setting(containerEl).setName("File path").addText((text) => {
          text
            .setPlaceholder("Todo.md")
            .setValue(rule.path ?? "")
            .onChange(async (value) => {
              rule.path = value;
              await this.plugin.saveSettings();
            });
        });
        break;

      case RuleType.Frontmatter:
        new Setting(containerEl).setName("Property").addText((text) => {
          text
            .setPlaceholder("Pinned")
            .setValue(rule.property ?? "")
            .onChange(async (value) => {
              rule.property = value;
              await this.plugin.saveSettings();
            });
        });
        new Setting(containerEl)
          .setName("Value")
          .setDesc("Leave empty to match any value.")
          .addText((text) => {
            text
              .setPlaceholder("True")
              .setValue(rule.value ?? "")
              .onChange(async (value) => {
                rule.value = value;
                await this.plugin.saveSettings();
              });
          });
        break;
    }

    if (index < this.plugin.settings.rules.length - 1) {
      containerEl.createEl("hr");
    }
  }
}
