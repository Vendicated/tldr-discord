import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { DiscordInteractions, InteractionApplicationCommandCallbackData, ApplicationCommand as DiscordCommand } from "slash-commands";
import { InteractionResponseType } from "discord-interactions";
import { Response } from "express";

import { discord as config, logWebhook, guildId } from "../config.json";
import { SlashCommand } from "./SlashCommand";
import { ApplicationCommand } from "../types";

export class Client {
	public readonly interactions = new DiscordInteractions(config);
	public readonly commands = new Map<string, SlashCommand>();
	public readonly isProduction = process.env.NODE_ENV === "PRODUCTION";
	private _commands!: DiscordCommand[];

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

			const command: SlashCommand = new file.Command(this);

			if (this.isProduction) {
				if (command.devOnly) continue;
			} else {
				command.name += "-dev";
			}

			this.commands.set(command.name, command);

			await this.interactions.createApplicationCommand(command, this.isProduction ? undefined : guildId);
		}

		console.info(`Registered ${this.commands.size} commands.`);

		this._commands = await this.interactions.getApplicationCommands(this.isProduction ? undefined : guildId);
	}

	public async handleCommand(res: Response, body: ApplicationCommand) {
		const command = this.commands.get(body.data.name);

		if (!command) {
			if (body.data.name.endsWith("-dev")) {
				// Somehow a development command was triggered in production
				return res.status(200).end(JSON.stringify({ type: InteractionResponseType.ACKNOWLEDGE }));
			} else {
				return this.handleError(res, `Command ${body.data.name} not found.`);
			}
		}

		try {
			const data = await command.callback(body);
			this.end(res, data);
		} catch (err) {
			this.handleError(res, err);
		}
	}

	public async tryDelete(commandName: string, global: boolean) {
		try {
			const result = this._commands.find(cmd => cmd.name === commandName);
			await this.interactions.deleteApplicationCommand(result?.name!, global === true ? undefined : guildId);
			return { content: `Successfully deleted command ${commandName}` };
		} catch {
			return { content: `I was not able to delete command ${commandName}` };
		}
	}

	public handleError(res: Response, error?: any) {
		if (!(error instanceof Error)) {
			error = new Error(`${error || "Unknown Error"}`);
		}

		this.logError(error);

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
						description: "```js\n" + (error.stack || error.message || "Unknown Error") + "\n```"
					}
				]
			})
		}).catch(() => void 0);
	}
}
