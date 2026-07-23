export type ViewerRouteDecision =
	| { type: "allow" }
	| { type: "forbid" }
	| { type: "redirect"; location: string };

const VIEWER_PAGE_PREFIXES = ["/s/", "/c/", "/embed/"];
const VIEWER_STATIC_PAGES = new Set([
	"/login",
	"/verify-otp",
	"/viewer",
	"/api/auth/error",
]);
const VIEWER_STATIC_PREFIXES = [
	"/fonts/",
	"/logos/",
	"/android-chrome-",
	"/favicon",
];
const VIEWER_STATIC_FILES = new Set([
	"/theme-script.js",
	"/site.webmanifest",
	"/safari-pinned-tab.svg",
	"/apple-touch-icon.png",
]);

const isReadMethod = (method: string) =>
	method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD";

export function getViewerRouteDecision(
	pathname: string,
	method: string,
): ViewerRouteDecision {
	const normalizedMethod = method.toUpperCase();

	if (
		isReadMethod(normalizedMethod) &&
		(VIEWER_STATIC_FILES.has(pathname) ||
			VIEWER_STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
	) {
		return { type: "allow" };
	}

	if (pathname.startsWith("/api/auth/")) {
		return { type: "allow" };
	}

	if (
		(pathname === "/api/playlist" ||
			pathname === "/api/video/preview" ||
			pathname === "/api/video/og" ||
			pathname === "/api/video/domain-info") &&
		isReadMethod(normalizedMethod)
	) {
		return { type: "allow" };
	}

	if (pathname === "/api/analytics/track" && normalizedMethod === "POST") {
		return { type: "allow" };
	}

	if (
		VIEWER_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
		VIEWER_STATIC_PAGES.has(pathname)
	) {
		return isReadMethod(normalizedMethod)
			? { type: "allow" }
			: { type: "forbid" };
	}

	if (pathname.startsWith("/api/")) {
		return { type: "forbid" };
	}

	if (!isReadMethod(normalizedMethod)) {
		return { type: "forbid" };
	}

	return { type: "redirect", location: "/viewer" };
}

export function getRestrictedVideoLoginPath(videoId: string) {
	return `/login?next=${encodeURIComponent(`/s/${videoId}`)}`;
}
