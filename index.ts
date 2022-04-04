import DiscordJS, {Intents} from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
const cron = require('node-cron');
dotenv.config();

import { PrismaClient } from '@prisma/client'
import { addPotentialSpeakers, addStandup, standupMaster } from './helpers';

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
    // await addStandup();
    // await addPotentialSpeakers(client);
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['957371843218649148'],
    });
});



testPrisma();
client.login(process.env.TOKEN);