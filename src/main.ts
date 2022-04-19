import { Logger } from "tslog";
import { config as env } from "dotenv";
import { Client, Intents } from "discord.js";
import { InteractionSystem } from "./interaction/interactionHandler.js";
import { BackendUtils } from "./backend/utils.js";
import { clashHandler } from "./interaction/handlers/clashHandler.js";

env();

const logger = new Logger({
  displayFunctionName: false,
  displayLoggerName: false,
});

async function bootstrap() {
  logger.info("Starting bot...");

  if (!process.env.BACKEND_PATH) {
    logger.fatal("Kein BACKEND_PATH gefunden!");
    return;
  }

  const lolUtils = new BackendUtils(process.env.BACKEND_PATH);

  const bot = new Client({ intents: Intents.FLAGS.GUILDS });

  const interactionSystem = new InteractionSystem(bot, lolUtils);

  interactionSystem.registerCommand(clashHandler);

  bot.on("interactionCreate", (interaction) =>
    interactionSystem.handleInteraction(interaction)
  );

  bot.on("error", (error) => {
    logger.error(error);
  });

  process.on("SIGINT", () => {
    logger.info("Stopping bot...");
    bot.destroy();
  });

  try {
    await bot.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    logger.fatal(e);
  }
}

bootstrap();
