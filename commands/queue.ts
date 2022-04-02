import DiscordJS, {ButtonInteraction, Intents, MessageActionRow, MessageButton, MessageButtonStyleResolvable} from 'discord.js';
import { ICommand } from 'wokcommands';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const emojiRepresentationForNumbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

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
        
        allSpeaker.forEach((speaker, index)=>{
            addButton(componentsColumn , `queue_placeholder_${index}`,emojiRepresentationForNumbers[index], `здесь могли бы быть вы`, 'SECONDARY');
          });

      await interaction.reply({
        content: 'Выбор порядка выступления',
        components: componentsColumn,
      });
      }

      const collector = channel.createMessageComponentCollector({
        max: 100,
        time: 1000 * 60
      });

      collector.on('collect', async (i: ButtonInteraction)=>{
        console.log(`buttin with id ${i.customId} is clicked by ${i.user.id}`);
        enqueueById(
            componentsColumn,
            i.user.id,
            i.user.username,
            Number(i.customId.split('_')[2]+1),
            i.customId
            );
        await i.reply({
            content: `Вы выбрали выступать ${Number(i.customId.split('_')[2]+1)}`, 
            ephemeral: true
          });
          await interaction.editReply({
            content: `edited reply`, 
            components: componentsColumn,
          });
      });

      collector.on('end', async (collection)=>{

      });
  }
} as ICommand;