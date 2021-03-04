import { ApplicationCommandOption, ApplicationCommandOptionType, InteractionApplicationCommandCallbackData } from "slash-commands";
import { SlashCommand } from "../struct/SlashCommand";
import { ApplicationCommand } from "../types";
import { Client } from "../struct/Client";

export class Command extends SlashCommand {
	private client: Client;

	public name: string = "delete";
	public description: string = "Delete an interaction";
	public devOnly = true;
	public options: ApplicationCommandOption[] | undefined = [
		{ name: "commandname", type: ApplicationCommandOptionType.STRING, description: "The command to delete" },
		{ name: "global", type: ApplicationCommandOptionType.BOOLEAN, description: "Whether the target command is global", default: false, required: false }
	];

	public constructor(client: Client) {
		super();
		this.client = client;
	}

	public async callback(command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData> {
		const name = this.getOption<string>(command, "commandname");
		const global = this.getOption<boolean>(command, "global");

		return this.client.tryDelete(name, global);
	}
}
