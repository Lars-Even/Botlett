import type { Command } from "../types";

export const ping: Command = {
    name: "ping",
    description: "Pong!",
    execute: async (message) => {
        await message.reply("Pong!");
    },
};
