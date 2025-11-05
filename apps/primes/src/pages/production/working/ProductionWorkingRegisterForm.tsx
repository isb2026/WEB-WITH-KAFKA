import React, { useState, useEffect } from 'react';
import FormComponent from '@primes/components/form/FormComponent';
import { RotateCw, Check } from 'lucide-react';
import { RadixButton, DraggableDialog } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { CommandSearchDialog } from '@primes/components/search-dialogs/CommandSearchDialog';
import { getCommandList } from '@primes/services/production/commandService';
import { MachineSelectComponent } from '@primes/components/customSelect/MachineSelectComponent';
import { UserSelectComponent } from '@primes/components/customSelect/UserSelectComponent';
import { useWorkingRegister } from '@primes/hooks/production/working/useWorkingRegister';
import type { WorkingResultRegisterRequest } from '@primes/types/production';

// 숫자 포맷팅 유틸리티 함수
const formatNumberWithComma = (
	value: number | string | null | undefined
): string => {
	if (!value) return '0';
	const num = typeof value === 'string' ? parseFloat(value) : value;
	if (isNaN(num)) return '0';
	return num.toLocaleString('ko-KR');
};

interface ProductionWorkingRegisterFormProps {
	onFormDataChange?: (data: any) => void;
	onCommandChange?: (command: any) => void;
	onMaterialsChange?: (materials: any[]) => void;
	onFormValidChange?: (isValid: boolean) => void;
	onFormReady?: (formMethods: any) => void;
}

export const ProductionWorkingRegisterForm: React.FC<
	ProductionWorkingRegisterFormProps
> = ({
	onFormDataChange,
	onCommandChange,
	onMaterialsChange,
	onFormValidChange,
	onFormReady,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('dataTable');

	const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
	const [commandSearchTerm, setCommandSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [formMethods, setFormMethods] = useState<any>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [commandInfo, setCommandInfo] = useState<any>(null);

	const convertEaToWt = (value: number) => {
		if (!commandInfo?.unitWeight) return null;
		return value * commandInfo.unitWeight;
	};

	const convertWtToEa = (value: number) => {
		if (!commandInfo?.unitWeight) return null;
		return value / commandInfo.unitWeight;
	};

	const convertUnitToEa = (value: number, fromUnit: string) => {
		if (!commandInfo?.unitWeight) return null;

		const unit = fromUnit?.toUpperCase();
		if (unit === 'EA') return value;
		if (unit === 'KG' || unit === 'WT') {
			return value / commandInfo.unitWeight;
		}
		if (unit === 'G') {
			return value / 1000 / commandInfo.unitWeight;
		}
		return null;
	};

	const convertEaToUnit = (value: number, toUnit: string) => {
		if (!commandInfo?.unitWeight) return null;

		const unit = toUnit?.toUpperCase();
		if (unit === 'EA') return value;
		if (unit === 'KG' || unit === 'WT') {
			return value * commandInfo.unitWeight;
		}
		if (unit === 'G') {
			return value * commandInfo.unitWeight * 1000;
		}
		return null;
	};

	const calculateWorkWeight = (workQuantity: number) => {
		if (!workQuantity || !commandInfo?.unitWeight) return null;
		return convertEaToWt(workQuantity);
	};

	const workingRegister = useWorkingRegister();
	const formFields: FormField[] = [
		{
			name: 'commandNumber',
			label: '작업지시번호',
			type: 'inputButton',
			placeholder: '작업지시번호를 입력하세요',
			required: true,
			buttonText: isSearching ? '조회중...' : '조회',
			buttonIcon: <RotateCw size={16} />,
			buttonDisabled: isSearching,
			onButtonClick: (value) => {
				// 작업지시 조회 로직
				handleCommandSearch(value);
			},
		},
		{
			name: 'commandId',
			label: '작업지시ID',
			type: 'hidden',
		},
		{
			name: 'productName',
			label: '제품명',
			type: 'text',
			placeholder: '제품명',
			readOnly: true,
		},
		{
			name: 'processName',
			label: '공정명',
			type: 'text',
			placeholder: '공정명',
			readOnly: true,
		},
		{
			name: 'machineId',
			label: '설비',
			type: 'machineSelect',
			required: true,
		},
		{
			name: 'machineCode',
			label: '설비코드',
			type: 'hidden',
		},
		{
			name: 'workerId',
			label: '작업자',
			type: 'userSelect',
			required: true,
		},
		{
			name: 'workBy',
			label: '작업자명',
			type: 'hidden',
		},
		{
			name: 'workDate',
			label: '작업일자',
			type: 'date',
			placeholder: '작업일자를 선택하세요',
			required: true,
		},
		{
			name: 'commandAmount',
			label: '지시수량',
			type: 'commandAmount',
			placeholder: '지시수량',
			readOnly: true,
		},
		{
			name: 'completedAmount',
			label: '작업완료 수량',
			type: 'completedAmount',
			placeholder: '작업완료 수량',
			readOnly: true,
		},
		{
			name: 'workQuantity',
			label: '작업수량',
			type: 'workQuantity',
			placeholder: '작업수량을 입력하세요 (단중 자동 계산)',
			required: true,
		},
		{
			name: 'workWeight',
			label: '작업중량',
			type: 'workWeight',
			placeholder: '작업중량을 입력하세요 (자동 계산)',
		},
		{
			name: 'loadingQuantity',
			label: '장입량',
			type: 'loadingQuantity',
			placeholder: '장입량을 입력하세요',
			required: true,
		},
		{
			name: 'shiftType',
			label: '교대구분',
			type: 'select',
			placeholder: '교대구분을 선택하세요',
			required: true,
			options: [
				{ label: '주간', value: 'DAY' },
				{ label: '야간', value: 'NIGHT' },
			],
		},
	];

	const ActionButtons = () => (
		<div className="flex items-center gap-2.5">
			<RadixButton
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white"
				onClick={() => {
					if (formMethods) {
						formMethods.reset();
					}
				}}
			>
				<RotateCw
					size={16}
					className="text-muted-foreground text-white"
				/>
				{tCommon('pages.form.reset')}
			</RadixButton>
			<RadixButton
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={workingRegister.isPending}
				onClick={() => {
					if (formMethods) {
						formMethods.trigger().then((isValid: boolean) => {
							if (isValid) {
								const formData = formMethods.getValues();

								const apiData: WorkingResultRegisterRequest = {
									commandNo: formData.commandNumber,
									commandId: formData.commandId,
									workDate: formData.workDate,
									shift: formData.shiftType,
									workAmount: Number(formData.workQuantity),
									workWeight: formData.workWeight
										? Number(formData.workWeight)
										: undefined,
									workUnit: commandInfo?.workUnit || 'kg',
									boxAmount: Number(formData.loadingQuantity),
									workBy: formData.workBy,
									machineCode: formData.machineCode,
									machineName:
										formData.machineName || '설비명 없음',
									lineNo: commandInfo?.lineNo || 'LINE001',
									usedMaterials: [],
								};

								workingRegister.mutate(apiData, {
									onSuccess: (response) => {
										formMethods.reset();
										onFormDataChange?.(response);
									},
									onError: (error) => {
										console.error('작업 등록 실패:', error);
									},
								});
							}
						});
					}
				}}
			>
				<Check size={16} className="text-white" />
				{workingRegister.isPending
					? '등록 중...'
					: tCommon('pages.form.save')}
			</RadixButton>
		</div>
	);

	const handleFormReady = (methods: any) => {
		setFormMethods(methods);
		onFormReady?.(methods);

		const subscription = methods.watch((value: any, { name }: any) => {
			if (name === 'workQuantity' && value.workQuantity) {
				const workQuantity = Number(value.workQuantity);
				const calculatedWeight = calculateWorkWeight(workQuantity);

				if (calculatedWeight !== null) {
					methods.setValue('workWeight', calculatedWeight.toFixed(2));
				}
			}
		});

		return () => subscription.unsubscribe();
	};

	const handleCommandSearch = async (searchTerm: string) => {
		if (!searchTerm.trim()) return;

		setIsSearching(true);

		try {
			const response = await getCommandList(
				{ commandNo: searchTerm },
				0,
				10,
				true
			);

			const searchResults =
				response.data?.content || response.content || [];

			if (searchResults.length === 1) {
				const command = searchResults[0];
				applyCommandData({
					id: command.id,
					commandNumber: command.commandNo,
					productName: command.itemName,
					processName: command.progressName,
					workUnit: command.unit,
					commandAmount: command.commandAmount,
					completedAmount: command.completedAmount || 0,
					startDate: command.startDate,
					endDate: command.endDate,
					status: command.status,
					lineNo: command.lineNo || 'LINE001',
					unitWeight: command.unitWeight,
					unitTypeName: command.unitTypeName,
					unitTypeCode: command.unitTypeCode,
					progressId: command.progressId,
					progressTypeCode: command.progressTypeCode,
				});
			} else if (searchResults.length > 1) {
				const formattedResults = searchResults.map((command: any) => ({
					id: command.id,
					commandId: command.id,
					commandNumber: command.commandNo,
					productName: command.itemName,
					processName: command.progressName,
					workUnit: command.unit,
					commandAmount: command.commandAmount,
					completedAmount: command.completedAmount || 0,
					startDate: command.startDate,
					endDate: command.endDate,
					status: command.status,
					unitWeight: command.unitWeight,
					unitTypeName: command.unitTypeName,
					unitTypeCode: command.unitTypeCode,
					progressId: command.progressId,
					progressTypeCode: command.progressTypeCode,
				}));

				setCommandSearchTerm(searchTerm);
				setSearchResults(formattedResults);
				setIsCommandSearchOpen(true);
			}
		} catch (error) {
			console.error('작업지시 조회 중 오류 발생:', error);
		} finally {
			setIsSearching(false);
		}
	};

	const applyCommandData = (command: any) => {
		if (formMethods) {
			formMethods.setValue('commandNumber', command.commandNumber);
			formMethods.setValue('commandId', command.id || command.commandId);
			formMethods.setValue('productName', command.productName);
			formMethods.setValue('processName', command.processName);
			formMethods.setValue('workUnit', command.workUnit);
			formMethods.setValue('commandAmount', command.commandAmount);
			formMethods.setValue(
				'completedAmount',
				command.completedAmount || 0
			);
		}

		setCommandInfo(command);

		const commandWithProgressId = {
			...command,
			progressId: command.progressId || command.progressInfo?.id,
		};
		onCommandChange?.(commandWithProgressId);

		if (command.commandAmount && command.workUnit) {
			const calculatedWeight = calculateWorkWeight(command.commandAmount);
			if (calculatedWeight !== null) {
				formMethods?.setValue(
					'workWeight',
					calculatedWeight.toFixed(2)
				);
			}
		}
	};

	const handleCommandSelect = (command: any) => {
		applyCommandData(command);
		setIsCommandSearchOpen(false);
		setSearchResults([]);
		setCommandSearchTerm('');
	};

	const handleCloseCommandSearch = () => {
		setIsCommandSearchOpen(false);
		setSearchResults([]);
		setCommandSearchTerm('');
	};

	return (
		<div>
			<FormComponent title="작업 등록" actionButtons={<ActionButtons />}>
				<DynamicForm
					fields={formFields}
					onFormReady={handleFormReady}
					visibleSaveButton={false}
					layout="single"
					otherTypeElements={{
						machineSelect: ({ field, methods }) => (
							<MachineSelectComponent
								value={methods.getValues(field.name) || ''}
								onChange={(value) => {
									methods.setValue(field.name, value); // machineId 저장
								}}
								onMachineNameChange={(machineName) => {
									methods.setValue(
										'machineName',
										machineName
									);
								}}
								onMachineDataChange={(machineData) => {
									methods.setValue(
										'machineId',
										machineData.machineId
									);
									methods.setValue(
										'machineCode',
										machineData.machineCode
									);
									methods.setValue(
										'machineName',
										machineData.machineName
									);
								}}
								placeholder="설비를 선택하세요"
								showMachineName={true}
								showMachineType={false}
								className="w-full"
							/>
						),
						userSelect: ({ field, methods }) => (
							<UserSelectComponent
								value={methods.getValues(field.name) || ''}
								onChange={(value) =>
									methods.setValue(field.name, value)
								}
								onUserDataChange={(userData) => {
									methods.setValue(
										'workerId',
										userData.userId
									);
									methods.setValue(
										'workBy',
										userData.name || userData.username || ''
									);
								}}
								placeholder="작업자를 선택하세요"
								showUserName={true}
								className="w-full"
							/>
						),
						commandAmount: ({ field, methods }) => {
							const commandAmount = methods.getValues(field.name);
							const formattedAmount =
								formatNumberWithComma(commandAmount);
							const unit = commandInfo?.workUnit || 'EA';

							return (
								<div className="relative">
									<input
										type="text"
										value={formattedAmount}
										readOnly
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed pr-12"
										placeholder="지시수량"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
										{unit}
									</span>
								</div>
							);
						},
						completedAmount: ({ field, methods }) => {
							const completedAmount = methods.getValues(
								field.name
							);
							const formattedAmount =
								formatNumberWithComma(completedAmount);
							const unit = commandInfo?.workUnit || 'EA';

							return (
								<div className="relative">
									<input
										type="text"
										value={formattedAmount}
										readOnly
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed pr-12"
										placeholder="작업완료 수량"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
										{unit}
									</span>
								</div>
							);
						},
						workQuantity: ({ field, methods }) => {
							const [displayValue, setDisplayValue] =
								useState('');

							useEffect(() => {
								const value = methods.getValues(field.name);
								if (value) {
									const formatted =
										formatNumberWithComma(value);
									setDisplayValue(formatted);
								}
							}, [methods.watch(field.name)]);

							const handleChange = (
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								const value = e.target.value.replace(
									/[^0-9]/g,
									''
								);
								const numValue = value ? parseInt(value) : 0;

								if (numValue < 0) return;

								const formatted =
									formatNumberWithComma(numValue);
								setDisplayValue(formatted);
								methods.setValue(field.name, numValue);
							};

							const unit = commandInfo?.workUnit || 'EA';

							return (
								<div className="relative">
									<input
										type="text"
										value={displayValue}
										onChange={handleChange}
										placeholder={field.placeholder}
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors pr-12"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
										{unit}
									</span>
								</div>
							);
						},
						loadingQuantity: ({ field, methods }) => {
							const [displayValue, setDisplayValue] =
								useState('');

							useEffect(() => {
								const value = methods.getValues(field.name);
								if (value) {
									const formatted =
										formatNumberWithComma(value);
									setDisplayValue(formatted);
								}
							}, [methods.watch(field.name)]);

							const handleChange = (
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								const value = e.target.value.replace(
									/[^0-9]/g,
									''
								);
								const numValue = value ? parseInt(value) : 0;

								if (numValue < 0) return;

								const formatted =
									formatNumberWithComma(numValue);
								setDisplayValue(formatted);
								methods.setValue(field.name, numValue);
							};

							const unit = commandInfo?.workUnit || 'EA';

							return (
								<div className="relative">
									<input
										type="text"
										value={displayValue}
										onChange={handleChange}
										placeholder={field.placeholder}
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors pr-12"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
										{unit}
									</span>
								</div>
							);
						},
						workWeight: ({ field, methods }) => {
							const [displayValue, setDisplayValue] =
								useState('');
							const [rawValue, setRawValue] = useState('');

							useEffect(() => {
								const value = methods.getValues(field.name);
								if (value) {
									const formatted = value.toLocaleString(
										'ko-KR',
										{
											minimumFractionDigits: 1,
											maximumFractionDigits: 2,
										}
									);
									setDisplayValue(formatted);
									setRawValue(value.toString());
								}
							}, [methods.watch(field.name)]);

							const handleChange = (
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								const input = e.target;
								const cursorPos = input.selectionStart || 0;
								const newValue = e.target.value;

								const cleanedValue = newValue.replace(
									/[^0-9.]/g,
									''
								);
								const parts = cleanedValue.split('.');

								if (parts.length > 2) return;
								if (parts[1] && parts[1].length > 2) return;

								if (
									cleanedValue === '' ||
									cleanedValue === '.'
								) {
									setDisplayValue('');
									setRawValue('');
									methods.setValue(field.name, 0);
									return;
								}

								const numValue = parseFloat(cleanedValue);
								if (numValue < 0) return;

								const formatted = numValue.toLocaleString(
									'ko-KR',
									{
										minimumFractionDigits: 1,
										maximumFractionDigits: 2,
									}
								);

								setDisplayValue(formatted);
								setRawValue(cleanedValue);
								methods.setValue(field.name, numValue);

								setTimeout(() => {
									const newCursorPos =
										getAdjustedCursorPosition(
											rawValue,
											cleanedValue,
											cursorPos
										);
									input.setSelectionRange(
										newCursorPos,
										newCursorPos
									);
								}, 0);
							};

							const getAdjustedCursorPosition = (
								oldRawValue: string,
								newRawValue: string,
								cursorPos: number
							) => {
								if (
									oldRawValue.includes('.') &&
									!newRawValue.includes('.')
								) {
									const dotIndex = oldRawValue.indexOf('.');
									if (cursorPos > dotIndex) {
										return cursorPos - 1;
									}
								}

								if (
									!oldRawValue.includes('.') &&
									newRawValue.includes('.')
								) {
									const dotIndex = newRawValue.indexOf('.');
									if (cursorPos >= dotIndex) {
										return cursorPos + 1;
									}
								}

								return cursorPos;
							};

							return (
								<div className="relative">
									<input
										type="text"
										value={displayValue}
										onChange={handleChange}
										placeholder={field.placeholder}
										className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Colors-Brand-200 focus:border-Colors-Brand-500 hover:border-Colors-Brand-300 transition-colors pr-12"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
										KG
									</span>
								</div>
							);
						},
					}}
				/>
			</FormComponent>

			<DraggableDialog
				open={isCommandSearchOpen}
				onOpenChange={setIsCommandSearchOpen}
				title="작업지시 검색"
				content={
					<CommandSearchDialog
						searchTerm={commandSearchTerm}
						columnId="commandNumber"
						rowData={{}}
						onCommandSelect={handleCommandSelect}
						onClose={handleCloseCommandSearch}
						searchResults={searchResults}
					/>
				}
			/>
		</div>
	);
};

export default ProductionWorkingRegisterForm;
