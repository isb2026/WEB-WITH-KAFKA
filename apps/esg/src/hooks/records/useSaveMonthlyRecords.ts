import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchApiPost, FetchApiPut } from '@esg/utils/request';
import { CreateRecordPayload } from '@esg/types/record';

interface MonthlyRecordData {
	accountId: number;
	accountName: string;
	year: number;
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
}

interface SaveMonthlyRecordsInput {
	companyId: string | number;
	year: number;
	records: MonthlyRecordData[];
}

// 월별 데이터를 개별 레코드로 변환하는 함수
const convertToRecordPayloads = (
	companyId: string | number,
	year: number,
	monthlyRecord: MonthlyRecordData
): CreateRecordPayload[] => {
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
	const payloads: CreateRecordPayload[] = [];

	monthKeys.forEach((monthKey, index) => {
		const quantity = monthlyRecord[monthKey];
		if (quantity && quantity > 0) {
			const month = String(index + 1).padStart(2, '0');
			payloads.push({
				accountId: monthlyRecord.accountId,
				accountMonth: `${year}${month}`, // YYYYMM 형식
				quantity: quantity,
				// 기타 필드들은 선택적으로 추가
				totalCost: 0,
				reference: `${year}년 ${month}월 사용량`,
			});
		}
	});

	return payloads;
};

// 월별 레코드 일괄 저장 API 함수
const saveMonthlyRecords = async (
	input: SaveMonthlyRecordsInput
): Promise<void> => {
	const { companyId, year, records } = input;

	try {
		// 각 관리항목별로 월별 데이터를 개별 레코드로 변환하여 저장
		const savePromises = records.map(async (monthlyRecord) => {
			const recordPayloads = convertToRecordPayloads(
				companyId,
				year,
				monthlyRecord
			);

			// 각 월별 데이터를 개별적으로 저장
			const monthPromises = recordPayloads.map(async (payload) => {
				// 기존 레코드가 있는지 확인
				const existingRecordRes = await FetchApiPost('/record/search', {
					searchRequest: {
						accountId: payload.accountId,
						accountMonth: payload.accountMonth,
						companyId: Number(companyId),
					},
					page: 0,
					size: 1,
				});

				let existingRecords = [];
				if (existingRecordRes.status === 'success') {
					existingRecords =
						existingRecordRes.data?.content ||
						existingRecordRes.data ||
						[];
				}

				if (existingRecords.length > 0) {
					// 기존 레코드 업데이트
					const existingRecord = existingRecords[0];
					return FetchApiPut(`/record/${existingRecord.id}`, {
						quantity: payload.quantity,
						totalCost: payload.totalCost,
						reference: payload.reference,
					});
				} else {
					// 새 레코드 생성
					return FetchApiPost('/record', payload);
				}
			});

			return Promise.all(monthPromises);
		});

		await Promise.all(savePromises);
	} catch (error) {
		console.error('월별 레코드 저장 실패:', error);
		throw new Error('월별 데이터 저장 중 오류가 발생했습니다.');
	}
};

export const useSaveMonthlyRecords = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: saveMonthlyRecords,
		onSuccess: (_, variables) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({
				queryKey: [
					'records',
					'monthly',
					variables.companyId,
					variables.year,
				],
			});
			queryClient.invalidateQueries({
				queryKey: ['records'],
			});
		},
		onError: (error) => {
			console.error('월별 레코드 저장 실패:', error);
		},
	});
};
