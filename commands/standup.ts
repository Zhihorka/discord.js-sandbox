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
      
      allSpeaker.forEach((speaker)=>{
        addButton(componentsColumn , `accept_for_userId_${speaker.id}`,'❓', `${speaker.name}, подтвердите свое присутствие`, 'SECONDARY');
      });

      await interaction.reply({
        content: 'Initialize unaccepted buttons',
        components: componentsColumn
      });
      }

      const collector = channel.createMessageComponentCollector({
        max: 2,
        time: 1000 * 20
      });

      collector.on('collect', async (i: ButtonInteraction)=>{
          console.log(`you accepted meeting by ${i.user.id}`);
          console.log(`the clicked button is ${i.customId}`);
          if (i.user.id === i.customId.split('_')[3]){
          // TODO: use as CustomInterface instead of @ts-ignore
          // @ts-ignore
          const currentUser = componentsColumn.filter(component => component.components[0]?.customId.split('_')[3] === interaction.user.id);
           // @ts-ignore
          componentsColumn = componentsColumn.filter(component => component.components[0]?.customId.split('_')[3] !== i.user.id);
          // @ts-ignore
          addButton(componentsColumn, currentUser[0].components[0]?.customId, '✅', `${currentUser[0].components[0]?.label.split(',')[0]} подтвердил участие`, 'SUCCESS');
          await interaction.editReply({
            content: 'Someone click on button',
            components: componentsColumn
          });
        }

      });

      collector.on('end', async (collection)=>{
        // collection.forEach((click)=>{
        //   console.log(click.user.id, click.customId);
        // });

        await interaction.editReply({
          content: 'the end of 10 sec.',
          components: componentsColumn,
        });
      });
  }
} as ICommand;