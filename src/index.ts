import { verifyKeyMiddleware, InteractionType } from "discord-interactions";
import Express from "express";
import { discord, port } from "./config.json";
import { Client } from "./struct/Client";

const client = new Client();

const app = Express();

app.get("/", (_, res) => {
	res.send("Hello there!");
});

app.post("/interactions", verifyKeyMiddleware(discord.publicKey), ({ body }, res) => {
	if (body.type === InteractionType.APPLICATION_COMMAND) {
		client.handleCommand(res, body);
	}
});

app.post("/interactions/delete", (req, res) => {
	const host = req.headers.host?.split(":")[0];
	if (host !== "localhost") {
		return res.status(401).end("UNAUTHORIZED");
	}

	const body = JSON.parse(req.body);

	const result = client.tryDelete(body.name, body.global);

	return res.status(200).end(result);
});

app.listen(port, () => console.info(`Listening on port ${port}`));
