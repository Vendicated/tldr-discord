import { verifyKeyMiddleware, InteractionType, InteractionResponseType } from "discord-interactions";
import Express from "express";
import { discord, port } from "./config.json";
import { Client } from "./struct/Client";

const client = new Client();

const app = Express();

app.get("/", (_, res) => {
	res.send("Hello there!");
});

app.post("/interactions", verifyKeyMiddleware(discord.publicKey), ({ body }, res) => {
	if (body.type === InteractionType.PING) {
		res.send({
			type: InteractionResponseType.PONG
		});
	} else if (body.type === InteractionType.APPLICATION_COMMAND) {
		client.handleCommand(res, body);
	}
});

app.listen(port, () => console.info(`Listening on port ${port}`));
