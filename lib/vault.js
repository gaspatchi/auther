import VaultConnection from "node-vault";
import consul from "./consul";
import {vault_response} from "./prometheus";
import config from "../config";

class Vault {
	constructor() {
		this.vault = VaultConnection(config.vault);
	}

	async readKey(location, key) {
		try {
			let time_start = process.hrtime();
			let response = await this.vault.read(`secret/${location}/${key}`);
			vault_response.set(process.hrtime(time_start)[1]/1000000);
			return response.data.value;
		} catch (error) {
			console.log({ type: "Fatal", module: "Vault", section: "readKey", message: error.message, date: new Date().toJSON()});
			await consul.deregisterService("tokenzer");
			process.exit();
		}
	}
}

export default new Vault;