import { ApplicationCommandOption, InteractionApplicationCommandCallbackData } from "slash-commands";
import { SlashCommand } from "../struct/SlashCommand";
import { ApplicationCommand } from "../types";

export class Command extends SlashCommand {
	public name: string = "ping";
	public description: string = "Ping";
	public options: ApplicationCommandOption[] | undefined;

	public async callback(_command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData> {
		return {
			content: "Pong!"
		};
	}
}
