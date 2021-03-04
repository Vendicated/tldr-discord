import { ApplicationCommandOption, InteractionApplicationCommandCallbackData } from "slash-commands";
import { SlashCommand } from "../struct/SlashCommand";
import { ApplicationCommand } from "../types";

export class Command extends SlashCommand {
	public name: string = "error";
	public description: string = "Test Slash Command Error";
	public devonly = true;
	public options: ApplicationCommandOption[] | undefined;

	public async callback(_command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData> {
		throw new Error("Method not implemented.");
	}
}
