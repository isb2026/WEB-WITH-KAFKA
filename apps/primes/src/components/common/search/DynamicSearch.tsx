import React from 'react';
import {
	DynamicForm,
	FormField,
} from '@primes/components/form/DynamicFormComponent';
import { RadixPopoverComposable } from '@radix-ui/components';
import { Search } from 'lucide-react';
import { useTranslation } from '@repo/i18n';

export interface DynamicSearchProps {
	onSearch: (data: any) => void;
	field: FormField[];
	otherTypeElements?: Record<string, React.ComponentType<any>>;
}
export const DynamicSearchComponent: React.FC<DynamicSearchProps> = ({
	field = [],
	onSearch,
	otherTypeElements,
}) => {
	const { t } = useTranslation('common');

	return (
		<RadixPopoverComposable.Root>
			<RadixPopoverComposable.Trigger>
				<button
					className="flex gap-1 px-2 py-1.5 rounded-lg
							text-sm items-center border bg-Colors-Brand-700
							text-white"
				>
					<Search
						size={16}
						className="text-muted-foreground text-white"
					/>
					{t('table.search.searchF3')}
				</button>
			</RadixPopoverComposable.Trigger>
			<RadixPopoverComposable.Content
				minWidth={'500px'}
				side="bottom"
				align="end"
				sideOffset={4}
				style={{
					padding: 0,
					margin: 0,
				}}
				className="shadow-lg rounded-xl border"
			>
				<div className="p-3">
					{field.length > 0 && (
						<DynamicForm
							fields={field}
							onSubmit={(data) => {
								console.log(data);
								onSearch(data);
							}}
							submitButtonText={t('table.search.searchButton')}
							otherTypeElements={otherTypeElements}
						/>
					)}
					{field.length == 0 && (
						<div className="text-gray-500 text-sm text-center">
							{t('table.search.noSearchableItems')}
						</div>
					)}
				</div>
			</RadixPopoverComposable.Content>
		</RadixPopoverComposable.Root>
	);
};
