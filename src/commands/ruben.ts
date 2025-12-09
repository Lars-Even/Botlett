import type { Command } from "../types";

export const ruben: Command = {
    name: "ruben",
    description: "gif",
    execute: async (message) => {
        const gifUrl =
            "https://tenor.com/view/ruben-vareide-ruben-vareide-prebz-og-dennis-prebz-gif-26529878";
        await message.reply(gifUrl);
    },
};
