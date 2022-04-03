import DiscordJS, {Intents} from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client'
import { addPotentialSpeakers, addStandup } from './helpers';

const prisma = new PrismaClient()


const client = new DiscordJS.Client({
    intents: [ Intents.FLAGS.GUILDS,
         Intents.FLAGS.GUILD_MESSAGES, 
         Intents.FLAGS.GUILD_MEMBERS,
         Intents.FLAGS.GUILD_PRESENCES
        ],
})

const testPrisma = async () => {
        const allStandups = await prisma.speaker.findMany();
}


client.on('ready', async ()=>{
    // addStandup();
    // addPotentialSpeakers(client);
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['957371843218649148'],
    })
});



testPrisma();
client.login(process.env.TOKEN);