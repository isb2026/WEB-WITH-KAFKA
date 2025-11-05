/**
 * dongeun-i
 * Quick Search : string 으로 like 검색이 가능한 항목
 * Search : 검색기능
 * Other Button? : 필요할까 ?
 * */
import { DynamicSearchComponent, DynamicSearchProps } from './DynamicSearch';
import { QuickSearch, QuickSearchField } from './QuickSearch';
import { ReactNode } from 'react';

interface SearchSlotProps {
	onSearch?: DynamicSearchProps['onSearch'];
	fields?: DynamicSearchProps['field'];
	otherTypeElements?: DynamicSearchProps['otherTypeElements'];
	useQuickSearch?: boolean;
	quickSearchField?: QuickSearchField[];
	onQuickSearch?: (value: string) => void;
	toggleQuickSearchEl?: (target: string) => void;
	topSlot?: ReactNode;
	endSlot?: ReactNode;
}

export const SearchSlotComponent: React.FC<SearchSlotProps> = ({
	fields = [],
	onSearch,
	otherTypeElements,
	useQuickSearch = false,
	quickSearchField,
	onQuickSearch,
	toggleQuickSearchEl,
	topSlot,
	endSlot,
}) => {
	return (
		<div className="flex content-between flex-1 ">
			{topSlot}
			<div className="flex ml-auto gap-2 flex-1 justify-end">
				{useQuickSearch && (
					<QuickSearch
						quickSearchField={quickSearchField}
						onSearch={onQuickSearch}
						toggleQuickSearchEl={(key: string) => {
							if (toggleQuickSearchEl) {
								toggleQuickSearchEl(key);
							}
						}}
					/>
				)}
				<DynamicSearchComponent
					field={fields}
					onSearch={(data: any) => {
						if (onSearch) {
							onSearch(data);
						}
					}}
					otherTypeElements={otherTypeElements}
				/>
				{endSlot}
			</div>
		</div>
	);
};
