import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [react(), tsconfigPaths(), mkcert()],
	server: {
		https: true,
		host: 'localhost',
        proxy: {
            '/user/auth': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
            '/user': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/init': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/sales': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/tenant': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/mold': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/machine': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/production': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/quality': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/purchase': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/file': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
			'/outsourcing': {
                target: 'http://api.primes-cloud.co.kr',
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'localhost',
                cookiePathRewrite: '/',
            },
		},
    },
	build: {
		// 청크 크기 경고 제한을 늘림
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				// 수동 청크 분할 설정 (함수 기반으로 변경)
				manualChunks: (id) => {
					// 벤더 라이브러리들을 별도 청크로 분리
					if (id.includes('node_modules')) {
						if (id.includes('react') || id.includes('react-dom')) {
							return 'vendor-react';
						}
						if (id.includes('@tanstack/react-query')) {
							return 'vendor-query';
						}
						if (id.includes('react-router')) {
							return 'vendor-router';
						}
						if (id.includes('lucide-react')) {
							return 'vendor-icons';
						}
						// 다른 모든 노드 모듈
						return 'vendor-libs';
					}

					// 도메인별 청크 분할
					if (
						id.includes('/tabs/ini/') ||
						id.includes('/pages/ini/') ||
						id.includes('/hooks/ini/') ||
						id.includes('/services/ini/')
					) {
						return 'domain-ini';
					}

					if (
						id.includes('/tabs/sales/') ||
						id.includes('/pages/sales/') ||
						id.includes('/hooks/sales/') ||
						id.includes('/services/sales/')
					) {
						return 'domain-sales';
					}

					if (
						id.includes('/tabs/production/') ||
						id.includes('/pages/production/') ||
						id.includes('/hooks/production/') ||
						id.includes('/services/production/')
					) {
						return 'domain-production';
					}

					if (
						id.includes('/tabs/purchase/') ||
						id.includes('/pages/purchase/') ||
						id.includes('/hooks/purchase/') ||
						id.includes('/services/purchase/')
					) {
						return 'domain-purchase';
					}

					if (
						id.includes('/tabs/mold/') ||
						id.includes('/pages/mold/') ||
						id.includes('/hooks/mold/') ||
						id.includes('/services/mold/')
					) {
						return 'domain-mold';
					}

					if (
						id.includes('/tabs/machine/') ||
						id.includes('/pages/machine/') ||
						id.includes('/hooks/machine/') ||
						id.includes('/services/machine/')
					) {
						return 'domain-machine';
					}

					// 공통 컴포넌트들
					if (id.includes('/components/')) {
						return 'shared-components';
					}

					// 템플릿과 레이아웃
					if (
						id.includes('/templates/') ||
						id.includes('/layouts/')
					) {
						return 'shared-layouts';
					}

					// 기본값은 undefined로 반환하여 Vite가 자동 처리하도록 함
					return undefined;
				},
				// 동적으로 청크 이름 생성
				chunkFileNames: (chunkInfo) => {
					if (chunkInfo.name?.startsWith('vendor-')) {
						return 'vendor/[name]-[hash].js';
					}
					if (chunkInfo.name?.startsWith('domain-')) {
						return 'domains/[name]-[hash].js';
					}
					if (chunkInfo.name?.startsWith('shared-')) {
						return 'shared/[name]-[hash].js';
					}
					return 'chunks/[name]-[hash].js';
				},
			},
		},
	},
});
