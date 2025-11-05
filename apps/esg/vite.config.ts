import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	// resolve: {
	// 	alias: {
	// 		'@ui/falcon-ui': '../../packages/ui/falcon-ui', // 실제 경로로 설정
	// 	},
	// },
});
