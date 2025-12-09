import { type Message } from "discord.js";
import { type Command } from "./types";

/*IMPORTER COMMANDS HER*/
import { ping } from "./commands/ping";
import { ruben } from "./commands/ruben";
import { anja } from "./commands/anja";

const commands = new Map<string, Command>();

/*COMMAND EKSEMPEL
commands.set(ping.name, ping)
*/

commands.set(ping.name, ping);
commands.set(ruben.name, ruben);
commands.set(anja.name, anja);

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
