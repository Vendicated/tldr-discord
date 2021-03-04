import nacl from "tweetnacl";
import { discord } from "./config.json";

export function verifyRequest(body: string, timestamp: string, signature: string) {
	return nacl.sign.detached.verify(Buffer.from(timestamp + body), Buffer.from(signature, "hex"), Buffer.from(discord.publicKey, "hex"));
}
