import {
  CacheType,
  Client,
  CommandInteraction,
  MessageEmbed,
} from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { Constants } from "twisted";
import { AnalyzedQueriesDTOs } from "../../backend/dto/AnalyzedQueryDTO.js";
import { BackendUtils } from "../../backend/utils.js";
import { Handler } from "../handler.js";

function createErrorEmbed(message: string) {
  return new MessageEmbed()
    .setColor("#ED254E")
    .setTitle(`:boom: An error occured!`)
    .setDescription(message);
}

function createSummonerEmbed(summoner: AnalyzedQueriesDTOs.AnalyzedSnapshot) {
  let championPoolString = "";

  for (let i = 0; i < summoner.championPool.length; i++) {
    const champion = summoner.championPool[i];

    championPoolString += `${i + 1}. ${champion.championName} (${(
      (champion.used / summoner.participants.length) *
      100
    ).toFixed(2)}% used / ${((champion.wins / champion.used) * 100).toFixed(
      2
    )}% Winrate)\n`;
  }

  const fields = [
    {
      name: ":rosette: Level",
      value: `➤ ${summoner.summonerLevel.toString()}`,
      inline: false,
    },
    {
      name: `:golf: Championpool`,
      value: championPoolString || "Loading Data...",
      inline: true,
    },
  ];

  return new MessageEmbed()
    .setColor("#F9DC5C")
    .setTitle(`${summoner.clashPosition} | ${summoner.summonerName}`)
    .setThumbnail(
      `https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/${summoner.summonerIconId}.png`
    )
    .setDescription(``)
    .setFooter({
      text: "Analyzed by Acrys",
      iconURL: "https://cdn.lexlab.duckdns.org/moron/logo.png",
    })
    .setTimestamp()
    .addFields(fields);
}

export const clashHandler: Handler = {
  name: "clash",
  description: "Analysiert ein Clash Team.",
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING.valueOf(),
      name: "name",
      description: "Der Name eines Spielers",
      required: true,
    },
    {
      type: ApplicationCommandOptionTypes.INTEGER.valueOf(),
      name: "depth",
      description: "Die Anzahl an Matches, die abgerufen werden",
      required: false,
    },
  ],
  execute: async function (
    client: Client<boolean>,
    utils: BackendUtils,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply();

    const search = interaction.options.getString("name");
    const depth = interaction.options.getInteger("depth");

    if (!(search && depth)) {
      interaction.editReply({
        embeds: [createErrorEmbed("Invalid input!")],
      });
      return;
    }

    const response = await utils.requestQuery({
      search,
      depth,
      region: Constants.Regions.EU_WEST,
      type: "CLASH",
    });

    const onUpdate = (data: AnalyzedQueriesDTOs.AnalyzedQuery) => {
      const embeds: MessageEmbed[] = [];

      for (let i = 0; i < data.snapshots.length; i++) {
        embeds.push(createSummonerEmbed(data.snapshots[i]));
      }

      interaction.editReply({
        embeds,
        content: ":satellite: Retrieving information...\n",
      });
    };

    const onComplete = (data: AnalyzedQueriesDTOs.AnalyzedQuery) => {
      const embeds: MessageEmbed[] = [];

      for (let i = 0; i < data.snapshots.length; i++) {
        embeds.push(createSummonerEmbed(data.snapshots[i]));
      }

      interaction.editReply({
        embeds,
        content: ":white_check_mark: Done!",
      });
    };

    const source = utils.getQueryStream(response.queryId, onUpdate, onComplete);
  },
};
