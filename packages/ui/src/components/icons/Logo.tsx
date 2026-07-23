const MONO_STACK =
	"ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

export const Logo = ({
	className,
	showVersion,
	showBeta,
	white,
	hideLogoName,
	viewBoxDimensions = "0 0 170 40",
	style,
}: {
	className?: string;
	showVersion?: boolean;
	showBeta?: boolean;
	white?: boolean;
	hideLogoName?: boolean;
	style?: React.CSSProperties;
	viewBoxDimensions?: `${string} ${string} ${string} ${string}`;
}) => {
	const badgeFill = white ? "#ffffff" : "#0D1117";
	const badgeGlyph = white ? "#0D1117" : "#ffffff";
	const nameFill = white ? "#ffffff" : "var(--gray-12, #12161F)";

	return (
		<div className="flex items-center">
			<svg
				viewBox={viewBoxDimensions}
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid meet"
				fill="none"
				style={style}
				aria-label="RAGnos Labs Logo"
				role="img"
				className={className}
			>
				<title>RAGnos Labs</title>
				<rect
					width="36"
					height="36"
					x="2"
					y="2"
					rx="8"
					fill={badgeFill}
					stroke="var(--gray-6, #E7EAF0)"
					strokeWidth="1"
				/>
				<text
					x="20"
					y="28"
					textAnchor="middle"
					fill={badgeGlyph}
					fontFamily={MONO_STACK}
					fontSize="24"
					fontWeight="700"
				>
					R
				</text>
				{!hideLogoName && (
					<text
						x="46"
						y="27"
						fill={nameFill}
						fontFamily={MONO_STACK}
						fontSize="17"
						fontWeight="700"
						letterSpacing="1"
					>
						RAGnos Labs
					</text>
				)}
			</svg>
			{showVersion && (
				<span
					className={`text-[10px] font-medium ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					v{process.env.appVersion}
				</span>
			)}
			{showBeta && (
				<span
					className={`text-[10px] font-medium min-w-[52px] ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					Beta v{process.env.appVersion}
				</span>
			)}
		</div>
	);
};
