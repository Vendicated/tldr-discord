import { ApplicationCommandOption, ApplicationCommandOptionType, InteractionApplicationCommandCallbackData } from "slash-commands";
import { SlashCommand } from "../struct/SlashCommand";
import { ApplicationCommand } from "../types";
import { Client } from "../struct/Client";
import { guildId } from "../config.json";
export class Command extends SlashCommand {
	private client: Client;

	public name: string = "delete";
	public description: string = "Delete an interaction";
	public devonly = true;
	public options: ApplicationCommandOption[] | undefined = [
		{ name: "commandname", type: ApplicationCommandOptionType.STRING, description: "The command to delete" }
	];

	public constructor(client: Client) {
		super();
		this.client = client;
	}

	public async callback(command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData> {
		console.log(command);
		try {
			const name = command.data.options?.find(opt => opt.name === "commandname");

			const result = await this.client._commands.find(cmd => cmd.name === (name as any)?.value);

			if (!result) return { content: `Command \`${name}\` not found.` };

			await this.client.interactions.deleteApplicationCommand(result.id, guildId);

			return { content: `Successfully deleted command \`${result.name}\`` };
		} catch {
			return { content: `Sorry, I wasn't able to do that.` };
		}
	}
}
