import { useState, useEffect } from 'react';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { PageTemplate } from '@primes/templates';
import { useCode } from '@primes/hooks/init/code/useCode';
import { useDataTable } from '@radix-ui/hook';
import { useTranslation } from '@repo/i18n';
import { DraggableDialog } from '@repo/radix-ui/components';
import { DeleteConfirmDialog } from '@primes/components/common/DeleteConfirmDialog';
import { HardDeleteConfirmDialog } from '@primes/components/common/HardDeleteConfirmDialog';
import IniCodeGroupRegisterPage from './iniCodeGroupRegisterPage';
import IniCodeRegisterPage from './IniCodeRegisterPage';
import { ActionButtonsComponent } from '@primes/components/common/ActionButtonsComponent';
import { Code, CodeGroup } from '@primes/types/code';
import { toast } from 'sonner';

export const IniCodeListPage = () => {
	const { t } = useTranslation('dataTable');
	const { t: tCommon } = useTranslation('common');
	const PAGE_SIZE = 30;
	const [open, setOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);
	const [openCodeDeleteDialog, setOpenCodeDeleteDialog] = useState(false);
	const [openGroupDeleteDialog, setOpenGroupDeleteDialog] = useState(false);
	const [selectedRootCode, setSelectedRootCode] = useState<CodeGroup | null>(
		null
	);
	const [selectedCodeGroup, setSelectedCodeGroup] =
		useState<CodeGroup | null>(null);

	const [selectedCode, setSelectedCode] = useState<Code | null>(null);

	// 📌 Master Code Table State
	const [masterCodeData, setMasterCodeData] = useState([]);
	const [masterCodeTotalElements, setMasterCodeTotalElements] = useState(0);

	// 📌 Code Group Table State
	const [codeGroupData, setCodeGroupData] = useState<CodeGroup[]>([]);
	const [codeGroupTotalElements, setCodeGroupTotalElements] = useState(0);

	// 📌 Code Table State
	const [codeData, setCodeData] = useState<Code[]>([]);
	const [codeTotalElements, setCodeTotalElements] = useState(0);

	const [codeGroupHanndleModal, setCodeGroupHanndleModal] = useState<
		'create' | 'update' | null
	>(null);
	const [codeHanndleModal, setCodeHanndleModal] = useState<
		'create' | 'update' | null
	>(null);

	const { list, removeCodeGroup, remove } = useCode();

	const masterCodeTableColumns = [
		{
			accessorKey: 'groupCode',
			header: t('columns.groupCode'),
			size: 30,
			align: 'center',
		},
		{
			accessorKey: 'groupName',
			header: t('columns.groupName'),
			size: 30,
			align: 'center',
		},
		// { accessorKey: 'description', header: '설명' ,size:100},
	];
	const CodeGroupTableColumns = [
		{
			accessorKey: 'groupCode',
			header: t('columns.groupCode'),
			size: 50,
			align: 'center',
		},
		{
			accessorKey: 'groupName',
			header: t('columns.groupName'),
			size: 50,
			align: 'center',
		},
		// { accessorKey: 'description', header: '설명' ,size:100}
	];
	const CodeTableColumns = [
		{ accessorKey: 'codeValue', header: t('columns.codeValue'), size: 30 },
		{ accessorKey: 'codeName', header: t('columns.codeName'), size: 30 },
		{
			accessorKey: 'description',
			header: t('columns.description'),
			size: 200,
		},
	];

	// 📌 master 테이블용 useDataTable
	const {
		table: masterCodeTable,
		toggleRowSelection: toggleMasterCodeRowSelection,
		selectedRows: selectedMasterCodeRows,
	} = useDataTable(
		masterCodeData,
		masterCodeTableColumns,
		PAGE_SIZE,
		30,
		0,
		masterCodeTotalElements,
		() => {}
	);

	// 📌 CodeGroup 테이블용 useDataTable
	const {
		table: codeGroupTable,
		toggleRowSelection: toggleCodeGroupRowSelection,
		selectedRows: selectedCodeGroupRows,
	} = useDataTable(
		codeGroupData,
		CodeGroupTableColumns,
		PAGE_SIZE,
		30,
		0,
		codeGroupTotalElements,
		() => {}
	);

	// 📌 Code 테이블용 useDataTable
	const {
		table: codeTable,
		toggleRowSelection: toggleCodeRowSelection,
		selectedRows: selectedCodeRows,
	} = useDataTable(
		codeData,
		CodeTableColumns,
		PAGE_SIZE,
		30,
		0,
		codeTotalElements,
		() => {}
	);

	const handleOpenCodeGroupRegister = (mode: 'create' | 'update') => {
		if (mode === 'create') {
			if (selectedRootCode) {
				setOpen(true);
				setCodeGroupHanndleModal(mode);
			} else {
				toast.warning('코드 그룹을 선택해주세요.');
				return;
			}
		} else if (mode === 'update') {
			if (selectedCodeGroup) {
				setOpen(true);
				setCodeGroupHanndleModal(mode);
			} else {
				toast.warning('코드 그룹을 선택해주세요.');
				return;
			}
		}
	};

	const handleOpenCodeRegister = (mode: 'create' | 'update') => {
		if (mode === 'create') {
			if (selectedCodeGroup) {
				setCodeOpen(true);
				setCodeHanndleModal(mode);
			} else {
				toast.warning('코드 그룹을 선택해주세요.');
				return;
			}
		} else if (mode === 'update') {
			if (selectedCode) {
				setCodeOpen(true);
				setCodeHanndleModal(mode);
			} else {
				toast.warning('코드를 선택해주세요.');
				return;
			}
		}
	};

	const handleDeleteCodeGroup = () => {
		if (selectedCodeGroup) {
			setOpenGroupDeleteDialog(true);
		} else {
			toast.warning('삭제할 코드 그룹을 선택해주세요.');
			return;
		}
	};

	const handleDeleteCodeGroupConfirm = () => {
		if (selectedCodeGroup) {
			removeCodeGroup.mutate(selectedCodeGroup.id);
			setOpenGroupDeleteDialog(false);
		}
	};

	const handleDeleteCodeConfirm = () => {
		if (selectedCode) {
			remove.mutate(selectedCode.id);
			setOpenCodeDeleteDialog(false);
		}
	};

	// // 📌 API 결과 반영
	useEffect(() => {
		if (list.data) {
			setMasterCodeData(list.data);
			setMasterCodeTotalElements(list.data.length);
		}
	}, [list.data]);

	useEffect(() => {
		setCodeGroupData([]);
		setCodeData([]);
		if (selectedMasterCodeRows.size > 0) {
			const selectedRowIndex = Array.from(selectedMasterCodeRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: CodeGroup = masterCodeData[rowIndex];
			setSelectedRootCode(selectedRow);
			if (selectedRow?.children) {
				setCodeGroupData(selectedRow.children);
				setCodeGroupTotalElements(selectedRow.children.length);
			}
		}
	}, [selectedMasterCodeRows, masterCodeData]);

	useEffect(() => {
		if (selectedCodeGroupRows.size > 0) {
			const selectedRowIndex = Array.from(selectedCodeGroupRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: CodeGroup = codeGroupData[rowIndex];
			console.log('selectedRow', selectedRow);
			setSelectedCodeGroup(selectedRow);
			if (selectedRow?.codes) {
				setCodeData(selectedRow.codes);
				setCodeTotalElements(selectedRow.codes.length);
			}
		}
	}, [selectedCodeGroupRows, codeGroupData]);

	useEffect(() => {
		if (selectedCodeRows.size > 0) {
			const selectedRowIndex = Array.from(selectedCodeRows)[0];
			const rowIndex: number = parseInt(selectedRowIndex);
			const selectedRow: Code = codeData[rowIndex];
			setSelectedCode(selectedRow);
		}
	}, [selectedCodeRows, codeData]);

	return (
		<>
			{/* 코드 그룹등록모달 */}
			<DraggableDialog
				open={open}
				onOpenChange={setOpen}
				title={`${tCommon('pages.titles.codeGroup')} ${
					codeGroupHanndleModal === 'create'
						? tCommon('add')
						: tCommon('edit')
				}`}
				content={
					<IniCodeGroupRegisterPage
						codeData={masterCodeData ?? undefined}
						parentCode={selectedRootCode ?? undefined}
						codeGroupHanndleModal={codeGroupHanndleModal}
						onClose={() => setOpen(false)}
						selectedCodeGroup={selectedCodeGroup ?? undefined}
					/>
				}
			/>
			{/* 코드등록 모달 */}
			<DraggableDialog
				open={codeOpen}
				onOpenChange={setCodeOpen}
				title={`${tCommon('tabs.titles.code')} ${
					codeHanndleModal === 'create'
						? tCommon('add')
						: tCommon('edit')
				}`}
				content={
					<IniCodeRegisterPage
						codeGroupData={codeGroupData ?? undefined}
						parentCode={selectedCodeGroup ?? undefined}
						codeHanndleModal={codeHanndleModal}
						onClose={() => setCodeOpen(false)}
						selectedCode={selectedCode ?? undefined}
					/>
				}
			/>
			<DeleteConfirmDialog
				isOpen={openCodeDeleteDialog}
				onOpenChange={setOpenCodeDeleteDialog}
				onConfirm={handleDeleteCodeConfirm}
				isDeleting={remove.isPending}
				title="코드 삭제"
				description={`선택한 코드 '${selectedCode?.codeName}'을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`}
			/>
			<HardDeleteConfirmDialog
				isOpen={openGroupDeleteDialog}
				onOpenChange={setOpenGroupDeleteDialog}
				onConfirm={handleDeleteCodeGroupConfirm}
				isDeleting={removeCodeGroup.isPending}
				title="코드 그룹 삭제"
				description="선택한 코드 그룹과 관련된 모든 데이터가 영구적으로 삭제됩니다."
				itemName="코드 그룹명"
				itemIdentifier={selectedCodeGroup?.groupName || ''}
				verificationPhrase="코드 그룹 삭제"
				warningMessage="이 작업은 되돌릴 수 없습니다. 신중하게 결정해주세요."
			/>
			<PageTemplate
				firstChildWidth="50%"
				splitterSizes={[50, 50]}
				splitterMinSize={[800, 400]}
				splitterGutterSize={6}
			>
				<div className="flex gap-2 overflow-hidden">
					<div className="border rounded-lg flex-1">
						<DatatableComponent
							table={masterCodeTable}
							columns={masterCodeTableColumns}
							data={masterCodeData}
							tableTitle={tCommon(
								'pages.titles.codeClassification'
							)}
							rowCount={masterCodeTotalElements}
							usePageNation={false}
							selectedRows={selectedMasterCodeRows}
							toggleRowSelection={toggleMasterCodeRowSelection}
							enableSingleSelect
							onRowClick={(row, rowId) => {
								// Same behavior as checkbox - handle single select logic
								if (
									selectedMasterCodeRows.size > 0 &&
									!selectedMasterCodeRows.has(rowId)
								) {
									selectedMasterCodeRows.forEach((id) =>
										toggleMasterCodeRowSelection(id)
									);
								}
								toggleMasterCodeRowSelection(rowId);
							}}
						/>
					</div>
					<div className="border rounded-lg flex-1">
						<DatatableComponent
							table={codeGroupTable}
							columns={CodeGroupTableColumns}
							data={codeGroupData}
							tableTitle={tCommon('pages.titles.codeGroup')}
							rowCount={codeGroupTotalElements}
							usePageNation={false}
							selectedRows={selectedCodeGroupRows}
							toggleRowSelection={toggleCodeGroupRowSelection}
							enableSingleSelect
							onRowClick={(row, rowId) => {
								// Same behavior as checkbox - handle single select logic
								if (
									selectedCodeGroupRows.size > 0 &&
									!selectedCodeGroupRows.has(rowId)
								) {
									selectedCodeGroupRows.forEach((id) =>
										toggleCodeGroupRowSelection(id)
									);
								}
								toggleCodeGroupRowSelection(rowId);
							}}
							searchSlot={
								<ActionButtonsComponent
									useEdit={false}
									useRemove={false}
									useCreate={true}
									create={() => {
										handleOpenCodeGroupRegister('create');
									}}
									visibleText={false}
									classNames={{
										container: 'ml-auto flex justify-end',
									}}
								/>
							}
						/>
					</div>
				</div>
				<div className="border rounded-lg">
					<DatatableComponent
						table={codeTable}
						columns={CodeTableColumns}
						data={codeData}
						tableTitle={tCommon('pages.titles.codeNumber')}
						rowCount={codeTotalElements}
						useSearch={false}
						usePageNation={false}
						selectedRows={selectedCodeRows}
						toggleRowSelection={toggleCodeRowSelection}
						onRowClick={(row, rowId) => {
							// Same behavior as checkbox - handle single select logic
							if (
								selectedCodeRows.size > 0 &&
								!selectedCodeRows.has(rowId)
							) {
								selectedCodeRows.forEach((id) =>
									toggleCodeRowSelection(id)
								);
							}
							toggleCodeRowSelection(rowId);
						}}
						searchSlot={
							<ActionButtonsComponent
								useEdit={true}
								useRemove={true}
								useCreate={true}
								create={() => {
									handleOpenCodeRegister('create');
								}}
								edit={() => {
									handleOpenCodeRegister('update');
								}}
								remove={() => {
									if (selectedCode) {
										setOpenCodeDeleteDialog(true);
									} else {
										toast.warning(
											'삭제할 코드를 선택해주세요.'
										);
										return;
									}
								}}
								visibleText={false}
								classNames={{
									container: 'ml-auto flex justify-end',
								}}
							/>
						}
					/>
				</div>
			</PageTemplate>
		</>
	);
};
