export function transcriptionConfigured(env: {
	DEEPGRAM_API_KEY?: string;
	TRANSCRIPTION_URL?: string;
}): boolean {
	return Boolean(env.DEEPGRAM_API_KEY || env.TRANSCRIPTION_URL);
}

export async function transcribeWithOpenAiCompatible(
	audio: Uint8Array<ArrayBuffer>,
	opts: {
		url: string;
		model?: string;
		language?: string;
		fetchImpl?: typeof fetch;
	},
): Promise<string> {
	const fetchImpl = opts.fetchImpl ?? fetch;
	const form = new FormData();
	form.append(
		"file",
		new Blob([audio], { type: "application/octet-stream" }),
		"audio.mp3",
	);
	form.append("response_format", "vtt");
	form.append("model", opts.model ?? "whisper-1");
	if (opts.language && opts.language !== "auto")
		form.append("language", opts.language);

	const res = await fetchImpl(opts.url, { method: "POST", body: form });
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`Transcription endpoint error ${res.status}: ${text.slice(0, 200)}`,
		);
	}
	const vtt = (await res.text()).trimStart();
	if (!vtt.startsWith("WEBVTT"))
		throw new Error("Transcription endpoint did not return WEBVTT content");
	return vtt;
}
