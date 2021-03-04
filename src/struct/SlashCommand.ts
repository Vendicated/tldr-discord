import { PartialApplicationCommand, InteractionApplicationCommandCallbackData } from "slash-commands";
import { ApplicationCommand } from "../types";

export abstract class SlashCommand {
	public abstract name: PartialApplicationCommand["name"];
	public abstract description: PartialApplicationCommand["description"];
	public abstract options: PartialApplicationCommand["options"];

	public abstract callback(command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData>;
}
