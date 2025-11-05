import React, { useEffect, useRef, useState } from 'react';
import {
	DynamicFormComponent,
	DynamicFormRef,
	BaseModalComponent,
} from '@moornmo/components';
import { GroupConfig } from '@moornmo/types';

interface SignInModalFormProps {
	open: boolean;
	closeModal: (value: boolean) => void;
	signIn: (data: any) => void;
	signFormConfigs: GroupConfig[];
	title?: string;
	initialValues?: Record<string, any>;
}

export const SignInModalComponent: React.FC<SignInModalFormProps> = ({
	open,
	closeModal,
	signFormConfigs,
	signIn,
	title = '회원가입',
	initialValues = {},
}) => {
	const formRef = useRef<DynamicFormRef>(null);

	const submitForm = () => {
		const formData = formRef.current?.getFormData();
		if (!formData) return;
		signIn(formData);
	};

	return (
		<BaseModalComponent
			title={title}
			open={open}
			onSave={() => submitForm()}
			onClose={() => closeModal(false)}
			size="lg"
		>
			<DynamicFormComponent
				ref={formRef}
				config={signFormConfigs}
				initialValues={{
					isTenantAdmin: 0,
				}}
				cols={12}
			/>
		</BaseModalComponent>
	);
};
