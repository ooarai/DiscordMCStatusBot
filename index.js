const { ActivityType, Client, Events, GatewayIntentBits } = require('discord.js');
const { token, ip, platform, mode } = require('./config.json');
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log(`[DISCORD] Logged in as ${c.user.tag}`);

  setInterval(() => {
    fetch(`https://api.mcstatus.io/v2/status/${platform}/${ip}`)
      .then(response => response.json())
      .then(data => {
        if (mode === "aternos") {
          const motdLowerCase = data.motd.clean.toLowerCase();
          const isOffline = motdLowerCase.includes('this server is offline.');

          if (isOffline) {
            client.user.setActivity('Offline', { type: ActivityType.Playing });
          } else {
            const onlineStatus = data.online ? `Online [${data.players.online}/${data.players.max}]` : 'Offline';
            client.user.setActivity(`${onlineStatus}`, { type: ActivityType.Playing });
          }
        } else if (mode === "normal") {
          const onlineStatus = data.online ? `Online [${data.players.online}/${data.players.max}]` : 'Offline';
          client.user.setActivity(`${onlineStatus}`, { type: ActivityType.Playing });
        } else {
          console.log(`[ERROR] Invalid "mode" value in config.json: ${mode}`);
        }
      })
      .catch(error => console.log(error));

    console.log('[REQUEST] Request made');
  }, 10000); // Interval of request and status update of the bot in milliseconds
});

client.login(token);
