import { MessageActionRow, MessageButton } from "discord.js";
import { ICommand } from "wokcommands";



export default {
    category: 'Testing',
    description: 'Testing',

    slash: true,
    testOnly: true,

    callback: async ({ interaction, channel }) =>{
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('yes_option')
            .setEmoji('😊')
            .setLabel('confirm')
            .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('no_option')
            .setEmoji('😔')
            .setLabel('decline')
            .setStyle('DANGER')
        )

        await interaction.reply({
            content: 'Are you sure?',
            components: [row],
        })
    }
    
} as ICommand;
