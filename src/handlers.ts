/*
Vi leser github-webhooken for å kunne sende notifikasjoner i discord

Vi har tre funksjonaliteter:
  ping: Sjekker om pingen fra github fungerer, og vi får koblet oss opp mot Repository
  push: Lister commits, pusher navn, og sender meldingene videre, har satt en begrensing på 3000 karakterer
  pull: Sender notifikasjon om alt som faller under "PR Actions"

Skrevet av Lars-Even
*/

/*
Endring 2: Legge til sortering av branches, så den kun oppdaterer når det er endringer i main/master
*/

import { EmbedBuilder, type TextChannel } from "discord.js";

export async function handleGitHubEvent(
    channel: TextChannel,
    event: string | null,
    payload: any,
) {
    if (event === "ping") {
        const repoName = payload.repository?.full_name || "Unknown Repository";
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Github connection successfull")
            .setDescription(`Successfully connected to **${repoName}**`);
        await channel.send({ embeds: [embed] });
        return;
    }

    if (event === "push") {
        const ref = payload.ref || "";
        const isMainOrMaster = ref.endsWith("main") || ref.endsWith("master");

        if (!isMainOrMaster) {
            return;
        }

        const commitList = payload.commits
            .map((commit: any) => {
                const shortHash = commit.id.substring(0, 7);
                const firstLine = commit.message.split("\n")[0];
                return `[\`${shortHash}\`](${commit.url}) - ${firstLine}`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Ny Push til ${payload.repository.full_name}`)
            .setURL(payload.compare)
            .setDescription(
                `**${payload.pusher.name}** pushed ${payload.commits.length} commit(s)\n\n${commitList}`,
            )
            .addFields({
                name: "Siste Commit",
                value: `[${payload.head_commit?.message || "Ingen informasjon: "}](${payload.head_commit?.url})`,
            })
            .setTimestamp();
        if (embed.data.description && embed.data.description.length > 3000) {
            embed.setDescription(
                `**${payload.pusher.name}** pushet **${payload.commits.length} commit(s) \n\n` +
                    `[Listen er for lang. Trykk her for å se endringer](${payload.compare})`,
            );
        }

        await channel.send({ embeds: [embed] });
    } else if (event === "pull_request") {
        const action = payload.action;
        const pr = payload.pull_request;

        let title = `PR ${action}: #${pr.number}`;
        let color = 0xffa500;

        if (action === "closed" && pr.merged) {
            title = `PR Merged: #${pr.number}`;
            color = 0x00ff00;
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setURL(pr.html_url)
            .setDescription(pr.title)
            .setFooter({ text: payload.repository.full_name })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
}
