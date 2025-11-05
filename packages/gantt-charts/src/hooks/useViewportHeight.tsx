import { useEffect, useState } from 'react';

function getViewportHeight(): number {
	if (typeof window === 'undefined') return 800; // sensible fallback for SSR
	const h = window.visualViewport?.height ?? window.innerHeight;
	return Math.max(0, Math.round(h));
}

export function useViewportHeight() {
	const [vh, setVh] = useState<number>(() => getViewportHeight());

	useEffect(() => {
		const update = () => setVh(getViewportHeight());

		// Resize covers desktop; 'resize' + 'scroll' + 'orientationchange' + visualViewport events cover mobile UI changes
		window.addEventListener('resize', update);
		window.addEventListener('orientationchange', update);
		window.visualViewport?.addEventListener('resize', update);
		window.visualViewport?.addEventListener('scroll', update);

		update(); // in case it changed between mount and listeners

		return () => {
			window.removeEventListener('resize', update);
			window.removeEventListener('orientationchange', update);
			window.visualViewport?.removeEventListener('resize', update);
			window.visualViewport?.removeEventListener('scroll', update);
		};
	}, []);

	return vh;
}
