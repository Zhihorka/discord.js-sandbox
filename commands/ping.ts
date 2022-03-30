import { ICommand } from 'wokcommands'

export default {
  category: 'Testing', // Required for slash commands
  description: 'A simple ping pong command', // Required for slash commands
  
  slash: true,
  testOnly: true, // Ensure you have test servers setup, see the below paragraph
  
  callback: ({ interaction }) => {
    // The interaction property will be undefined if the command is
    // ran as a legacy command. It is encouraged to check if 'message' or
    // 'interaction' exists before interacting with it.
    if (interaction) {
      interaction.reply({
        content: 'pong'
      })
    }
  }
} as ICommand