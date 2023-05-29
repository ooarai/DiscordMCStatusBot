const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { ActivityType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`[DISCORD] Logged in as ${c.user.tag}`);

  setInterval(() => {
    fetch('https://api.mcstatus.io/v2/status/java/YOUR_SERVER_ADRESS_HERE') // Replace "java" with "bedrock" if your server is on Bedrock
      .then(response => response.json())
      .then(data => {
        const onlineStatus = data.online ? `Online [${data.players.online}/${data.players.max}]` : 'Offline';
        client.user.setActivity(`${onlineStatus}`, { type: ActivityType.Playing });
      })
      .catch(error => console.log(error));

    console.log('[REQUEST] Request made');
  }, 2000); // Interval of request and status update of the bot in milliseconds
});

client.login(token);
