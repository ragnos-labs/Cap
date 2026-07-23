export const LogoBadge = ({ className }: { className: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			fill="none"
			viewBox="0 0 40 40"
			preserveAspectRatio="xMidYMid meet"
			style={{
				aspectRatio: "1 / 1",
			}}
		>
			<rect width="40" height="40" fill="#0D1117" rx="8" />
			<text
				x="20"
				y="28.5"
				textAnchor="middle"
				fill="#ffffff"
				fontFamily="ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace"
				fontSize="25"
				fontWeight="700"
			>
				R
			</text>
		</svg>
	);
};
