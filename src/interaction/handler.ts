import { Client, CommandInteraction } from "discord.js";
import { APIApplicationCommandOption } from "discord-api-types/v9";
import { BackendUtils } from "../backend/utils.js";

export interface Handler {
  name: string;
  description?: string;
  options?: APIApplicationCommandOption[];
  execute: (
    client: Client,
    utils: BackendUtils,
    interaction: CommandInteraction
  ) => void;
}
