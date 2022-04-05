import DiscordJS from 'discord.js';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const addStandup = async () =>{
    
    const today = new Date().toISOString().split('T');
    

    await prisma.standup.create({
        data:{
            id: '0',
            statusChecked: false,
            queued: false,
            date: new Date(today[0]+'T13:30')
        }
    });
};

export const addSpeaker = async (
    id: string,
     name: string, 
     standupId: string,
     queuePosition: number,
     accepted: boolean,
     spokeOut: boolean
      ) =>{
    
    await prisma.speaker.create({
        data:{
            id: id,
            name: name,
            standupId: standupId,
            queuePosition: queuePosition,
            accepted: accepted,
            spokeOut: spokeOut
        }
    })
};

export const addPotentialSpeakers = async (client: DiscordJS.Client<boolean>)=>{
    const guild = await client.guilds.cache.get('957371843218649148');
    guild!.members.cache.forEach((member) => {
        if (member.user.bot === false){
        addSpeaker(member.user.id, member.user.username, '0', 0 , false , false);
        }
    }); 
}

export const standupMaster = () =>{
    
}