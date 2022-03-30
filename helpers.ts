import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const addSpeaker = async () =>{
    
    await prisma.speaker.create({
        data:{
            id: '0',
            name: 'Sample name',
            standupId: '0',
            queuePosition: 1,
            spokeOut: false
        }
    })
};

export default addSpeaker;
