import { type Message } from "discord.js";
import { type Command } from "./types";

/*IMPORTER COMMANDS HER*/

const commands = new Map<string, Command>();

/*COMMAND EKSEMPEL
commands.set(ping.name, ping)
*/

export async function handlePrefixCommand(message: Message, prefix: string) {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Error: ${commandName}`, error);
        await message.reply("Problem med kommando pls fix sir");
    }
}
