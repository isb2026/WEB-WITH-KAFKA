import { useQuery } from '@tanstack/react-query';
import { FetchApiGet } from '@esg/utils/request';
import { Record } from '@esg/types/record';
import { useAccountByCompanyQuery } from '@esg/hooks/account';

interface MonthlyRecordParams {
	companyId: string | number;
	year: number;
	enabled?: boolean;
}

interface MonthlyRecord extends Omit<Record, 'id'> {
	accountId: number;
	accountName: string;
	unit: string;
	accountStyleName?: string;
	accountStyleCaption?: string;
	year: number;
	// 월별 데이터
	jan?: number;
	feb?: number;
	mar?: number;
	apr?: number;
	may?: number;
	jun?: number;
	jul?: number;
	aug?: number;
	sep?: number;
	oct?: number;
	nov?: number;
	dec?: number;
	total?: number;
}

// 월 숫자를 월 키로 변환하는 헬퍼 함수
const getMonthKey = (
	month: number
):
	| keyof Pick<
			MonthlyRecord,
			| 'jan'
			| 'feb'
			| 'mar'
			| 'apr'
			| 'may'
			| 'jun'
			| 'jul'
			| 'aug'
			| 'sep'
			| 'oct'
			| 'nov'
			| 'dec'
	  >
	| null => {
	const monthMap = {
		1: 'jan',
		2: 'feb',
		3: 'mar',
		4: 'apr',
		5: 'may',
		6: 'jun',
		7: 'jul',
		8: 'aug',
		9: 'sep',
		10: 'oct',
		11: 'nov',
		12: 'dec',
	} as const;
	return monthMap[month as keyof typeof monthMap] || null;
};

export const useMonthlyRecordQuery = ({
	companyId,
	year,
	enabled = true,
}: MonthlyRecordParams) => {
	// 1. 회사별 관리항목 조회
	const accountsQuery = useAccountByCompanyQuery({
		companyId,
		enabled: enabled && !!companyId,
	});

	// 2. 관리항목 데이터가 있을 때 월별 레코드 조회
	return useQuery({
		queryKey: ['records', 'monthly', companyId, year],
		queryFn: async () => {
			if (!accountsQuery.data?.content) {
				return [];
			}

			const accounts = accountsQuery.data.content.filter(
				(acc: any) => acc.isUse
			);
			const monthlyRecords: MonthlyRecord[] = [];

			for (const account of accounts) {
				// 해당 관리항목의 연도별 레코드 조회
				const recordsRes = await FetchApiGet('/record', {
					searchRequest: {
						accountId: account.id,
						companyId: Number(companyId),
					},
					page: 0,
					size: 12, // 최대 12개월
				});

				let records = [];
				if (recordsRes.status === 'success') {
					records = recordsRes.data?.content || recordsRes.data || [];
				}

				// 월별 데이터 구조로 변환
				const monthlyData: MonthlyRecord = {
					accountId: account.id,
					accountName: account.name,
					unit: account.unit || '',
					accountStyleName:
						account.accountStyle?.name ||
						account.accountStyleName ||
						'',
					accountStyleCaption:
						account.accountStyle?.caption ||
						account.accountStyleCaption ||
						'',
					year,
					name: account.name,
					isUse: account.isUse,
					jan: 0,
					feb: 0,
					mar: 0,
					apr: 0,
					may: 0,
					jun: 0,
					jul: 0,
					aug: 0,
					sep: 0,
					oct: 0,
					nov: 0,
					dec: 0,
					total: 0,
				};

				// 레코드 데이터를 월별로 매핑
				records.forEach((record: any) => {
					if (record.accountMonth) {
						const month = record.accountMonth.substring(4, 6); // YYYYMM에서 MM 추출
						const monthKey = getMonthKey(parseInt(month));
						if (monthKey && record.quantity) {
							monthlyData[monthKey] = record.quantity;
						}
					}
				});

				// 합계 계산
				const monthKeys = [
					'jan',
					'feb',
					'mar',
					'apr',
					'may',
					'jun',
					'jul',
					'aug',
					'sep',
					'oct',
					'nov',
					'dec',
				] as const;
				monthlyData.total = monthKeys.reduce(
					(sum, key) => sum + (monthlyData[key] || 0),
					0
				);

				monthlyRecords.push(monthlyData);
			}

			return monthlyRecords;
		},
		enabled: enabled && !!companyId && !!year && !!accountsQuery.data,
		staleTime: 1000 * 60 * 3, // 3분간 캐시 유지
		gcTime: 1000 * 60 * 5, // 5분간 가비지 컬렉션 방지
		retry: 1,
		retryDelay: 1000,
	});
};
