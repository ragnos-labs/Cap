import { parseAllowedDomains } from "@cap/database/auth/domain-utils";

export const spaceSettingKeys = [
	"disableSummary",
	"disableCaptions",
	"disableChapters",
	"disableReactions",
	"disableTranscript",
	"disableComments",
] as const;

export type SpaceSettingKey = (typeof spaceSettingKeys)[number];
export type SpaceSettings = Partial<Record<SpaceSettingKey, boolean>> & {
	audienceDomains?: string[];
};

export const proSpaceSettingKeys = [
	"disableSummary",
	"disableChapters",
	"disableTranscript",
] as const;

export const getSpaceSettingsFromFormData = (formData: FormData) =>
	({
		...Object.fromEntries(
			spaceSettingKeys.map((key) => [key, formData.get(key) === "true"]),
		),
		audienceDomains: parseAllowedDomains(
			String(formData.get("audienceDomains") ?? ""),
		),
	}) as Record<SpaceSettingKey, boolean> & { audienceDomains: string[] };

export const hasProSpaceSettingsEnabled = (
	settings: Record<SpaceSettingKey, boolean>,
) => proSpaceSettingKeys.some((key) => settings[key]);

export const preserveProSpaceSettings = (
	submittedSettings: Record<SpaceSettingKey, boolean>,
	existingSettings: SpaceSettings | null | undefined,
) => ({
	...submittedSettings,
	...Object.fromEntries(
		proSpaceSettingKeys.map((key) => [key, existingSettings?.[key] ?? false]),
	),
});
