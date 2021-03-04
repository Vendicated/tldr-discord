import { InteractionType } from "discord-interactions";
import { ApplicationCommandInteractionData, GuildMember, Snowflake } from "slash-commands";

// WHY U NO EXPORT discord-interactions??
export interface ApplicationCommand {
	id: Snowflake;
	type: InteractionType.APPLICATION_COMMAND;
	data: ApplicationCommandInteractionData;
	guildId: Snowflake;
	channelId: Snowflake;
	member: GuildMember;
	token: string;
}
