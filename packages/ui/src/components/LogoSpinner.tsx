export const LogoSpinner = ({ className }: { className: string }) => {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 40 40"
		>
			<rect
				width="39.5"
				height="39.5"
				x="0.25"
				y="0.25"
				fill="#0D1117"
				rx="7.75"
			></rect>
			<rect
				width="39.5"
				height="39.5"
				x="0.25"
				y="0.25"
				stroke="var(--gray-6, #E7EAF0)"
				strokeWidth="0.5"
				rx="7.75"
			></rect>
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
