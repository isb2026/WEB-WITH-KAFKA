import { useEffect, useState } from 'react';

const useToggleStylesheet = (
	isRTL: boolean,
	isDark: boolean,
	BASE_URL?: string
): { isLoaded: boolean } => {
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	useEffect(() => {
		setIsLoaded(false);

		// 기존 테마 스타일시트 제거
		Array.from(document.getElementsByClassName('theme-stylesheet')).forEach(
			(link) => {
				if (link && link.parentNode) {
					link.parentNode.removeChild(link);
				}
			}
		);

		// 테마 스타일시트 생성
		const link: HTMLLinkElement = document.createElement('link');
		link.href = `${BASE_URL || ''}css/theme${isRTL ? '.rtl' : ''}.css`;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.className = 'theme-stylesheet';

		const userLink: HTMLLinkElement = document.createElement('link');
		userLink.href = `${BASE_URL || ''}css/user${isRTL ? '.rtl' : ''}.css`;
		userLink.type = 'text/css';
		userLink.rel = 'stylesheet';
		userLink.className = 'theme-stylesheet';

		link.onload = () => {
			setIsLoaded(true);
		};

		const head = document.head;
		head.appendChild(link);
		head.appendChild(userLink);

		// HTML 방향 설정
		document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
	}, [isRTL]);

	useEffect(() => {
		document.documentElement.setAttribute(
			'data-bs-theme',
			isDark ? 'dark' : 'light'
		);
	}, [isDark]);

	return { isLoaded };
};

export default useToggleStylesheet;
