import DiscordJS, {Intents} from 'discord.js';
import { ICommand } from 'wokcommands'
const client = new DiscordJS.Client({
  intents: [ Intents.FLAGS.GUILDS,
       Intents.FLAGS.GUILD_MESSAGES, 
       Intents.FLAGS.GUILD_MEMBERS,
       Intents.FLAGS.GUILD_PRESENCES
      ],
})
import { addPotentialSpeakers, addStandup } from '../helpers';

export default {
  category: 'Testing',
  description: 'Schedule a meeting',
  
  slash: true,
  testOnly: true,
  
  callback: async ({ interaction }) => {
    if (interaction) {
        await addStandup();
        await addPotentialSpeakers(client);
    }
  }
} as ICommand;