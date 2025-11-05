import React from 'react';
import { Stack } from '@mui/material';
import { useActionButtons } from '@moornmo/hooks/useActionButton';
import { IconButtonComponent } from '@moornmo/components/molecules';

export const ActionButtonComponent = ({ locale = 'ko' }) => {
	const {
		isCreate,
		isEdit,
		isDelete,
		onHandleCreate,
		onHandleEdit,
		onHandleDelete,
	} = useActionButtons();
	const CreateText = locale === 'ko' ? '추가' : 'Create';
	const EditText = locale === 'ko' ? '수정' : 'Edit';
	const DeleteText = locale === 'ko' ? '삭제' : 'Delete';

	return (
		<Stack direction="row" spacing={1}>
			{isCreate && (
				<IconButtonComponent
					icon="Add"
					label={CreateText}
					onClick={onHandleCreate}
					variant="primary"
				/>
			)}
			{isEdit && (
				<IconButtonComponent
					icon="Edit"
					label={EditText}
					onClick={onHandleEdit}
					variant="primary"
				/>
			)}
			{isDelete && (
				<IconButtonComponent
					icon="Delete"
					label={DeleteText}
					onClick={onHandleDelete}
					variant="danger"
				/>
			)}
		</Stack>
	);
};
