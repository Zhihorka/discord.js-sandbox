import DiscordJS, {Intents} from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client'

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
        console.log('lets look into ');
        console.log(allStandups);
}


client.on('ready', async ()=>{
    console.log('The bot is ready');
    console.log('lets get all server members');
    // const Guilds = client.guilds.cache.map(guild => guild.id);
    // console.log(Guilds);
    const guild = client.guilds.cache.get('957371843218649148');
    guild!.members.cache.forEach(member => console.log(member.user)); 
    // console.log(guild!.members);

    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: ['957371843218649148'],
    })
});



testPrisma();
client.login(process.env.TOKEN);