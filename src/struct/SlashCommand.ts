import { PartialApplicationCommand, InteractionApplicationCommandCallbackData } from "slash-commands";
import { ApplicationCommand } from "../types";
import { Client } from "./Client";

export abstract class SlashCommand {
	public abstract name: PartialApplicationCommand["name"];
	public abstract description: PartialApplicationCommand["description"];
	/* Whether this command should only be added in a development NODE_ENV */
	public devOnly = false;

	public abstract options: PartialApplicationCommand["options"];

	public abstract callback(command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData>;
}
