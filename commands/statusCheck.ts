import DiscordJS, {ButtonInteraction, Intents, MessageActionRow, MessageButton, MessageButtonStyleResolvable} from 'discord.js';
import { ICommand } from 'wokcommands';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const addButton = (
    components: (DiscordJS.MessageActionRow | (Required<DiscordJS.BaseMessageComponentOptions> & DiscordJS.MessageActionRowOptions))[],
    customId: string,
    emoji: string,
    label: string,
    style: MessageButtonStyleResolvable,
    disable: boolean
    ) =>{
  const row = new MessageActionRow()

    row.addComponents(
      new MessageButton()
      .setCustomId(customId)
      .setEmoji(emoji)
      .setLabel(label)
      .setStyle(style)
      .setDisabled(disable)
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
  description: 'Сheck the readiness of the speakers',
  
  slash: true,
  testOnly: true,
  
  callback: async ({ interaction, channel }) => {
    const allSpeaker = await prisma.speaker.findMany();

    let componentsColumn: (DiscordJS.MessageActionRow | (Required<DiscordJS.BaseMessageComponentOptions> & DiscordJS.MessageActionRowOptions))[] = [];

    if (interaction) {

      allSpeaker.forEach((speaker)=>{
        addButton(componentsColumn , speaker.id,'❓', speaker.name, 'SECONDARY', true);
      })
      
      addButton(componentsColumn , `accept_meeting`,'', `подтвердить свое участие`, 'SECONDARY', false);

      await interaction.reply({
        content: '0/'+String(allSpeaker.length)+' пользователей подтвердило участие',
        components: componentsColumn,
      });
      }

      const collector = channel.createMessageComponentCollector({
        max: 10,
        time: 1000 * 20
      });

      collector.on('collect', async (i: ButtonInteraction)=>{
        componentsColumn.forEach((component)=>{
          // @ts-ignore
          if (component.components[0].customId === i.user.id){
            // @ts-ignore
            component.components[0].style = 'SUCCESS'
            // @ts-ignore
            component.components[0].emoji = { name: '✅' }
          }

        });
        const currentUser = await prisma.speaker.findUnique({
          where: {
            id: i.user.id,
          }
        });

        if (currentUser!.accepted){
          await i.reply({
            content: `Ваше участие уже подтверждено!`,
            ephemeral: true
          });
        }else{



        await prisma.speaker.update({
          where: {
              id: i.user.id,
          },
          data: {
              accepted: true,
          },
        });
          const acceptedUser = await prisma.speaker.findMany({
            where: {
              accepted: true,
            },
          });
          await interaction.editReply({
            content: String(acceptedUser.length)+'/'+String(allSpeaker.length)+' пользователей подтвердило участие',
            components: componentsColumn,
          });

          await i.reply({
            content: `Вы подтвердили свое участие`,
            ephemeral: true
          });
        }
      });

      collector.on('end', async (collection)=>{
        await prisma.standup.update({
          where: {
              id: '0',
          },
          data: {
              statusChecked: true,
          },
        });
        await interaction.deleteReply();
      });
  }
} as ICommand;