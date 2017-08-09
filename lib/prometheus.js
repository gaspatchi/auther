import client from "prom-client";

export let registry = new client.Registry();

export let created_tokens = new client.Counter({ name: "tokenzer_created_tokens", help: "Количество выданых токенов"});
export let checked_tokens = new client.Counter({ name: "tokenzer_checked_tokens", help: "Количество провереных токенов"});

export let token_create_time = new client.Gauge({ name: "tokenzer_token_create_time", help: "Время создания токена"});
export let token_verify_time = new client.Gauge({ name: "tokenzer_token_verify_time", help: "Время проверки токена"});

registry.registerMetric(created_tokens);
registry.registerMetric(checked_tokens);
registry.registerMetric(token_create_time);
registry.registerMetric(token_verify_time);