import DiscordJS, {ButtonInteraction, Intents, MessageActionRow, MessageButton, MessageButtonStyleResolvable} from 'discord.js';
import { ICommand } from 'wokcommands';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const addButton = (
    components: (DiscordJS.MessageActionRow | (Required<DiscordJS.BaseMessageComponentOptions> & DiscordJS.MessageActionRowOptions))[],
    customId: string,
    emoji: string,
    label: string,
    style: MessageButtonStyleResolvable
    ) =>{
  const row = new MessageActionRow()

    row.addComponents(
      new MessageButton()
      .setCustomId(customId)
      .setEmoji(emoji)
      .setLabel(label)
      .setStyle(style)
    )

    components.push(row);
}


const client = new DiscordJS.Client({
  intents: [ 
       Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES, 
       Intents.FLAGS.GUILD_MEMBERS,
       Intents.FLAGS.GUILD_PRESENCES
      ],
})

import { addPotentialSpeakers, addSpeaker, addStandup } from '../helpers';

export default {
  category: 'Testing',
  description: 'Schedule a meeting',
  
  slash: true,
  testOnly: true,
  
  callback: async ({ interaction, channel }) => {
    const allSpeaker = await prisma.speaker.findMany();

    let componentsColumn: (DiscordJS.MessageActionRow | (Required<DiscordJS.BaseMessageComponentOptions> & DiscordJS.MessageActionRowOptions))[] = [];

    if (interaction) {
      
      addButton(componentsColumn , `accept_meeting`,'❓', `подтвердите свое учатие в стендапе`, 'SECONDARY');

      await interaction.reply({
        content: 'Initialize unaccepted buttons',
        components: componentsColumn,
        ephemeral: true,
      });
      }

      const collector = channel.createMessageComponentCollector({
        max: 10,
        time: 1000 * 20
      });

      collector.on('collect', async (i: ButtonInteraction)=>{
          await interaction.editReply({
            content: `the button is clicked by user with id  ${i.user.id}`,
            components: componentsColumn,
          });
      });

      collector.on('end', async (collection)=>{

        await interaction.editReply({
          content: 'the end of 10 sec.',
          components: componentsColumn,
        });
      });
  }
} as ICommand;