import DiscordJS, {
  ButtonInteraction,
  Intents,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
} from "discord.js";
import { ICommand } from "wokcommands";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

import { addPotentialSpeakers, addSpeaker, addStandup } from "../helpers";

export default {
  category: "Testing",
  description: "The standup will start at the scheduled time",

  slash: true,
  testOnly: true,

  callback: async ({ interaction, channel }) => {
    const speakers = await prisma.speaker.findMany();

    const queuedSpeakers: any[] = [];
    let index = 0;
    for (let i = 1; i < 10; i++) {
      speakers.forEach((speaker) => {
        if (speaker?.queuePosition === i) {
          queuedSpeakers.push(speaker);
        }
      });
    }

    let componentsColumn: (
      | DiscordJS.MessageActionRow
      | (Required<DiscordJS.BaseMessageComponentOptions> &
          DiscordJS.MessageActionRowOptions)
    )[] = [];

    const passToNextButton = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('pass_to_next_user')
        .setEmoji('➡️')
        .setLabel('Передать следующему')
        .setStyle('SECONDARY')
    )

    componentsColumn.push(passToNextButton);

    if (interaction) {
      if (index + 1 === queuedSpeakers.length) {
        await interaction.reply({
          content: `Заканчивает стендап ${queuedSpeakers[index].name}`,
          components: componentsColumn, 
        });
      } else if (index + 1 === queuedSpeakers.length - 1) {
        await interaction.reply({
          content: `Сейчас выступает ${queuedSpeakers[index].name}, ${
            queuedSpeakers[index + 1].name
          } замыкает стендап`,
          components: componentsColumn
        });
      } else {
        await interaction.reply({
          content: `Сейчас выступает ${queuedSpeakers[index].name}, ${
            queuedSpeakers[index + 1].name
          } готовится`,
          components: componentsColumn,
        });
      }

      const collector = channel.createMessageComponentCollector({
        max: 99,
        time: 1000 * 120,
      });

      collector.on("collect", async (i: ButtonInteraction) => {
          if (i.user.id === queuedSpeakers[index].id){
              index++;
              if (index=== queuedSpeakers.length-1){
              await interaction.editReply({
                content: `Заканчивает стендап ${queuedSpeakers[index].name}`,
              });
            }else if (index=== queuedSpeakers.length-2){
                await interaction.editReply({
                    content: `Сейчас выступает ${queuedSpeakers[index].name}, ${
                      queuedSpeakers[index + 1].name
                    } замыкает стендап`,
                    components: componentsColumn
                  });
            }else{
                await interaction.editReply({
                    content: `Сейчас выступает ${queuedSpeakers[index].name}, ${
                      queuedSpeakers[index + 1].name
                    } готовится`,
                    components: componentsColumn,
                  });
            }
            await i.reply({
                content: `Вы передали слово следующему выступающему`,
                ephemeral: true
              });
          }
      });

      collector.on("end", async (collection) => {
        await interaction.deleteReply();
      });
    }
  },
} as ICommand;
