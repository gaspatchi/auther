import axios from "axios";
import {consul_response} from "./prometheus";
import config from "../config";

class Consul {
	constructor() {
		this.address = config.consul.address;
		this.port = config.consul.port;
	}

	async getNode() {
		try {
			let time_start = process.hrtime();
			let response = await axios.get(`http://${this.address}:${this.port}/v1/catalog/nodes`);
			consul_response.set(process.hrtime(time_start)[1]/1000000);
			return { node: response.data[0].Node, address: response.data[0].Address, datacenter: response.data[0].Datacenter };
		} catch (error) {
			console.log({ type: "Error", module: "Consul", section: "getNode", message: error.message, date: new Date().toJSON() });
		}
	}

	async registerService(service,address,port) {
		try {
			let time_start = process.hrtime();
			await axios.put(`http://${this.address}:${this.port}/v1/agent/service/register`, {
				Name: service,
				Address: address,
				Port: port
			});
			consul_response.set(process.hrtime(time_start)[1]/1000000);
			console.log({ type: "Info", module: "Consul", section: "registerService", message: "Успешная регистрация сервиса", date: new Date().toJSON() });
		} catch (error) {
			console.log({ type: "Fatal", module: "Consul", section: "registerService", message: error.message, date: new Date().toJSON() });
			process.exit();
		}
	}

	async deregisterService(service) {
		try {
			let time_start = process.hrtime();
			let node = await this.getNode();
			await axios.put(`http://${this.address}:${this.port}/v1/catalog/deregister`, {
				Datacenter: node.datacenter,
				Node: node.node,
				ServiceID: service
			});
			consul_response.set(process.hrtime(time_start)[1]/1000000);
			console.log({ type: "Info", module: "Consul", section: "deregisterService", message: "Успешная дерегистрация сервиса", date: new Date().toJSON() });
		} catch (error) {
			console.log({ type: "Error", module: "Consul", section: "deregisterService", message: error.message, date: new Date().toJSON() });
		}
	}

	async getService(service) {
		try {
			let time_start = process.hrtime();
			let response = await axios.get(`http://${this.address}:${this.port}/v1/catalog/service/${service}`);
			if (Object.keys(response.data).length >= 1) {
				consul_response.set(process.hrtime(time_start)[1]/1000000);
				console.log({ type: "Info", module: "Consul", section: "getService", message: `Успешное получение информации о ${service}`, date: new Date().toJSON() });
				return { address: response.data[0].ServiceAddress, port: response.data[0].ServicePort };
			} else {
				throw Error(`${service} незарегистрирован`);
			}
		} catch (error) {
			console.log({ type: "Fatal", module: "Consul", section: "getService", message: error.message, date: new Date().toJSON() });
			await this.deregisterService("tokenzer");
			process.exit();
		}
	}
}

export default new Consul;