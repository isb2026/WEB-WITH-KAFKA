/**
 * QMS (Quality Management System) 훅 통합 내보내기
 * Atomic Hooks 패턴 적용: 단일 책임 원칙 준수
 */

// ============== 검사 헤드 훅들 ==============
export {
	useCheckingHeads,
} from './checkingHead/useCheckingHeads';

// ============== 검사 규격 훅들 ==============
export {
	useCheckingSpecs,
} from './checkingSpec/useCheckingSpecs';

// ============== 검사 샘플 훅들 ==============
export {
	useCheckingSamples,
} from './checkingSample/useCheckingSamples';

// ============== QMS 통합 훅 ==============
export const useQMS = () => {
	// 각 도메인별 훅들을 가져옴
	const { useCheckingHead, useCheckingSpec, useCheckingSample } = require('./checkingHead/useCheckingHeads');
	const checkingHead = useCheckingHead();
	const checkingSpec = useCheckingSpec();
	const checkingSample = useCheckingSample();

	return {
		// 도메인별 훅들
		checkingHead,
		checkingSpec,
		checkingSample,

		// 전체 로딩 상태
		isLoading: 
			checkingHead.isLoading || 
			checkingSpec.isLoading || 
			checkingSample.isLoading,

		// 전체 에러 상태
		hasError: 
			!!checkingHead.createError || 
			!!checkingHead.updateError || 
			!!checkingHead.deleteError ||
			!!checkingSpec.createError || 
			!!checkingSpec.updateError || 
			!!checkingSpec.deleteError ||
			!!checkingSample.createError || 
			!!checkingSample.updateError || 
			!!checkingSample.deleteError,
	};
}; 