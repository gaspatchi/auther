let config = {
	server: {
		address: "0.0.0.0",
		port: 8085,
		salt: ""
	},
	consul: {
		address: "127.0.0.1",
		port: 8500
	},
	vault: {
		apiVersion: "v1",
		endpoint: "",
		token: "acbbfcb5-a4b7-1719-e4ee-b196ae7ac6e3"
	},
	tarantool: {
		address: "",
		port: "",
		user: "",
		password: "",
		timeout: 3000,
		log: false
	},
};

export default config;
