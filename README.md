**Tokenzer** - сервис для генерации и верификации токенов

**Примеры запросов и ответов**


----------
- `POST` create - Генерирует токен и добавляет его в Tarantool

- `Request`
```
{
	"type": "Студент",
	"firstname": "Никита",
	"lastname": "Бережной",
	"email": "nikitoshi@gaspatchi.ru"
}
```
- `Response`
```
{
	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoi0KHRgtGD0LTQtdC90YIiLCJmaXJzdG5hbWUiOiLQndC40LrQuNGC0LAiLCJsYXN0bmFtZSI6ItCR0LXRgNC10LbQvdC-0LkiLCJpYXQiOjE0OTY1NzE4MjEsImV4cCI6MTQ5Nzc4MTQyMSwic3ViIjoibmlrLnByMjAxMkB5YW5kZXgucnUifQ.WEVLPhDAt6qumE4_xSRpoYLkR-FrIwktsORC7j-c6kI"
}
```

- `POST` verify- Проверяет токен на валидность и сверяет его с экземпляром в Tarantool
- `Request`
```
{
	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoi0KHRgtGD0LTQtdC90YIiLCJmaXJzdG5hbWUiOiLQndC40LrQuNGC0LAiLCJsYXN0bmFtZSI6ItCR0LXRgNC10LbQvdC-0LkiLCJpYXQiOjE0OTY1NzE4MjEsImV4cCI6MTQ5Nzc4MTQyMSwic3ViIjoibmlrLnByMjAxMkB5YW5kZXgucnUifQ.WEVLPhDAt6qumE4_xSRpoYLkR-FrIwktsORC7j-c6kI"
}
```
- `Response`
```
{
	"type": "Студент",
	"firstname": "Никита",
	"lastname": "Бережной",
	"iat": 1496571821,
	"exp": 1497781421,
	"sub": "nikitoshi@gaspatchi.ru"
}
```

**HTTP коды ответа**

----------
| HTTP Код | Описание                                      |
| -------- | --------------------------------------------- |
| 200      | Токен успешно создан или проверен             |
| 400      | Сервер не смог прочитать или разобрать запрос |
| 500      | Невозможно проверить или создать токен        |