import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import { ICommand } from "wokcommands";

const numbersRepresentationInEmoji = ['0️⃣','1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

const timeActions = {
    increase_by_one_hours_decimal: 'increase_by_one_hours_decimal',
    increase_by_one_hours_digit: 'increase_by_one_hours_digit',
    increase_by_one_minutes_decimal: 'increase_by_one_minutes_decimal',
    increase_by_one_minutes_digit: 'increase_by_one_minutes_digit',
    decrease_by_one_hours_decimal: 'decrease_by_one_hours_decimal',
    decrease_by_one_hours_digit: 'decrease_by_one_hours_digit',
    decrease_by_one_minutes_decimal: 'decrease_by_one_minutes_decimal',
    decrease_by_one_minutes_digit: 'decrease_by_one_minutes_digit'
};

const convertNumeralsToEmoji = (numeral : number) =>{
    if (numeral > 9 || numeral < 0){
        return '';
    }
    return numbersRepresentationInEmoji[numeral];
}


const timeChangeHandler = (
    hoursDecimal: number,
    hoursDigit: number,
    minutesDecimal: number,
    minutesDigit: number,
    topControlsRow: MessageActionRow,
    middleInformationRow: MessageActionRow,
    bottomControlsRow: MessageActionRow,
    buttonCustomId: string,

     ) =>{
        if (buttonCustomId === timeActions.increase_by_one_hours_decimal){
            if (hoursDecimal < 2){
                hoursDecimal++;
            }
            topControlsRow.components.forEach((button)=>{
                if (button.customId === timeActions.increase_by_one_hours_decimal){
                    // @ts-ignore
                    button.style = 'SUCCESS'
                }
            })
        }else if (buttonCustomId === timeActions.increase_by_one_hours_digit){
            
        }else if (buttonCustomId === timeActions.increase_by_one_minutes_decimal){
            
        }else if (buttonCustomId === timeActions.increase_by_one_minutes_digit){
            
        }else if (buttonCustomId === timeActions.decrease_by_one_hours_decimal){
            
        }else if (buttonCustomId === timeActions.decrease_by_one_hours_digit){
            
        }else if (buttonCustomId === timeActions.decrease_by_one_minutes_decimal){
            
        }else if (buttonCustomId === timeActions.decrease_by_one_minutes_digit){
            
        }
};

export default {
    category: 'Testing',
    description: 'Update time of meeting',

    slash: true,
    testOnly: true,

    callback: async ({ interaction, channel }) =>{
        let hoursDecimal: number = 0;
        let hoursDigit: number = 0;
        let minutesDecimal: number = 0;
        let minutesDigit: number = 0;

        if (interaction) {

        const topControlsRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('increase_by_one_hours_decimal')
            .setEmoji('⬆️')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('increase_by_one_hours_digit')
            .setEmoji('⬆️')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('top_decorative_button')
            .setEmoji('🕒')
            .setLabel('')
            .setStyle('SECONDARY')
            .setDisabled(true)
        )
        .addComponents(
            new MessageButton()
            .setCustomId('increase_by_one_minutes_decimal')
            .setEmoji('⬆️')
            .setLabel(' ')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('increase_by_one_minutes_digit')
            .setEmoji('⬆️')
            .setLabel('')
            .setStyle('SECONDARY')
        )

        const middleInformationRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('hours_decimal_value')
            .setEmoji('0️⃣')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('hours_digit_value')
            .setEmoji('0️⃣')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('separator_decorative_button')
            .setEmoji('')
            .setLabel(':')
            .setStyle('SECONDARY')
            .setDisabled(true)
        )
        .addComponents(
            new MessageButton()
            .setCustomId('minutes_decimal_value')
            .setEmoji('0️⃣')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('minutes_digit_value')
            .setEmoji('0️⃣')
            .setLabel('')
            .setStyle('SECONDARY')
        )


        const bottomControlsRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('decrease_by_one_hours_decimal')
            .setEmoji('⬇️')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('decrease_by_one_hours_digit')
            .setEmoji('⬇️')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('bottom_decorative_button')
            .setEmoji('ℹ️')
            .setLabel('')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('decrease_by_one_minutes_decimal')
            .setEmoji('⬇️')
            .setLabel(' ')
            .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('decrease_by_one_minutes_digit')
            .setEmoji('⬇️')
            .setLabel('')
            .setStyle('SECONDARY')
        )

        await interaction.reply({
            content: 'Установите новое время',
            components: [topControlsRow, middleInformationRow, bottomControlsRow],
        });

        const collector = channel.createMessageComponentCollector({
            max: 999,
            time: 1000 * 999
        });


        collector.on('collect', async (buttonInteraction: ButtonInteraction)=>{
            timeChangeHandler(hoursDecimal,
                hoursDigit,
                minutesDecimal,
                minutesDigit,
                topControlsRow,
                middleInformationRow,
                bottomControlsRow,
                buttonInteraction.customId
                );
            interaction.editReply({
                content:  `Вы нажали на ${buttonInteraction.customId}`,
                components: [topControlsRow, middleInformationRow, bottomControlsRow],
            });
            buttonInteraction.deferReply();
            buttonInteraction.deleteReply();
        });

    }
    }
    
} as ICommand;
