import {
	getAccountAccessMode,
	parseAllowedDomains,
} from "@cap/database/auth/domain-utils";
import { describe, expect, it } from "vitest";
import {
	getRestrictedVideoLoginPath,
	getViewerRouteDecision,
} from "@/lib/viewer-access";

describe("viewer account access", () => {
	it("treats configured creator domains as creator accounts", () => {
		expect(
			getAccountAccessMode("hunter@plumwheel.com", "plumwheel.com,ragnos.io"),
		).toBe("creator");
	});

	it("treats other permitted signup domains as viewer accounts", () => {
		expect(
			getAccountAccessMode("student@aibuildlab.com", "plumwheel.com,ragnos.io"),
		).toBe("viewer");
	});

	it("keeps creator behavior when no creator-domain gate is configured", () => {
		expect(getAccountAccessMode("anyone@example.com", undefined)).toBe(
			"creator",
		);
	});

	it("normalizes and deduplicates audience domains", () => {
		expect(
			parseAllowedDomains(
				" AIBuildLab.com, aibuildlab.com, ragnos.io, invalid ",
			),
		).toEqual(["aibuildlab.com", "ragnos.io"]);
	});
});

describe("viewer route enforcement", () => {
	it.each(["/", "/dashboard", "/dashboard/caps", "/onboarding", "/signup"])(
		"redirects viewer navigation away from creator route %s",
		(pathname) => {
			expect(getViewerRouteDecision(pathname, "GET")).toEqual({
				type: "redirect",
				location: "/viewer",
			});
		},
	);

	it.each(["/s/video123", "/c/collection123", "/embed/video123", "/viewer"])(
		"allows viewer page %s",
		(pathname) => {
			expect(getViewerRouteDecision(pathname, "GET")).toEqual({
				type: "allow",
			});
		},
	);

	it("allows authentication requests", () => {
		expect(getViewerRouteDecision("/api/auth/signout", "POST")).toEqual({
			type: "allow",
		});
	});

	it.each(["/theme-script.js", "/site.webmanifest", "/fonts/brand.woff2"])(
		"allows viewer static asset %s",
		(pathname) => {
			expect(getViewerRouteDecision(pathname, "GET")).toEqual({
				type: "allow",
			});
		},
	);

	it("allows only the video playback and view-tracking APIs", () => {
		expect(getViewerRouteDecision("/api/playlist", "GET")).toEqual({
			type: "allow",
		});
		expect(getViewerRouteDecision("/api/video/preview", "GET")).toEqual({
			type: "allow",
		});
		expect(getViewerRouteDecision("/api/analytics/track", "POST")).toEqual({
			type: "allow",
		});
	});

	it("denies creator and mutation APIs", () => {
		expect(getViewerRouteDecision("/api/video/delete", "DELETE")).toEqual({
			type: "forbid",
		});
		expect(getViewerRouteDecision("/api/developer/v1/videos", "GET")).toEqual({
			type: "forbid",
		});
	});

	it("denies server actions on share pages", () => {
		expect(getViewerRouteDecision("/s/video123", "POST")).toEqual({
			type: "forbid",
		});
	});
});

describe("restricted video sign-in", () => {
	it("returns the viewer to the exact video after authentication", () => {
		expect(getRestrictedVideoLoginPath("x0dxmswkn2fedg6")).toBe(
			"/login?next=%2Fs%2Fx0dxmswkn2fedg6",
		);
	});
});
