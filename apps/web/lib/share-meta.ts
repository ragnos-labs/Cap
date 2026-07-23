import { buildEnv } from "@cap/env";

// Self-hosted instances (NEXT_PUBLIC_IS_CAP unset) present share and embed
// links without Cap marketing: the page title is the recording name alone,
// state titles drop the "Cap:" prefix, and the "Watch this video on Cap"
// description is omitted entirely. Cap cloud keeps upstream branding.
export const isCapCloud = Boolean(buildEnv.NEXT_PUBLIC_IS_CAP);

export const brandName = isCapCloud ? "Cap" : "RAGnos";

export const shareVideoTitle = (name: string) =>
	isCapCloud ? `${name} | Cap Recording` : name;

export const shareVideoDescription = (): string | undefined =>
	isCapCloud ? "Watch this video on Cap" : undefined;

export const shareStateTitle = (state: string) =>
	isCapCloud ? `Cap: ${state}` : state;
