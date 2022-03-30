import { ICommand } from 'wokcommands'
import addSpeaker from '../helpers';

export default {
  category: 'Testing', 
  description: 'Test command for addSpeaker',
  
  slash: true,
  testOnly: true,
  
  callback: ({ interaction }) => {
    if (interaction) {
        addSpeaker();
    }
  }
} as ICommand