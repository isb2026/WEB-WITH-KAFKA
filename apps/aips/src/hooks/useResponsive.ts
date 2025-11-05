import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveConfig {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
	'2xl': number;
}

const defaultBreakpoints: ResponsiveConfig = {
	xs: 0,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
};

export const useResponsive = (
	customBreakpoints?: Partial<ResponsiveConfig>
) => {
	const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});

	useEffect(() => {
		// Handler to call on window resize
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		width: windowSize.width,
		height: windowSize.height,
		isMobile: windowSize.width < breakpoints.md,
		isTablet:
			windowSize.width >= breakpoints.md &&
			windowSize.width < breakpoints.lg,
		isDesktop: windowSize.width >= breakpoints.lg,
		isSmallScreen: windowSize.width < breakpoints.sm,
		isMediumScreen:
			windowSize.width >= breakpoints.md &&
			windowSize.width < breakpoints.xl,
		isLargeScreen: windowSize.width >= breakpoints.xl,
		breakpoint:
			windowSize.width < breakpoints.sm
				? 'xs'
				: windowSize.width < breakpoints.md
					? 'sm'
					: windowSize.width < breakpoints.lg
						? 'md'
						: windowSize.width < breakpoints.xl
							? 'lg'
							: windowSize.width < breakpoints['2xl']
								? 'xl'
								: '2xl',
		lessThan: (size: Breakpoint) => windowSize.width < breakpoints[size],
		greaterThan: (size: Breakpoint) =>
			windowSize.width >= breakpoints[size],
		between: (min: Breakpoint, max: Breakpoint) =>
			windowSize.width >= breakpoints[min] &&
			windowSize.width < breakpoints[max],
	};
};

export default useResponsive;
