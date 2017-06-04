import consul from "./consul";
import vault from "./vault";
import config from "../config";

export default async () => {
	await consul.registerService("tokenzer", config.server.address, config.server.port);
	let vault_info = await consul.getService("vault");
	config.vault.endpoint = `http://${await vault_info.address}:${await vault_info.port}`;
	config.server.salt = await vault.readKey("password", "salt");
	let tarantool_info = await consul.getService("tarantool");
	config.tarantool.address = await tarantool_info.address;
	config.tarantool.port = await tarantool_info.port;
	config.tarantool.user = await vault.readKey("tarantool", "user");
	config.tarantool.password = await vault.readKey("tarantool", "password");
};