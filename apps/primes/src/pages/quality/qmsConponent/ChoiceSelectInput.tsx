import React from 'react';
import { useTranslation } from '@repo/i18n';

// InspectionItem 타입 정의 (로컬에서 사용)
interface InspectionItem {
	id: number;
	itemName: string;
	standardValue: number | string;
	tolerance: string;
	unit: string;
	isRequired: boolean;
	sortOrder: number;
	measuredValues: { [key: string]: number | string };
	result?: 'OK' | 'NG' | 'WARNING';
	specType?: string;
	meta?: {
		maxValue?: number;
		minValue?: number;
		tolerance?: number;
		referenceNote?: string;
		sampleQuantity?: number;
		checkPeriod?: number;
		[key: string]: any;
	};
}

interface ChoiceSelectInputProps {
	item: InspectionItem;
	sampleIndex: number;
	onValueChange: (value: string) => void;
}

const ChoiceSelectInput: React.FC<ChoiceSelectInputProps> = ({ 
	item, 
	sampleIndex, 
	onValueChange 
}) => {
	const { t } = useTranslation('common');

	// maxValue면 1, minValue면 0으로 옵션 생성
	const options = [];
	if (item.meta?.maxValue !== undefined) {
		options.push({ value: '1', label: String(item.meta.maxValue) });
	}
	if (item.meta?.minValue !== undefined) {
		options.push({ value: '0', label: String(item.meta.minValue) });
	}

	// 추가 옵션이 있다면 meta에서 추출 (예: choiceOptions 배열)
	if (item.meta?.choiceOptions && Array.isArray(item.meta.choiceOptions)) {
		item.meta.choiceOptions.forEach((option: any) => {
			options.push({ value: String(option.value || option), label: String(option.label || option) });
		});
	}

	return (
		<select
			value={item.measuredValues?.[`sample${sampleIndex}`] || ''}
			onChange={(e) => onValueChange(e.target.value)}
			className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-Colors-Brand-500 focus:border-transparent"
		>
			<option value="">{t('select.selectBasic')}</option>
			{options.map((option, index) => (
				<option key={index} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};

export default ChoiceSelectInput; 