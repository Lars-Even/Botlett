/*

1. Vi logger inn discord-botten
2. Bruker bun.Serve for å sette opp en enkel HTTP-Server
3. Videresender all data til handleGitHubEvent.


Vi sorterer enkelt informasjonen vi har og sender den til discord kanalen lagt inn i .env

Skrevet av Lars-Even
*/

import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    type TextChannel,
    Events,
} from "discord.js";

import { verifySignature } from "./security";
import { handleGitHubEvent } from "./handlers";
import { handlePrefixCommand } from "./commandHandler";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const DISCORD_TOKEN = Bun.env.DISCORD_TOKEN;
const CHANNEL_ID = Bun.env.DISCORD_CHANNEL_ID;
const PORT = 1337;
const PREFIX = "!";

if (!DISCORD_TOKEN) {
    console.error("Mangler DISCORD_TOKEN");
}

if (!CHANNEL_ID) {
    console.error("Mangler CHANNEL_ID");
}

client.login(DISCORD_TOKEN);

client.once(Events.MessageCreate, (message) => {
    handlePrefixCommand(message, PREFIX);
});

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${client.user?.tag}`);
    console.log(`Server listening on port ${PORT}`);
});

Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/github-webhook") {
            try {
                const rawBody = await req.text();

                const isSafe = await verifySignature(req, rawBody);
                if (!isSafe) {
                    console.log("Blocked");
                    return new Response("Unauthorized", { status: 401 });
                }

                const payload = JSON.parse(rawBody);
                const eventType = req.headers.get("x-github-event");

                if (CHANNEL_ID) {
                    const channel = (await client.channels.fetch(
                        CHANNEL_ID,
                    )) as TextChannel;
                    if (channel) handleGitHubEvent(channel, eventType, payload);
                }

                return new Response("Webhook received", { status: 200 });
            } catch (error) {
                console.error(error);
                return new Response("Error", { status: 500 });
            }
        }
        return new Response("Not Found", { status: 404 });
    },
});
