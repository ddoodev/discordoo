import { AppCommandOptionChoiceData } from "@src/api";

export class MixinChoicesAutocomplete {
  public choices?: AppCommandOptionChoiceData[];
  public autocomplete?: boolean;

  public setChoices(choices: AppCommandOptionChoiceData[]): this {
    this.choices = choices;
    return this;
  }

  public addChoice(choice: AppCommandOptionChoiceData): this {
    this.choices ??= [];
    this.choices.push(choice);
    return this;
  }

  public addChoices(...choices: AppCommandOptionChoiceData[]): this {
    this.choices ??= [];
    this.choices.push(...choices);
    return this;
  }

  public setAutocomplete(autocomplete: boolean): this {
    this.autocomplete = autocomplete;
    return this;
  }
}
