import { buildEnv } from "@cap/env";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNames(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const uuidParse = (uuid: string) => {
	return uuid.replace(/-/g, "");
};

export const uuidFormat = (uuid: string) => {
	return uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
};

export const CAP_LOGO_URL =
	"https://raw.githubusercontent.com/CapSoftware/cap/main/apps/desktop/src-tauri/icons/Square310x310Logo.png";

// Self-hosted instances (NEXT_PUBLIC_IS_CAP unset) brand emails as RAGnos Labs and
// serve the email logo from their own origin instead of the Cap GitHub asset.
// These are lazy functions on purpose: buildEnv must not be evaluated at
// module load (test and desktop bundles do not carry the web env).
export const emailBrandName = () =>
	buildEnv.NEXT_PUBLIC_IS_CAP ? "Cap" : "RAGnos Labs";

export const emailLogoUrl = () =>
	buildEnv.NEXT_PUBLIC_IS_CAP
		? CAP_LOGO_URL
		: `${buildEnv.NEXT_PUBLIC_WEB_URL}/android-chrome-192x192.png`;

export const saveLatestVideoId = (videoId: string) => {
	try {
		if (typeof navigator !== "undefined" && typeof window !== "undefined") {
			window.localStorage.setItem("latestVideoId", videoId);
		}
	} catch (error) {
		console.error(error);
	}
};

export const getLatestVideoId = () => {
	if (typeof navigator !== "undefined" && typeof window !== "undefined") {
		return window.localStorage.getItem("latestVideoId") || "";
	}

	return "";
};

export const saveUserId = async (userId: string) => {
	try {
		if (typeof navigator !== "undefined" && typeof window !== "undefined") {
			window.localStorage.setItem("userId", userId);
		}
	} catch (error) {
		console.error(error);
	}
};

export const getUserId = async () => {
	if (typeof navigator !== "undefined" && typeof window !== "undefined") {
		return window.localStorage.getItem("userId") || "";
	}

	return "";
};

export const isUserPro = async () => {
	if (typeof navigator !== "undefined" && typeof window !== "undefined") {
		return window.localStorage.getItem("pro") || false;
	}

	return false;
};

export const getProgressCircleConfig = () => {
	const radius = 8;
	const circumference = 2 * Math.PI * radius;

	return { radius, circumference };
};

export const calculateStrokeDashoffset = (
	progress: number,
	circumference: number,
) => {
	return circumference - (progress / 100) * circumference;
};

export const getDisplayProgress = (
	uploadProgress?: number,
	processingProgress: number = 0,
) => {
	return uploadProgress !== undefined ? uploadProgress : processingProgress;
};

export function isEmailAllowedByRestriction(
	email: string,
	restriction: string,
): boolean {
	const entries = restriction
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);

	if (entries.length === 0) return true;

	const lowerEmail = email.toLowerCase();

	return entries.some((entry) => {
		if (entry.includes("@")) {
			return lowerEmail === entry;
		}
		return lowerEmail.endsWith(`@${entry}`);
	});
}
