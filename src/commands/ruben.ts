import type { Command } from "../types";

export const ruben: Command = {
    name: "ruben",
    description: "gif",
    execute: async (message) => {
        const gifUrl =
            "https://media1.tenor.com/m/-SEMhJgNq-AAAAAC/ruben-vareide-ruben.gif";
        await message.reply(gifUrl);
    },
};
