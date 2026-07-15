import { describe, expect, it, vi } from "vitest";
import {
	transcribeWithOpenAiCompatible,
	transcriptionConfigured,
} from "../../lib/transcription/openai-compatible";

const VTT = "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nhello world\n";

function mockFetch(body: string, status = 200) {
	return vi.fn(async () => new Response(body, { status }));
}

describe("transcriptionConfigured", () => {
	it("is true with only TRANSCRIPTION_URL", () => {
		expect(
			transcriptionConfigured({ TRANSCRIPTION_URL: "http://w:8080/inference" }),
		).toBe(true);
	});
	it("is true with only DEEPGRAM_API_KEY", () => {
		expect(transcriptionConfigured({ DEEPGRAM_API_KEY: "dg" })).toBe(true);
	});
	it("is false with neither", () => {
		expect(transcriptionConfigured({})).toBe(false);
	});
});

describe("transcribeWithOpenAiCompatible", () => {
	it("returns VTT text from the endpoint", async () => {
		const fetchImpl = mockFetch(VTT);
		const out = await transcribeWithOpenAiCompatible(new Uint8Array([1]), {
			url: "http://w:8080/inference",
			fetchImpl,
		});
		expect(out).toBe(VTT);
		const [url, init] = fetchImpl.mock.calls[0]!;
		expect(url).toBe("http://w:8080/inference");
		const form = init!.body as FormData;
		expect(form.get("response_format")).toBe("vtt");
		expect(form.get("model")).toBe("whisper-1");
	});
	it("passes language when not auto and custom model", async () => {
		const fetchImpl = mockFetch(VTT);
		await transcribeWithOpenAiCompatible(new Uint8Array([1]), {
			url: "http://w:8080/inference",
			model: "small.en",
			language: "en",
			fetchImpl,
		});
		const form = fetchImpl.mock.calls[0]![1]!.body as FormData;
		expect(form.get("language")).toBe("en");
		expect(form.get("model")).toBe("small.en");
	});
	it("omits language when auto", async () => {
		const fetchImpl = mockFetch(VTT);
		await transcribeWithOpenAiCompatible(new Uint8Array([1]), {
			url: "http://w:8080/inference",
			language: "auto",
			fetchImpl,
		});
		const form = fetchImpl.mock.calls[0]![1]!.body as FormData;
		expect(form.get("language")).toBeNull();
	});
	it("sends a bearer Authorization header when apiKey is set", async () => {
		const fetchImpl = mockFetch(VTT);
		await transcribeWithOpenAiCompatible(new Uint8Array([1]), {
			url: "https://x.openai.azure.com/openai/deployments/whisper/audio/transcriptions?api-version=2024-10-21",
			apiKey: "azure-key",
			fetchImpl,
		});
		const init = fetchImpl.mock.calls[0]![1]!;
		expect((init.headers as Record<string, string>).Authorization).toBe(
			"Bearer azure-key",
		);
	});
	it("sends no Authorization header when apiKey is unset", async () => {
		const fetchImpl = mockFetch(VTT);
		await transcribeWithOpenAiCompatible(new Uint8Array([1]), {
			url: "http://w:8080/inference",
			fetchImpl,
		});
		const init = fetchImpl.mock.calls[0]![1]!;
		expect(init.headers).toBeUndefined();
	});
	it("throws on non-200", async () => {
		const fetchImpl = mockFetch("boom", 500);
		await expect(
			transcribeWithOpenAiCompatible(new Uint8Array([1]), {
				url: "http://w:8080/inference",
				fetchImpl,
			}),
		).rejects.toThrow(/500/);
	});
	it("throws when the body is not WebVTT", async () => {
		const fetchImpl = mockFetch('{"text":"not vtt"}');
		await expect(
			transcribeWithOpenAiCompatible(new Uint8Array([1]), {
				url: "http://w:8080/inference",
				fetchImpl,
			}),
		).rejects.toThrow(/WEBVTT/);
	});
});
