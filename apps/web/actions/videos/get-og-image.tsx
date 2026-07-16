import { db } from "@cap/database";
import { videos } from "@cap/database/schema";
import { findScreenshotObjectKey, Storage } from "@cap/web-backend";
import type { Video } from "@cap/web-domain";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import { ImageResponse } from "next/og";
import { runPromise } from "@/lib/server";
import { decodeStorageVideo } from "@/lib/video-storage";

export async function generateVideoOgImage(videoId: Video.VideoId) {
	const videoData = await getData(videoId);

	if (!videoData) {
		return new ImageResponse(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background:
						"radial-gradient(90.01% 80.01% at 53.53% 49.99%,#d3e5ff 30.65%,#4785ff 88.48%,#fff 100%)",
				}}
			>
				<h1 style={{ fontSize: "60px" }}>Cap not found</h1>
				<p style={{ fontSize: "30px" }}>
					The video you are looking for does not exist or has moved.
				</p>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	}

	const { video } = videoData;

	if (!video || video.public === false) {
		return new ImageResponse(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background:
						"radial-gradient(90.01% 80.01% at 53.53% 49.99%,#d3e5ff 30.65%,#4785ff 88.48%,#fff 100%)",
				}}
			>
				<h1 style={{ fontSize: "40px" }}>Video or bucket not found</h1>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	}

	let screenshotUrl = null;

	try {
		await Effect.gen(function* () {
			const [bucket] = yield* Storage.getAccessForVideo(
				decodeStorageVideo(video),
			);
			const listResponse = yield* bucket.listObjects({
				prefix: `${video.ownerId}/${video.id}/`,
			});
			const screenshotKey = findScreenshotObjectKey(
				listResponse.Contents || [],
			);

			if (!screenshotKey) return;
			screenshotUrl = yield* bucket.getSignedObjectUrl(screenshotKey);
		}).pipe(runPromise);
	} catch (error) {
		console.error("Error generating URL for screenshot:", error);
	}

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background:
					"radial-gradient(90.01% 80.01% at 53.53% 49.99%,#d3e5ff 30.65%,#4785ff 88.48%,#fff 100%)",
			}}
		>
			<div
				style={{
					width: "85%",
					height: "85%",
					display: "flex",
					borderRadius: "10px",
					overflow: "hidden",
					position: "relative",
					// Screenshot renders at full opacity so the share preview shows a
					// recognizable frame (0.4 opacity over #000 read as a black card).
					// Without a screenshot, fall back to the brand gradient, not black.
					background: screenshotUrl
						? "#000"
						: "radial-gradient(90.01% 80.01% at 53.53% 49.99%,#d3e5ff 30.65%,#4785ff 88.48%,#fff 100%)",
				}}
			>
				{/* No play affordance: the bundled @vercel/og renderer cannot draw
				    one reliably. Filled shapes never appear, and the upstream svg
				    rendered as a mispositioned open chevron with its <title> leaking
				    as literal text. This card is only the fallback for recordings with
				    no screenshot; share links point og:image at the frame itself. */}
				{screenshotUrl && (
					<div
						style={{
							width: "100%",
							height: "100%",
							position: "absolute",
							backgroundImage: `url(${screenshotUrl})`,
							backgroundPosition: "center",
							backgroundSize: "cover",
						}}
					/>
				)}
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}

async function getData(videoId: Video.VideoId) {
	const query = await db()
		.select({ video: videos })
		.from(videos)
		.where(eq(videos.id, videoId));

	const result = query[0];

	if (!result) return;

	return {
		video: result.video,
	};
}
