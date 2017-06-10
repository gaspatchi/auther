let config = {
	server: {
		name: "tokenzer",
		address: "127.0.0.1",
		port: 8085,
		salt: process.env.password_salt
	},
	consul: {
		address: "127.0.0.1",
		port: 8500
	},
	tarantool: {
		address: "",
		port: "",
		user: process.env.tarantool_user,
		password: process.env.tarantool_password,
		timeout: 3000,
		log: false
	},
};

export default config;
