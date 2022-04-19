import { Client, Interaction } from "discord.js";
import { BackendUtils } from "../backend/utils.js";
import { Handler } from "./handler.js";

export class InteractionSystem {
  private client: Client;
  private utils: BackendUtils;
  private commands: Map<string, Handler>;

  constructor(client: Client, utils: BackendUtils) {
    this.client = client;
    this.utils = utils;
    this.commands = new Map();
  }

  registerCommand(command: Handler) {
    this.commands.set(command.name, command);
  }

  handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply(
        ":x: An error has occured while getting the command handler."
      );
      return;
    }

    command.execute(this.client, this.utils, interaction);
  }
}
