import { ApplicationCommandOption, InteractionApplicationCommandCallbackData } from "slash-commands";
import { SlashCommand } from "../struct/SlashCommand";
import { ApplicationCommand } from "../types";
import { discord } from "../config.json";

export class Command extends SlashCommand {
	public name: string = "invite";
	public description: string = "Get my invite link";
	public devOnly: boolean = false;

	public options: ApplicationCommandOption[] | undefined;

	public async callback(_command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData> {
		return {
			content: `https://discord.com/api/oauth2/authorize?client_id=${discord.applicationId}&scope=applications.commands`
		};
	}
}
