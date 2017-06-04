import Ajv from "ajv";
import Localize from "ajv-i18n";

let ajv = new Ajv({ allErrors: true });

const token_create = {
	"$async": true,
	"required": ["firstname", "lastname", "type", "email"],
	"properties": {
		"firstname": { "type": "string" },
		"lastname": { "type": "string" },
		"type": { "type": "string" },
		"email": { "type": "string", "format": "email" }
	}
};

const token_verify = {
	"$async": true,
	"required": ["token"],
	"properties": {
		"token": { "type": "string" }
	}
};

ajv.addSchema(token_create, "token_create");
ajv.addSchema(token_verify, "token_verify");

export function JsonValidate(options) {
	return async (req, res, next) => {
		try {
			await ajv.validate(options, req.body);
			next();
		} catch (error) {
			Localize.ru(error.errors);
			res.status(400).json(error.errors);
		}
	};
}

export function errorHandler(error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.status(400).json({ message: "Ошибка при обработке запроса" });
	} else {
		next();
	}
}