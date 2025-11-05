#!/usr/bin/env node
/**
 * MCP 설정 자동 생성 스크립트
 * Cursor MCP 서버 설정을 자동으로 생성하고 적용합니다.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class MCPSetup {
	constructor() {
		this.projectRoot = path.resolve(__dirname, '..');
		this.mcpDir = __dirname;
		this.cursorSettingsPath = this.getCursorSettingsPath();
	}

	/**
	 * Cursor 설정 파일 경로 찾기
	 */
	getCursorSettingsPath() {
		const platform = os.platform();
		const homeDir = os.homedir();

		switch (platform) {
			case 'darwin': // macOS
				return path.join(
					homeDir,
					'Library',
					'Application Support',
					'Cursor',
					'User',
					'settings.json'
				);
			case 'win32': // Windows
				return path.join(
					homeDir,
					'AppData',
					'Roaming',
					'Cursor',
					'User',
					'settings.json'
				);
			case 'linux': // Linux
				return path.join(
					homeDir,
					'.config',
					'Cursor',
					'User',
					'settings.json'
				);
			default:
				throw new Error(`지원하지 않는 플랫폼: ${platform}`);
		}
	}

	/**
	 * MCP 설정 생성 (stdio 전용)
	 */
	generateMCPSettings() {
		const mcpSettings = {
			mcpServers: {
				'unified-project-info': {
					command: 'python',
					args: ['server_fastmcp.py'],
					cwd: this.mcpDir,
					env: {
						VIRTUAL_ENV: path.join(this.mcpDir, 'venv'),
						PATH: `${path.join(this.mcpDir, 'venv', 'bin')}:${process.env.PATH}`,
					},
				},
			},
		};

		return mcpSettings;
	}

	/**
	 * Cursor 설정 파일 읽기
	 */
	readCursorSettings() {
		try {
			if (fs.existsSync(this.cursorSettingsPath)) {
				const content = fs.readFileSync(
					this.cursorSettingsPath,
					'utf8'
				);
				return JSON.parse(content);
			}
			return {};
		} catch (error) {
			console.warn(
				'⚠️ Cursor 설정 파일 읽기 실패, 새로 생성합니다:',
				error.message
			);
			return {};
		}
	}

	/**
	 * Cursor 설정 파일에 MCP 설정 추가
	 */
	updateCursorSettings() {
		try {
			const currentSettings = this.readCursorSettings();
			const mcpSettings = this.generateMCPSettings();

			// MCP 설정 병합
			currentSettings.mcpServers = {
				...currentSettings.mcpServers,
				...mcpSettings.mcpServers,
			};

			// 설정 파일 저장
			this.ensureDirectoryExists(this.cursorSettingsPath);
			fs.writeFileSync(
				this.cursorSettingsPath,
				JSON.stringify(currentSettings, null, 2)
			);

			console.log('✅ Cursor 설정 파일 업데이트 완료!');
			console.log(`📁 경로: ${this.cursorSettingsPath}`);

			return true;
		} catch (error) {
			console.error('❌ Cursor 설정 업데이트 실패:', error.message);
			return false;
		}
	}

	/**
	 * 디렉토리가 존재하지 않으면 생성
	 */
	ensureDirectoryExists(filePath) {
		const dir = path.dirname(filePath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	/**
	 * MCP 설정 파일 생성
	 */
	generateMCPSettingsFile() {
		const mcpSettings = this.generateMCPSettings();
		const settingsPath = path.join(
			this.mcpDir,
			'mcp_settings_template.json'
		);

		try {
			fs.writeFileSync(
				settingsPath,
				JSON.stringify(mcpSettings, null, 2)
			);
			console.log('✅ MCP 설정 파일 생성 완료!');
			console.log(`📁 경로: ${settingsPath}`);
			return true;
		} catch (error) {
			console.error('❌ MCP 설정 파일 생성 실패:', error.message);
			return false;
		}
	}

	/**
	 * 시작 스크립트 생성
	 */
	generateStartScript() {
		const scriptContent = `#!/bin/bash
# MCP 서버 간단 시작 스크립트

echo "🚀 MCP 서버 시작 중..."

# 가상환경 활성화
source venv/bin/activate

# MCP 서버 실행
python server_fastmcp.py
`;

		const scriptPath = path.join(this.mcpDir, 'start_mcp.sh');

		try {
			fs.writeFileSync(scriptPath, scriptContent);
			fs.chmodSync(scriptPath, '755'); // 실행 권한 부여
			console.log('✅ 시작 스크립트 생성 완료!');
			console.log(`📁 경로: ${scriptPath}`);
			return true;
		} catch (error) {
			console.error('❌ 시작 스크립트 생성 실패:', error.message);
			return false;
		}
	}

	/**
	 * 전체 설정 생성
	 */
	async setup() {
		console.log('🚀 MCP 설정 자동 생성 시작...\n');

		console.log('1️⃣ MCP 설정 파일 생성');
		this.generateMCPSettingsFile();

		console.log('\n2️⃣ 시작 스크립트 생성');
		this.generateStartScript();

		console.log('\n3️⃣ Cursor 설정 파일 업데이트');
		const success = this.updateCursorSettings();

		if (success) {
			console.log('\n🎉 MCP 설정 완료!');
			console.log('\n📋 다음 단계:');
			console.log('1. Cursor를 재시작하세요');
			console.log('2. MCP 서버가 자동으로 연결됩니다');
			console.log('3. 사용 가능한 툴들:');
			console.log('   - get_primes_overview()');
			console.log('   - get_esg_swagger()');
			console.log('   - get_project_comparison()');
			console.log('   - ping()');
		} else {
			console.log('\n❌ 설정 중 오류가 발생했습니다');
			console.log('수동으로 설정을 확인해주세요');
		}
	}

	/**
	 * 현재 설정 상태 확인
	 */
	showStatus() {
		console.log('📊 MCP 설정 상태 확인\n');

		console.log('📍 프로젝트 루트:', this.projectRoot);
		console.log('📍 MCP 디렉토리:', this.mcpDir);
		console.log('📍 Cursor 설정 경로:', this.cursorSettingsPath);

		console.log('\n📁 파일 존재 여부:');
		console.log(
			'- server_fastmcp.py:',
			fs.existsSync(path.join(this.mcpDir, 'server_fastmcp.py'))
				? '✅'
				: '❌'
		);
		console.log(
			'- venv 디렉토리:',
			fs.existsSync(path.join(this.mcpDir, 'venv')) ? '✅' : '❌'
		);
		console.log(
			'- cursor_settings.json:',
			fs.existsSync(path.join(this.mcpDir, 'cursor_settings.json'))
				? '✅'
				: '❌'
		);
		console.log(
			'- start_mcp.sh:',
			fs.existsSync(path.join(this.mcpDir, 'start_mcp.sh')) ? '✅' : '❌'
		);

		console.log('\n⚙️ Cursor 설정 상태:');
		try {
			const cursorSettings = this.readCursorSettings();
			if (
				cursorSettings.mcpServers &&
				Object.keys(cursorSettings.mcpServers).length > 0
			) {
				console.log('✅ MCP 서버 설정이 있습니다');
				Object.keys(cursorSettings.mcpServers).forEach((serverName) => {
					console.log(`  - ${serverName}`);
				});
			} else {
				console.log('❌ MCP 서버 설정이 없습니다');
			}
		} catch (error) {
			console.log('❌ Cursor 설정 확인 실패:', error.message);
		}
	}
}

// ===== 메인 실행 =====

async function main() {
	const setup = new MCPSetup();

	const command = process.argv[2];

	switch (command) {
		case 'setup':
			await setup.setup();
			break;
		case 'status':
			setup.showStatus();
			break;
		case 'generate-settings':
			setup.generateMCPSettingsFile();
			break;
		case 'generate-script':
			setup.generateStartScript();
			break;
		case 'update-cursor':
			setup.updateCursorSettings();
			break;
		default:
			console.log('🚀 MCP 설정 도구\n');
			console.log('사용법:');
			console.log('  node mcp_setup.js setup          # 전체 설정 생성');
			console.log('  node mcp_setup.js status         # 현재 상태 확인');
			console.log(
				'  node mcp_setup.js generate-settings  # MCP 설정 파일만 생성'
			);
			console.log(
				'  node mcp_setup.js generate-script    # 시작 스크립트만 생성'
			);
			console.log(
				'  node mcp_setup.js update-cursor      # Cursor 설정만 업데이트'
			);
			console.log('\n예시:');
			console.log('  node mcp_setup.js setup');
	}
}

// 스크립트가 직접 실행될 때만 main 함수 실행
if (require.main === module) {
	main().catch(console.error);
}

module.exports = MCPSetup;
