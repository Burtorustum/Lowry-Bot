import {SlashCommandBuilder} from '@discordjs/builders';
import {ChatInputCommandInteraction, InteractionResponse, SlashCommandSubcommandsOnlyBuilder} from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
}
