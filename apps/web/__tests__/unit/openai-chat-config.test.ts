import { describe, expect, it } from "vitest";
import { openAiChatModel, openAiChatUrl } from "../../lib/openai-chat-config";

describe("openAiChatUrl", () => {
	it("defaults to api.openai.com", () => {
		expect(openAiChatUrl({})).toBe(
			"https://api.openai.com/v1/chat/completions",
		);
	});
	it("honors OPENAI_BASE_URL and strips a trailing slash", () => {
		expect(openAiChatUrl({ OPENAI_BASE_URL: "http://ollama:11434/v1/" })).toBe(
			"http://ollama:11434/v1/chat/completions",
		);
	});
});

describe("openAiChatModel", () => {
	it("defaults to gpt-4o-mini", () => {
		expect(openAiChatModel({})).toBe("gpt-4o-mini");
	});
	it("honors OPENAI_MODEL", () => {
		expect(
			openAiChatModel({ OPENAI_MODEL: "qwen2.5:14b-instruct-q4_K_M" }),
		).toBe("qwen2.5:14b-instruct-q4_K_M");
	});
});
