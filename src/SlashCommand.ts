import {SlashCommandBuilder} from '@discordjs/builders';
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
}

export interface SelectSlashCommand extends SlashCommand {
  update: (interaction: SelectMenuInteraction) => Promise<any>;
  customId: string;
}

export interface Autocomplete {
  autocomplete: (interaction: AutocompleteInteraction) => Promise<any>;
}

export interface Modal {
  handleResponse: (interaction: ModalSubmitInteraction) => Promise<any>;
  customId: string;
}
