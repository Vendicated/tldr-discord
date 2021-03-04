import { PartialApplicationCommand, InteractionApplicationCommandCallbackData } from "slash-commands";
import { ApplicationCommand } from "../types";
import { Client } from "./Client";

export abstract class SlashCommand {
	public abstract name: PartialApplicationCommand["name"];
	public abstract description: PartialApplicationCommand["description"];
	/* Whether this command should only be added in a development NODE_ENV */
	public abstract devOnly = false;

	public abstract options: PartialApplicationCommand["options"];

	public abstract callback(command: ApplicationCommand): Promise<InteractionApplicationCommandCallbackData>;

	public getOption<T extends string | number | boolean>(command: ApplicationCommand, name: string): T {
		const match: any = command.data.options?.find(opt => opt.name.toLowerCase() === name.toLowerCase());
		return match.value as T;
	}
}
