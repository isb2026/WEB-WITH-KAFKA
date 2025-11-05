import { useState, useRef, useEffect } from 'react';
import { useActionButtons } from '@repo/moornmo-ui/hooks';
import { Box, Paper } from '@mui/material';
import {
	StyledContainer,
	SplitPanelComponent,
} from '@repo/moornmo-ui/components';
import { ToastoGridComponent } from '@repo/toasto/components/grid';
import { DynamicFormComponent } from '@repo/moornmo-ui/components';

export interface MasterDetailTemplateProps {
	masterOptions: any;
	masterGridColumns: any[];
	masterGridData: any[];
	detailOptions: any;
	detailGridColumns: any[];
	detailGridData: any[];
	formConfigs: any;
	onSelected?: (row: any) => void;
	onCreate?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	initialFormValues?: Record<string, any>;
}

export const MasterDetailTemplate: React.FC<MasterDetailTemplateProps> = ({
	masterOptions,
	masterGridColumns,
	masterGridData,
	detailOptions,
	detailGridColumns,
	detailGridData,
	formConfigs,
	onSelected,
	onCreate,
	onEdit,
	onDelete,
	initialFormValues = {},
}) => {
	const {
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
		setCreate,
		setEdit,
		setDelete,
	} = useActionButtons();
	const masterGridRef = useRef<any>(null);
	const detailGridRef = useRef<any>(null);
	const formRef = useRef<any>(null);
	const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);

	useEffect(() => {
		if (onSelected && selectedRowKey !== null) {
			onSelected(masterGridData[selectedRowKey]);
		}
	}, [selectedRowKey, masterGridData, onSelected]);

	useEffect(() => {
		if (onCreate) {
			setCreate(true);
			setCreateHandler(onCreate);
		} else {
			setCreate(false);
		}
	}, [onCreate]);

	useEffect(() => {
		if (onEdit) {
			setEdit(true);
			setEditHandler(onEdit);
		} else {
			setEdit(false);
		}
	}, [onEdit]);

	useEffect(() => {
		if (onDelete) {
			setDelete(true);
			setDeleteHandler(onDelete);
		} else {
			setDelete(false);
		}
	}, [onDelete]);

	return (
		<SplitPanelComponent
			direction="horizontal"
			sizes={[30, 70]}
			minSize={400}
			onDrag={() => {
				masterGridRef.current?.getGridInstance().refreshLayout();
				detailGridRef.current?.getGridInstance().refreshLayout();
			}}
		>
			<StyledContainer>
				<ToastoGridComponent
					ref={masterGridRef}
					data={masterGridData}
					columns={masterGridColumns}
					gridOptions={masterOptions}
				/>
			</StyledContainer>
			<StyledContainer>
				<Box
					sx={{
						height: '100%',
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<Paper
						sx={{
							height: '35%',
							width: '100%',
							overflowY: 'scroll',
						}}
						className="p-3"
					>
						<DynamicFormComponent
							config={formConfigs}
							cols={12}
							ref={formRef}
							initialValues={initialFormValues}
						/>
					</Paper>
					<Paper sx={{ height: '65%', overflow: 'hidden' }}>
						<ToastoGridComponent
							ref={detailGridRef}
							data={detailGridData}
							columns={detailGridColumns}
							gridOptions={detailOptions}
						/>
					</Paper>
				</Box>
			</StyledContainer>
		</SplitPanelComponent>
	);
};
