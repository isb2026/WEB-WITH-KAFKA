import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { useTranslation } from '@repo/i18n';
import { useItemsVendor } from '@primes/hooks/purchase/itemsVendor/useItemsVendor';
import { useVendor } from '@primes/hooks/init/vendor/useVendor';
import { useItemFieldQuery } from '@primes/hooks/init/item/useItemFieldQuery';
import { VendorDto } from '@primes/types/vendor';
import { ItemDto } from '@primes/types/item';
import {
	ItemsVendor,
	UpdateItemsVendorPayload,
	CreateItemsVendorPayload,
} from '@primes/types/purchase/itemsVendor';
import { uncommaNumber } from '@repo/utils';
import {
	itemsVendorFormSchema,
	itemsVendorEditFormSchema,
} from '@primes/schemas/purchase/itemsVendorSchemas.tsx';
import { BinaryToggleComponent } from '@primes/components/customSelect';

interface PurchaseItemsVendorRegisterPageProps {
	mode?: 'create' | 'edit';
	data?: ItemsVendor | null;
	onClose?: () => void;
}

export const PurchaseItemsVendorRegisterPage: React.FC<
	PurchaseItemsVendorRegisterPageProps
> = ({ mode = 'create', data, onClose }) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tDataTable } = useTranslation('dataTable');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [formMethods, setFormMethods] = useState<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);

	const { create, updateById } = useItemsVendor({ page: 0, size: 30 });

	// Fetch vendor data for select options
	const { list: vendorList } = useVendor({ page: 0, size: 1000 });

	// Fetch item data for select options
	const { data: itemList } = useItemFieldQuery('itemName', { isUse: true });

	// Create vendor options for select dropdown
	const vendorOptions = Array.isArray(vendorList.data?.content)
		? vendorList.data.content.map((vendor: VendorDto, index: number) => ({
				value: vendor.id.toString(), // Use sequential numbers instead of large IDs
				label: `${vendor.compCode} - ${vendor.compName}`,
				vendorName: vendor.compName,
			}))
		: [];

	// Create item options for select dropdown with both itemId and itemNo info
	const itemOptions = Array.isArray(itemList.data?.content)
		? itemList.data.content.map((item: ItemDto) => ({
				value: `${item.id}_${item.itemNo}`, // Store both itemId and itemNo in value
				label: `${item.itemName} - ${item.itemNumber} - ${item.itemSpec || 'No Spec'}`,
			}))
		: [];

	// Create vendorItemName options (using item names) - make unique
	const vendorItemNameOptions = Array.isArray(itemList.data?.content)
		? itemList.data.content.reduce(
				(
					acc: Array<{ value: string; label: string }>,
					item: ItemDto
				) => {
					const existing = acc.find(
						(option) => option.value === item.itemName
					);
					if (!existing) {
						acc.push({
							value: item.itemName,
							label: `${item.itemName} - ${item.itemSpec}`,
						});
					}
					return acc;
				},
				[]
			)
		: [];

	// Create vendorItemNumber options (using item numbers) - make unique
	const vendorItemNumberOptions = Array.isArray(itemList.data?.content)
		? itemList.data.content.reduce(
				(
					acc: Array<{ value: string; label: string }>,
					item: ItemDto
				) => {
					const existing = acc.find(
						(option) => option.value === item.itemNumber
					);
					if (!existing) {
						acc.push({
							value: item.itemNumber,
							label: `${item.itemNumber} - ${item.itemName}`,
						});
					}
					return acc;
				},
				[]
			)
		: [];

	// Create box type options (common box types)
	const boxTypeOptions = [
		{ value: 'CARTON', label: 'CARTON - Cardboard Box' },
		{ value: 'PLASTIC', label: 'PLASTIC - Plastic Container' },
		{ value: 'WOODEN', label: 'WOODEN - Wooden Box' },
		{ value: 'METAL', label: 'METAL - Metal Container' },
		{ value: 'PAPER', label: 'PAPER - Paper Bag' },
		{ value: 'FABRIC', label: 'FABRIC - Fabric Bag' },
		{ value: 'GLASS', label: 'GLASS - Glass Container' },
		{ value: 'FOAM', label: 'FOAM - Foam Container' },
		{ value: 'ALUMINUM', label: 'ALUMINUM - Aluminum Container' },
		{ value: 'OTHER', label: 'OTHER - Other Type' },
	];

	// Create box label options (common box labels)
	const boxLabelOptions = [
		{ value: 'FRAGILE', label: 'FRAGILE - Handle with Care' },
		{ value: 'HEAVY', label: 'HEAVY - Heavy Item' },
		{ value: 'LIGHT', label: 'LIGHT - Light Item' },
		{ value: 'WATERPROOF', label: 'WATERPROOF - Water Resistant' },
		{ value: 'HEAT_RESISTANT', label: 'HEAT_RESISTANT - Heat Resistant' },
		{ value: 'COLD_RESISTANT', label: 'COLD_RESISTANT - Cold Resistant' },
		{ value: 'EXPLOSIVE', label: 'EXPLOSIVE - Explosive Material' },
		{ value: 'TOXIC', label: 'TOXIC - Toxic Material' },
		{ value: 'RADIOACTIVE', label: 'RADIOACTIVE - Radioactive Material' },
		{ value: 'FOOD_GRADE', label: 'FOOD_GRADE - Food Safe' },
		{ value: 'MEDICAL', label: 'MEDICAL - Medical Grade' },
		{ value: 'ELECTRONIC', label: 'ELECTRONIC - Electronic Equipment' },
		{ value: 'NONE', label: 'NONE - No Special Label' },
	];

	const handleFormReady = (
		methods: UseFormReturn<Record<string, unknown>>
	) => {
		formMethodsRef.current = methods;
		setFormMethods(methods);

		// Populate form with existing data in edit mode
		if (mode === 'edit' && data && methods) {
			populateEditForm(methods, data);
		}
	};

	// Watch for itemId changes and auto-populate itemNo
	useEffect(() => {
		if (!formMethods) return;

		const subscription = formMethods.watch((values, { name }) => {
			if (name === 'itemId' && values.itemId) {
				const selectedValue = values.itemId as string;
				if (selectedValue.includes('_')) {
					const [itemId, itemNo] = selectedValue.split('_');
					// Only set itemNo, keep the combined value for itemId
					formMethods.setValue('itemNo', itemNo);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [formMethods]);

	const populateEditForm = (
		methods: UseFormReturn<Record<string, unknown>>,
		itemsVendor: ItemsVendor
	) => {
		const defaultValues: Record<string, string | number | boolean> = {
			vendorId: itemsVendor.vendorId?.toString() || '',
			vendorName: itemsVendor.vendorName || '',
			itemId: `${itemsVendor.itemId}_${itemsVendor.itemNo}` || '',
			vendorItemName: itemsVendor.vendorItemName || '',
			vendorItemNumber: itemsVendor.vendorItemNumber || '',
			price: itemsVendor.price || 0,
			isDefault: String(itemsVendor.isDefault) === 'true',
			boxType: itemsVendor.boxType || '',
			boxLabel: itemsVendor.boxLabel || '',
			boxSize: itemsVendor.boxSize || 0,
			memo: itemsVendor.memo || '',
			sboxSize: itemsVendor.sboxSize || 0,
			sboxCnt: itemsVendor.sboxCount || 0,
		};

		Object.entries(defaultValues).forEach(([key, value]) =>
			methods.setValue(key, value)
		);
	};

	const handleSubmit = (formData: Record<string, unknown>) => {
		setIsSubmitting(true);

		// vendorId를 기반으로 vendorName 찾기
		const selectedVendor = vendorOptions.find(
			(option: any) => option.value === String(formData.vendorId)
		);
		const vendorName = selectedVendor?.vendorName || '';

		if (mode === 'edit' && data) {
			const selectedItemValue = String(formData.itemId) || '';
			const [itemId, itemNo] = selectedItemValue.includes('_')
				? selectedItemValue.split('_').map(Number)
				: [parseInt(selectedItemValue) || 1, 1];

			// Ensure proper data types for backend
			const updatePayload: UpdateItemsVendorPayload = {
				vendorId: Number(formData.vendorId) || 0,
				vendorName: vendorName,
				itemId: itemId,
				itemNo: itemNo,
				vendorItemName: String(formData.vendorItemName) || '',
				vendorItemNumber: String(formData.vendorItemNumber) || '',
				price: Number(uncommaNumber(String(formData.price))) || 0,
				isDefault: Boolean(formData.isDefault),
				boxType: String(formData.boxType || ''),
				boxLabel: String(formData.boxLabel || ''),
				boxSize: Number(formData.boxSize) || 0,
				memo: String(formData.memo) || '',
				sboxSize: Number(formData.sboxSize) || 0,
				sboxCount: Number(formData.sboxCnt) || 0,
			};

			updateById.mutate(
				{ id: data.id, data: updatePayload },
				{
					onSuccess: () => {
						setIsSubmitting(false);
						if (onClose) onClose();
					},
					onError: () => {
						setIsSubmitting(false);
					},
				}
			);
		} else {
			// Extract itemId and itemNo from the combined value
			const selectedItemValue = String(formData.itemId) || '';
			const [itemId, itemNo] = selectedItemValue.includes('_')
				? selectedItemValue.split('_').map(Number)
				: [parseInt(selectedItemValue) || 1, 1];

			// Ensure proper data types for backend
			const createPayload: CreateItemsVendorPayload[] = [
				{
					vendorId: Number(formData.vendorId) || 0,
					vendorName: vendorName,
					itemId: itemId,
					itemNo: itemNo,
					vendorItemName: String(formData.vendorItemName) || '',
					vendorItemNumber: String(formData.vendorItemNumber) || '',
					price: Number(uncommaNumber(String(formData.price))) || 0,
					isDefault: Boolean(formData.isDefault),
					boxType: String(formData.boxType || ''),
					boxLabel: String(formData.boxLabel || ''),
					boxSize: Number(formData.boxSize) || 0,
					memo: String(formData.memo) || '',
					sboxSize: Number(formData.sboxSize) || 0,
					sboxCount: Number(formData.sboxCnt) || 0,
				},
			];

			create.mutate(
				{ data: createPayload },
				{
					onSuccess: () => {
						setIsSubmitting(false);
						if (onClose) onClose();
					},
					onError: () => {
						setIsSubmitting(false);
					},
				}
			);
		}
	};

	const isLoading = create.isPending || updateById.isPending || isSubmitting;

	return (
		<div className="max-w-full mx-auto">
			<DynamicForm
				onFormReady={handleFormReady}
				layout="split"
				fields={(mode === 'edit'
					? itemsVendorEditFormSchema()
					: itemsVendorFormSchema()
				).map((field) => ({
					...field,
					label: tDataTable(`columns.${field.label}`),
					placeholder: field.placeholder
						? tDataTable(`placeholders.${field.placeholder}`)
						: '',
					disabled: isLoading,
					...(field.name === 'vendorId' && {
						options: vendorOptions,
					}),
					...(field.name === 'itemId' && { options: itemOptions }),
					...(field.name === 'vendorItemName' && {
						options: vendorItemNameOptions,
					}),
					...(field.name === 'vendorItemNumber' && {
						options: vendorItemNumberOptions,
					}),
					...(field.name === 'boxType' && {
						options: boxTypeOptions,
					}),
					...(field.name === 'boxLabel' && {
						options: boxLabelOptions,
					}),
				}))}
				onSubmit={handleSubmit}
				submitButtonText={
					isLoading
						? mode === 'edit'
							? tCommon('pages.form.modifying')
							: tCommon('pages.form.saving')
						: mode === 'edit'
							? tCommon('pages.form.modify')
							: tCommon('pages.form.save')
				}
				visibleSaveButton={true}
				otherTypeElements={{
					isDefault: (props: any) => {
						return (
							<BinaryToggleComponent
								value={Boolean(props.value) ? 'true' : 'false'}
								onChange={(value) => {
									props.onChange(value === 'true');
								}}
								falseLabel="지정안함"
								trueLabel="지정"
							/>
						);
					},
				}}
			/>
		</div>
	);
};

export default PurchaseItemsVendorRegisterPage;
