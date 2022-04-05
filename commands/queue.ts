import DiscordJS, {ButtonInteraction, Intents, MessageActionRow, MessageButton, MessageButtonStyleResolvable} from 'discord.js';
import { ICommand } from 'wokcommands';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const emojiRepresentationForNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

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


const enqueueById = async (
    components: (DiscordJS.MessageActionRow | (Required<DiscordJS.BaseMessageComponentOptions> & DiscordJS.MessageActionRowOptions))[],
    userId: string,
    userName: string,
    queuePositing: number,
    customId: string
    ) =>{
    const allSpeaker = await prisma.speaker.findMany();


    let positionAlreadyTaken = false;

    allSpeaker.forEach(speaker=>{
        if (speaker.queuePosition === queuePositing){
            positionAlreadyTaken = true;
        };
    })

    const currentUser = await prisma.speaker.findUnique({
        where: {
          id: userId,
        },
      })


    if (!positionAlreadyTaken){



    await prisma.speaker.update({
        where: {
            id: userId,
        },
        data: {
            queuePosition: queuePositing,
        },
      })
    let i = 0; 

    for (i; i< components.length; i++){
        // @ts-ignore
        if (customId === components[i].components[0].customId){
            // @ts-ignore
            components[i].components[0].label = userName;
             // @ts-ignore
            components[i].components[0].style = 'SUCCESS';
        }
    }
    return true;
}
return false;
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
    
    const isStatusChecked = await prisma.standup.findUnique({
      where: {
        id: '0',
      },
    });
    if (!isStatusChecked!.statusChecked){
      interaction.reply({
        content: 'Сначала вым нужно выполнить команду /statsCheck'
      })
    }

    if (isStatusChecked!.statusChecked) {
      console.log(isStatusChecked!.statusChecked);

        allSpeaker.forEach((speaker, index)=>{
            addButton(componentsColumn , `queue_placeholder_${index}`,emojiRepresentationForNumbers[index], `здесь могли бы быть вы`, 'SECONDARY');
          });

      await interaction.reply({
        content: 'Выбор порядка выступления',
        components: componentsColumn,
      });

      const collector = channel.createMessageComponentCollector({
        max: 100,
        time: 1000 * 120
      });

      collector.on('collect', async (i: ButtonInteraction)=>{
        const currentUser = await prisma.speaker.findUnique({
          where: {
            id: i.user.id,
          }
        });

        if (currentUser!.queuePosition !== 0){
          await i.reply({
            content: `Вы уже выбрали свою очередь`, 
            ephemeral: true
          });
        }else{

        const successEnqued = await enqueueById(
            componentsColumn,
            i.user.id,
            i.user.username,
            (Number(i.customId.split('_')[2])+1),
            i.customId
            );
        if (successEnqued){
        await i.reply({
            content: `Вы выбрали выступать ${Number(i.customId.split('_')[2])+1}`, 
            ephemeral: true
          });
          await interaction.editReply({
            content: `edited reply`, 
            components: componentsColumn,
          });
        }else{
          await i.reply({
            content: `Другой пользователь уже занял это место !`, 
            ephemeral: true
          });
        }
      }
      });

      collector.on('end', async (collection)=>{
        await interaction.deleteReply();
      });
    }
  }
} as ICommand;