let config = {
	server: {
		port: 8085,
		address: "127.0.0.1",
		salt: ""
	},
	consul: {
		address: "127.0.0.1",
		port: 8500
	},
	vault: {
		apiVersion: "v1",
		endpoint: "",
		token: "f37dbc21-f239-d422-7785-f52bca6db1e7"
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
