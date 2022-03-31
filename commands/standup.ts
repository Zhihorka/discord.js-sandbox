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
  intents: [ Intents.FLAGS.GUILDS,
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
      
      allSpeaker.forEach((speaker, index)=>{
        console.log(componentsColumn, `accept_for_userId_${speaker.id}`,'❓', `${speaker.name}, подтвердите свое присутствие`, 'SECONDARY');
        addButton(componentsColumn , `accept_for_userId_${speaker.id}`,'❓', `${speaker.name}, подтвердите свое присутствие`, 'SECONDARY');
      });

      await interaction.reply({
        content: 'Here is buttons',
        components: componentsColumn
      });
      }

      const filter = (interaction: ButtonInteraction) =>{
        return interaction.user.id === interaction.user.id;
      }

      const collector = channel.createMessageComponentCollector({
        max: allSpeaker.length,
        time: 1000 * 5
      });

      collector.on('collect', (i: ButtonInteraction)=>{
        i.reply({
          content: 'You clicked a button',
        })
      });

      collector.on('end', async (collection)=>{
        collection.forEach((click)=>{
          console.log(click.user.id, click.customId);
        });

        if (collection.first()?.customId ===`accept_for_userId_${interaction.user.id}`){
            console.log('you accepted meeting !');
            // TODO: use as CustomInterface instead of @ts-ignore
            // @ts-ignore
            const currentUser = componentsColumn.filter(component => component.components[0]?.customId.split('_')[3] === interaction.user.id);
             // @ts-ignore
            componentsColumn = componentsColumn.filter(component => component.components[0]?.customId.split('_')[3] !== interaction.user.id);
            // addButton(componentsColumn , `accept_for_userId_${speaker.id}`,'❓', `${speaker.name}, подтвердите свое присутствие`, 'SECONDARY');
            // @ts-ignore
            console.log('interaction.user.id is :')
            console.log(interaction.user.id);
            console.log('currentUser is :')
              // @ts-ignore
            console.log(currentUser[0].components[0]);
            // console.log(componentsColumn, `accept_for_userId_${speaker.id}`,'❓', `${speaker.name}, подтвердите свое присутствие`, 'SECONDARY');
            // @ts-ignore
            addButton(componentsColumn, currentUser[0].components[0]?.customId, '✅', `${currentUser[0].components[0]?.label.split(',')[0]} подтвердил участие`, 'SUCCESS');
        }else{
          console.log('you cant accept someone elses meeting !');
        }


        await interaction.editReply({
          content: 'action has already been taken.',
          components: componentsColumn,
        });
      });
  }
} as ICommand;