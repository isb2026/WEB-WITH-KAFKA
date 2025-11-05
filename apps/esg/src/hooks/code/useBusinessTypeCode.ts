import { useQuery } from '@tanstack/react-query';
import { getCodesByHierarchyPath } from '@esg/services/codeService';

interface BusinessTypeOption {
	label: string;
	value: string; // label과 동일 (표시용)
	code: string; // API 호출용 groupCode
}

export const useBusinessTypeCode = () => {
	return useQuery({
		queryKey: ['business-type-code', 'BIZ'],
		queryFn: async (): Promise<BusinessTypeOption[]> => {
			const response = await getCodesByHierarchyPath('BIZ');

			// 🔍 디버깅: 실제 API 응답 구조 확인
			console.log('🔍 업태 API 응답:', response);

			let codeList = [];

			// API 응답 구조 파싱
			if (Array.isArray(response)) {
				codeList = response;
			} else if (response && response.codeList) {
				codeList = response.codeList;
			} else if (response && Array.isArray(response.data)) {
				codeList = response.data;
			} else if (
				response &&
				response.content &&
				Array.isArray(response.content)
			) {
				codeList = response.content;
			} else {
				codeList = [];
			}

			// 업태 옵션 생성 - value를 label로 통일
			const businessTypeOptions: BusinessTypeOption[] = codeList
				.filter((code: any) => code.isUse !== false)
				.map((code: any) => ({
					label: code.groupName,
					value: code.groupName, // label과 동일
					code: code.groupCode, // API 호출용
				}))
				.filter((option: any) => option.label && option.code);

			return businessTypeOptions;
		},
		staleTime: 1000 * 60 * 5, // 5분 캐시
		gcTime: 1000 * 60 * 10, // 10분 가비지 컬렉션
	});
};
