import express from "express";
import bodyparser from "body-parser";
import { JsonValidate, errorHandler } from "./middlewares/validate";
import jwt from "jsonwebtoken";
import { registry, created_tokens, checked_tokens, token_create_time, token_verify_time } from "./lib/prometheus";
import config from "./config";
import init from "./lib/init";
import consul from "./lib/consul";
import tarantool from "./lib/tarantool";

let server = express();
server.use(bodyparser.json());
server.use(errorHandler);

server.post("/create", JsonValidate("token_create"), async (req, res) => {
	try {
		let time_start = process.hrtime();
		let token = jwt.sign({ type: req.body.type, firstname: req.body.firstname, lastname: req.body.lastname }, config.server.salt, { subject: req.body.email, expiresIn: "14d" });
		let result = await tarantool.putToken(req.body.email, token);
		if (result[0][0] === true) {
			created_tokens.inc();
			token_create_time.set(process.hrtime(time_start)[1] / 1000000);
			res.status(200).json({ token: token });
		} else {
			throw new Error();
		}
	} catch (error) {
		res.status(500).json({ message: "Невозможно создать токен" });
	}
});

server.post("/verify", JsonValidate("token_verify"), async (req, res) => {
	try {
		let time_start = process.hrtime();
		let info = jwt.verify(req.body.token, config.server.salt);
		let result = await tarantool.verifyToken(info.sub, req.body.token);
		token_verify_time.set(process.hrtime(time_start)[1] / 1000000);
		if (result[0][0] === true) {
			checked_tokens.inc();
			res.status(200).json(info);
		} else {
			let error = new Error();
			error.name = "JsonWebTokenError";
			throw error;
		}
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.status(400).json({ message: "Токен истек" });
		} else if (error.name === "JsonWebTokenError") {
			res.status(400).json({ message: "Токен недействителен" });
		} else {
			res.status(500).json({ message: "Невозможно проверить токен" });
		}
	}
});

server.get("/metrics", (req, res) => {
	res.set("Content-Type", registry.contentType);
	res.end(registry.metrics());
});

server.listen(config.server.port, config.server.address, async () => {
	await init();
});

process.on("SIGTERM", async () => {
	await consul.deregisterService("tokenzer");
	await process.exit();
});

process.on("SIGINT", async () => {
	await consul.deregisterService("tokenzer");
	await process.exit();
});

export default server;