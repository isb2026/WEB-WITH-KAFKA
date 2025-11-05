import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import { VendorDto } from '@primes/types/vendor';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
import { IniVendorContactRegisterPage } from '@primes/pages/ini/vendor/pannel/IniVendorContactRegisterPage';

interface IniVendorChargerInfoPageProps {
	vendor: VendorDto;
}

export const IniVendorChargerInfoPage: React.FC<
	IniVendorChargerInfoPageProps
> = ({ vendor }) => {
	// DataTable State
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const [data, setData] = useState<any[]>([]);
	const [page, setPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(30);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	// Modal State
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [mode, setMode] = useState<string>('create');

	const createMockupData = () => {
		const names = [
			'김철수',
			'이영희',
			'박민수',
			'정수진',
			'최동훈',
			'한미라',
			'오성진',
			'임소영',
		];
		const departments = [
			'영업부',
			'구매부',
			'기술부',
			'품질관리부',
			'생산부',
			'총무부',
			'경영지원팀',
		];
		const positions = [
			'부장',
			'차장',
			'과장',
			'대리',
			'주임',
			'팀장',
			'실장',
		];
		const domains = [
			'company.co.kr',
			'business.com',
			'corp.kr',
			'industry.co.kr',
		];

		const mockupData = [];
		for (let i = 0; i < 8; i++) {
			const name = names[i];
			const department = departments[i % departments.length];
			const position = positions[i % positions.length];
			const domain = domains[i % domains.length];
			const nameEng =
				name === '김철수'
					? 'kim.cs'
					: name === '이영희'
						? 'lee.yh'
						: name === '박민수'
							? 'park.ms'
							: name === '정수진'
								? 'jung.sj'
								: name === '최동훈'
									? 'choi.dh'
									: name === '한미라'
										? 'han.mr'
										: name === '오성진'
											? 'oh.sj'
											: 'lim.sy';

			mockupData.push({
				contactName: name,
				contactCode: `C${(i + 1).toString().padStart(3, '0')}`,
				vendorCode: vendor.compCode,
				department: department,
				position: position,
				contactEmail: `${nameEng}@${domain}`,
				contactPhone: `010-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
				isMainContact: i === 0, // 첫 번째만 주 담당자
				memo:
					i === 0
						? '주 담당자 - 모든 업무 문의'
						: i === 1
							? '기술 관련 문의 담당'
							: i === 2
								? '품질 및 검사 담당'
								: i === 3
									? '납기 및 일정 조율'
									: i % 2 === 0
										? '부서별 업무 담당'
										: '',
			});
		}
		setData(mockupData);
		setTotalElements(mockupData.length);
	};
	useEffect(() => {
		createMockupData();
	}, [vendor]);

	const vendorContactColumns = [
		{
			accessorKey: 'contactName',
			header: t('columns.contactName'),
			size: 120,
		},
		{
			accessorKey: 'contactCode',
			header: t('columns.contactCode'),
			size: 120,
		},
		{
			accessorKey: 'vendorCode',
			header: t('columns.vendorCode'),
			size: 120,
		},
		{
			accessorKey: 'department',
			header: t('columns.department'),
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const department = getValue();
				const getDepartmentIcon = (dept: string) => {
					switch (dept) {
						case '영업부':
							return '💼';
						case '구매부':
							return '🛒';
						case '기술부':
							return '🔧';
						case '품질관리부':
							return '✅';
						case '생산부':
							return '🏭';
						case '총무부':
							return '📋';
						case '경영지원팀':
							return '📊';
						default:
							return '👥';
					}
				};
				return (
					<span className="inline-flex items-center gap-1">
						<span>{getDepartmentIcon(department)}</span>
						<span>{department}</span>
					</span>
				);
			},
		},
		{
			accessorKey: 'position',
			header: t('columns.position'),
			size: 100,
		},
		{
			accessorKey: 'contactEmail',
			header: t('columns.email'),
			size: 200,
		},
		{
			accessorKey: 'contactPhone',
			header: t('columns.phone'),
			size: 130,
		},
		{
			accessorKey: 'isMainContact',
			header: t('columns.isMainContact'),
			size: 100,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
						🌟 주담당자
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
						일반
					</span>
				);
			},
		},
		{
			accessorKey: 'memo',
			header: t('columns.memo'),
			size: 150,
			cell: ({ getValue }: { getValue: () => string }) => {
				const value = getValue();
				return value ? value : '-';
			},
		},
	];

	// 담당자 테이블 설정
	const { table, selectedRows, toggleRowSelection } = useDataTable(
		data,
		vendorContactColumns,
		pageSize,
		pageCount,
		page,
		totalElements,
		(page) => {
			setPage(page.pageIndex);
		} // 페이지 변경 핸들러
	);

	return (
		<>
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={`${tCommon('tabs.titles.vendorCharger')} ${mode == 'create' ? tCommon('tabs.actions.register') : tCommon('edit')}`}
				content={<IniVendorContactRegisterPage />}
			/>
			<DatatableComponent
				table={table}
				columns={vendorContactColumns}
				data={data}
				tableTitle="담당자 정보"
				rowCount={totalElements}
				useSearch={true}
				enableSingleSelect={true}
				selectedRows={selectedRows}
				toggleRowSelection={toggleRowSelection}
				searchSlot={
					<SearchSlotComponent
						useQuickSearch={false}
						endSlot={
							<ActionButtonsComponent
								useCreate={true}
								create={() => {
									setOpenModal(true);
									setMode('create');
								}}
								useEdit={true}
								edit={() => {
									setOpenModal(true);
									setMode('edit');
								}}
								useRemove={true}
								remove={() => {
									setOpenModal(true);
									setMode('delete');
								}}
								visibleText={false}
							/>
						}
					/>
				}
			/>
		</>
	);
};
