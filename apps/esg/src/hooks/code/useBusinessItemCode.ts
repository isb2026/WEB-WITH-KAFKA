import { useQuery } from '@tanstack/react-query';
import { getCodesByHierarchyPath } from '@esg/services/codeService';

interface BusinessItemOption {
	label: string;
	value: string; // label과 동일 (표시용)
	code: string; // API 호출용 코드
}

export const useBusinessItemCode = (businessTypeValue?: string) => {
	return useQuery({
		queryKey: ['business-item-code', businessTypeValue],
		queryFn: async (): Promise<BusinessItemOption[]> => {
			if (!businessTypeValue) {
				return [];
			}

			// businessTypeValue는 업태에서 선택된 groupCode (예: "010")
			const hierarchyPath = `BIZ-${businessTypeValue}`;

			const response = await getCodesByHierarchyPath(hierarchyPath);

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

			const businessItemOptions: BusinessItemOption[] = codeList
				.filter((code: any) => code.isUse !== false)
				.map((code: any) => {
					const label =
						code.groupName || code.codeName || code.description;
					const codeValue =
						code.groupCode || code.code || code.id?.toString();
					return {
						label: label,
						value: label, // label과 동일
						code: codeValue, // API 호출용
					};
				})
				.filter((option: any) => option.label && option.code);

			console.log('🔍 최종 업종 옵션들:', businessItemOptions);

			return businessItemOptions;
		},
		enabled: !!businessTypeValue, // businessTypeValue가 있을 때만 실행
		staleTime: 1000 * 60 * 5, // 5분 캐시
		gcTime: 1000 * 60 * 10, // 10분 가비지 컬렉션
	});
};
