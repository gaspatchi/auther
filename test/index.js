import chai from "chai";
import chaihttp from "chai-http";
import server from "../index";

chai.use(chaihttp);

let token = "";

describe("Создание JWT токена", () => {
	beforeEach((done) => {
		setTimeout(() => {
			done();
		}, 250);
	});

	it("Должен сгенерировать токен", (done) => {
		let profile = {
			type: "Студент",
			firstname: "Никита",
			lastname: "Бережной",
			email: "nik.pr2012@yandex.ru"
		};

		chai.request(server)
			.post("/create")
			.send(profile)
			.end((err, res) => {
				token = res.body.token;
				chai.expect(err).to.be.null;
				chai.expect(res).to.be.json;
				chai.expect(res.status).to.be.equal(200);
				chai.expect(res.body).to.be.have.keys("token");
				done();
			});
	});

	it("Должен вернуть ошибку при неполном запросе", (done) => {
		let profile = {
			type: "Студент",
			firstname: "Никита",
			lastname: "Бережной",
		};

		chai.request(server)
			.post("/create")
			.send(profile)
			.end((err, res) => {
				chai.expect(err).to.be.not.null;
				chai.expect(res).to.be.json;
				chai.expect(res.status).to.be.equal(400);
				done();
			});
	});
});

describe("Проверка JWT токена", () => {
	beforeEach((done) => {
		setTimeout(() => {
			done();
		}, 250);
	});

	it("Должен вернуть инфо о юзере", (done) => {
		chai.request(server)
			.post("/verify")
			.send({ token })
			.end((err, res) => {
				chai.expect(err).to.be.null;
				chai.expect(res).to.be.json;
				chai.expect(res.status).to.be.equal(200);
				chai.expect(res.body).to.be.have.keys(["type", "firstname", "lastname", "iat", "exp", "sub"]);
				done();
			});
	});

	it("Должен вернуть ошибку при невалидном токене", (done) => {
		chai.request(server)
			.post("/verify")
			.send({ token: "test" })
			.end((err, res) => {
				chai.expect(err).to.be.not.null;
				chai.expect(res).to.be.json;
				chai.expect(res.status).to.be.equal(400);
				chai.expect(res.body).to.be.have.key("message");
				done();
			});
	});
});