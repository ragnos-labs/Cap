export function openAiChatUrl(env: { OPENAI_BASE_URL?: string }): string {
	const base = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(
		/\/+$/,
		"",
	);
	return `${base}/chat/completions`;
}

export function openAiChatModel(env: { OPENAI_MODEL?: string }): string {
	return env.OPENAI_MODEL ?? "gpt-4o-mini";
}
