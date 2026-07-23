import { getServerSession } from "@cap/database/auth/auth-options";
import { Button, Logo } from "@cap/ui";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ViewerHomePage() {
	const session = await getServerSession();
	if (!session?.user) {
		redirect("/login?next=%2Fviewer");
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-6 py-16">
			<section className="flex w-full max-w-xl flex-col items-center rounded-3xl border border-gray-4 bg-gray-2 px-8 py-12 text-center shadow-xl">
				<Logo className="mb-10 h-12 w-auto" />
				<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gray-10">
					Viewer access
				</p>
				<h1 className="mb-4 text-3xl font-semibold text-gray-12">
					You are signed in
				</h1>
				<p className="max-w-md text-base leading-7 text-gray-11">
					Open the RAGnos Labs video link you were sent. Your account can watch
					videos shared with your audience, but it cannot access the recording
					or administration tools.
				</p>
				<p className="mt-6 text-sm text-gray-10">
					Signed in as {session.user.email}
				</p>
				<Button
					className="mt-8"
					href="/api/auth/signout?callbackUrl=/login"
					variant="gray"
				>
					Sign out
				</Button>
			</section>
		</main>
	);
}
