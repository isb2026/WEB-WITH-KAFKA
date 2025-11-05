const {
	MissingTranslationDetector,
} = require('./template_generater/missingTranslationDetector.js');

/**
 * 누락된 번역 키를 검사하고 자동 생성하는 독립 스크립트
 */
const checkMissingTranslations = async () => {
	console.log('🌍 번역 키 검사 및 자동 생성 도구');
	console.log('=====================================\n');

	try {
		const detector = new MissingTranslationDetector();
		const result = await detector.detectAndGenerateMissingKeys();

		// 결과 리포트
		console.log('\n📊 검사 결과 요약:');
		console.log(`   📝 총 사용된 번역 키: ${result.totalUsedKeys}개`);
		console.log(`   ❌ 누락된 번역 키: ${result.missingKeysCount}개`);

		if (result.missingKeysCount > 0) {
			console.log('\n🔧 자동 생성된 번역 키들:');
			Object.entries(result.missingKeys.ko).forEach(([key, value]) => {
				console.log(`   📝 ${key}: "${value}"`);
			});

			console.log('\n💡 추천 사항:');
			console.log(
				'   - 자동 생성된 번역들을 검토하고 필요시 수정해주세요'
			);
			console.log(
				'   - 특히 "[번역필요]" 표시가 있는 항목들을 확인해주세요'
			);
			console.log('   - 새로운 기능 추가 시 이 도구를 다시 실행해주세요');
		}

		console.log('\n✅ 번역 키 검사 완료!');
	} catch (error) {
		console.error('❌ 번역 키 검사 중 오류 발생:', error.message);
		console.error('Stack trace:', error.stack);
		process.exit(1);
	}
};

// 직접 실행되는 경우
if (require.main === module) {
	checkMissingTranslations();
}

module.exports = {
	checkMissingTranslations,
};
