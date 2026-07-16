import { findScreenshotObjectKey, provideOptionalAuth, Storage, Videos } from "@cap/web-backend";
import { Video } from "@cap/web-domain";
import { Effect, Option } from "effect";
import { type NextRequest, NextResponse } from "next/server";
import { runPromise } from "@/lib/server";

export const dynamic = "force-dynamic";

const SCREENSHOT_EXPIRES_SECONDS = 60 * 60;

function getFallbackResponse(request: NextRequest, videoId: string) {
	if (request.nextUrl.searchParams.get("fallback") !== "og") {
		return new NextResponse(null, { status: 404 });
	}

	const fallbackUrl = new URL("/api/video/og", request.url);
	fallbackUrl.searchParams.set("videoId", videoId);
	const response = NextResponse.redirect(fallbackUrl, 302);
	response.headers.set("Cache-Control", "private, no-store, max-age=0");
	return response;
}

/**
 * Serves the recording's own captured frame (the share preview image), by
 * redirecting to a freshly signed URL for the screenshot object the recorder
 * already uploaded. Share links point og:image here so the unfurl shows the
 * actual recording rather than a composed card; `fallback=og` keeps the card
 * for recordings that have no screenshot object.
 */
export async function GET(request: NextRequest) {
	const rawVideoId = request.nextUrl.searchParams.get("videoId");
	if (!rawVideoId) {
		return new NextResponse(null, { status: 400 });
	}

	const videoId = Video.VideoId.make(rawVideoId);
	let screenshotUrl: string | null;
	try {
		screenshotUrl = await Effect.gen(function* () {
			const videos = yield* Videos;
			const maybeVideo = yield* videos.getByIdForViewing(videoId);
			if (Option.isNone(maybeVideo)) return null;

			const [video] = maybeVideo.value;
			const [bucket] = yield* Storage.getAccessForVideo(video);
			const listResponse = yield* bucket.listObjects({
				prefix: `${video.ownerId}/${video.id}/`,
			});
			const screenshotKey = findScreenshotObjectKey(listResponse.Contents || []);

			if (!screenshotKey) return null;

			return yield* bucket.getSignedObjectUrl(screenshotKey, {
				expiresIn: SCREENSHOT_EXPIRES_SECONDS,
			});
		}).pipe(provideOptionalAuth, runPromise);
	} catch (error) {
		console.warn("[video/screenshot] Failed to resolve screenshot:", error);
		return new NextResponse(null, { status: 404 });
	}

	if (!screenshotUrl) {
		return getFallbackResponse(request, rawVideoId);
	}

	const response = NextResponse.redirect(screenshotUrl, 302);
	response.headers.set("Cache-Control", "public, max-age=300");
	return response;
}

export const HEAD = GET;
