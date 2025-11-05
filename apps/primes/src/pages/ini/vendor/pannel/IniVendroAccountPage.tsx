import React, { useState, useEffect } from 'react';
import { useDataTable } from '@radix-ui/hook';
import { VendorDto } from '@primes/types/vendor';
import { useTranslation } from '@repo/i18n';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { SearchSlotComponent } from '@primes/components/common/search/SearchSlotComponent';
import { DraggableDialog } from '@repo/radix-ui/components';
// import { IniVendorAccountRegisterPage } from '@primes/pages/ini/vendor/pannel/IniVendorAccountRegisterPage';

interface IniVendorAccountPageProps {
	vendor: VendorDto;
}

export const IniVendorAccountPage: React.FC<IniVendorAccountPageProps> = ({
	vendor,
}) => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	// 계좌정보 관련 상태
	const [vendorAccounts, setVendorAccounts] = useState<any[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

	// DataTable State
	const [data, setData] = useState<any[]>([]);
	const [page, setPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(30);
	const [totalElements, setTotalElements] = useState<number>(0);
	const [pageCount, setPageCount] = useState<number>(0);

	// Modal State
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [mode, setMode] = useState<string>('create');

	const createMockupData = () => {
		const banks = [
			'국민은행',
			'신한은행',
			'우리은행',
			'하나은행',
			'농협은행',
		];
		const accountTypes = ['보통예금', '당좌예금', '정기예금', '외화예금'];
		const accountHolders = [
			vendor.compName,
			`${vendor.compName} 대표이사`,
			`${vendor.compName} 경리부`,
		];

		const mockupData = [];
		for (let i = 0; i < 3; i++) {
			const bank = banks[i % banks.length];
			const accountType = accountTypes[i % accountTypes.length];
			const holder = accountHolders[i % accountHolders.length];

			// 은행별 실제 계좌번호 패턴 적용
			let accountNumber = '';
			switch (bank) {
				case '국민은행':
					accountNumber = `123456-04-${Math.floor(Math.random() * 900000 + 100000)}`;
					break;
				case '신한은행':
					accountNumber = `110-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900000 + 100000)}`;
					break;
				case '우리은행':
					accountNumber = `1002-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900000 + 100000)}`;
					break;
				case '하나은행':
					accountNumber = `267-${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 90000 + 10000)}`;
					break;
				default:
					accountNumber = `301-${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 90 + 10)}`;
			}

			mockupData.push({
				accountNumber: accountNumber,
				bankName: bank,
				accountHolder: holder,
				accountType: accountType,
				isMainAccount: i === 0, // 첫 번째만 주계좌
				memo:
					i === 0
						? '주거래 계좌 - 대금결제용'
						: i === 1
							? '외화거래 전용계좌'
							: '예비계좌 - 긴급상황 시 사용',
			});
		}
		setData(mockupData);
		setTotalElements(mockupData.length);
	};
	useEffect(() => {
		createMockupData();
	}, [vendor]);

	const vendorAccountColumns = [
		{
			accessorKey: 'accountNumber',
			header: '계좌번호',
			size: 150,
		},
		{
			accessorKey: 'bankName',
			header: '은행명',
			size: 120,
			cell: ({ getValue }: { getValue: () => string }) => {
				const bankName = getValue();
				const getBankIcon = (bank: string) => {
					switch (bank) {
						case '국민은행':
							return '🏛️';
						case '신한은행':
							return '🏦';
						case '우리은행':
							return '🏢';
						case '하나은행':
							return '🏪';
						case '농협은행':
							return '🌾';
						default:
							return '🏛️';
					}
				};
				return (
					<span className="inline-flex items-center gap-1">
						<span>{getBankIcon(bankName)}</span>
						<span>{bankName}</span>
					</span>
				);
			},
		},
		{
			accessorKey: 'accountHolder',
			header: '예금주',
			size: 120,
		},
		{
			accessorKey: 'accountType',
			header: '계좌종류',
			size: 100,
		},
		{
			accessorKey: 'isMainAccount',
			header: '주계좌 여부',
			size: 120,
			cell: ({ getValue }: { getValue: () => boolean }) => {
				const value = getValue();
				return value ? (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
						💳 주계좌
					</span>
				) : (
					<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600">
						보조계좌
					</span>
				);
			},
		},
		{
			accessorKey: 'memo',
			header: '메모',
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
		vendorAccountColumns,
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
				content={
					<div>
						<div className="text-sm text-gray-600 mb-4">
							계좌정보 등록 폼 (추후 구현 예정)
						</div>
						<div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
							계좌정보 등록 폼이 들어갈 공간입니다
						</div>
					</div>
				}
			/>
			<DatatableComponent
				table={table}
				columns={vendorAccountColumns}
				data={data}
				tableTitle="계좌 정보"
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
