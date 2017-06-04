import TarantoolConnection from "tarantool-driver";
import config from "../config";

class Tarantool {
	async _connect() {
		let connection = new TarantoolConnection(config.tarantool);
		await connection.connect();
		await connection.auth(config.tarantool.user, config.tarantool.password);
		return connection;
	}

	async verifyToken(user_id, token) {
		let connection = await this._connect();
		let response = await connection.call("existsToken", user_id, token);
		return response;
	}

	async putToken(user_id, token) {
		let connection = await this._connect();
		let response = await connection.call("putToken", user_id, token);
		return response;
	}
}

export default new Tarantool;