import type { Command } from "../types";

export const anja: Command = {
    name: "anja",
    description: "scheisse",
    execute: async (message) => {
        const gifUrl =
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWxjdDkwaXRnbXZpanRtY2EweDZid3BlcW85NWw5Y3E0cml5eTY1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G32Bcxd304dmlcKdFS/giphy.gif";
        await message.reply(gifUrl);
    },
};
