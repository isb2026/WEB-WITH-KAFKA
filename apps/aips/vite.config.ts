import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
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

                    // 도메인별 청크 분할 (AIPS 도메인)
                    if (
                        id.includes('/tabs/ai/') ||
                        id.includes('/pages/ai/') ||
                        id.includes('/hooks/ai/') ||
                        id.includes('/services/ai/')
                    ) {
                        return 'domain-ai';
                    }

                    if (
                        id.includes('/tabs/data/') ||
                        id.includes('/pages/data/') ||
                        id.includes('/hooks/data/') ||
                        id.includes('/services/data/')
                    ) {
                        return 'domain-data';
                    }

                    if (
                        id.includes('/tabs/processing/') ||
                        id.includes('/pages/processing/') ||
                        id.includes('/hooks/processing/') ||
                        id.includes('/services/processing/')
                    ) {
                        return 'domain-processing';
                    }

                    if (
                        id.includes('/tabs/analytics/') ||
                        id.includes('/pages/analytics/') ||
                        id.includes('/hooks/analytics/') ||
                        id.includes('/services/analytics/')
                    ) {
                        return 'domain-analytics';
                    }

                    if (
                        id.includes('/tabs/system/') ||
                        id.includes('/pages/system/') ||
                        id.includes('/hooks/system/') ||
                        id.includes('/services/system/')
                    ) {
                        return 'domain-system';
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