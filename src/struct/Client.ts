import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { DiscordInteractions, InteractionApplicationCommandCallbackData } from "slash-commands";
import { InteractionResponseType } from "discord-interactions";
import { Response } from "express";

import { discord as config, logWebhook } from "../config.json";
import { SlashCommand } from "./SlashCommand";
import { ApplicationCommand } from "../types";

export class Client {
	public readonly interactions = new DiscordInteractions(config);
	public readonly commands = new Map<string, SlashCommand>();

	public constructor() {
		this.initCommands();
	}

	public async end(res: Response, data: InteractionApplicationCommandCallbackData) {
		res.status(200).end(JSON.stringify({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data }));
	}

	public async initCommands() {
		const commandPath = path.join(__dirname, "..", "commands");
		for await (const filename of await fs.readdir(commandPath)) {
			const file = await import(path.join(commandPath, filename));

			const command: SlashCommand = new file.Command();

			this.commands.set(command.name, command);

			await this.interactions.createApplicationCommand(command);
		}

		console.info(`Registered ${this.commands.size} commands.`);
	}

	public async handleCommand(res: Response, body: ApplicationCommand) {
		const command = this.commands.get(body.data.name);

		if (!command) return this.handleError(res, `Command ${body.data.name} not found.`);

		try {
			const data = await command.callback(body);
			this.end(res, data);
		} catch (err) {
			this.handleError(res, err);
		}
	}

	public handleError(res: Response, error?: any) {
		if (!(error instanceof Error)) {
			error = new Error(`${error || "Unknown Error"}`);
		}

		const content = "I'm sorry, an error occurred: " + `${error.message}`;

		this.end(res, { content });
	}

	public logError(error: Error) {
		console.error(error);

		fetch(logWebhook, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				username: "tldr-discord",
				embeds: [
					{
						color: 0xff073a,
						title: error.name,
						description: "```js\n" + error.stack || error.message || "Unknown Error" + "\n```"
					}
				]
			})
		}).catch(() => void 0);
	}
}
