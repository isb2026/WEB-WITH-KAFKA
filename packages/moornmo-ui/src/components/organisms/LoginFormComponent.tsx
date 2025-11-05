import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { SignInModalComponent } from './SignInModalComponent';
import { GroupConfig } from '@moornmo/types';
// import { signup } from '@lts5/services/users/authService';

type LayoutType = 'simple' | 'split' | 'card';

export interface LoginFormProps {
	login: (data: LoginPayload) => void;
	hasLabel?: boolean;
	layout?: LayoutType;
	initialValues?: LoginPayload;
	useSignIn?: boolean;
	signIn?: (data: LoginPayload) => void;
	signInFormConfig?: GroupConfig[];
	signup?: (data: any) => void
}

interface LoginPayload {
	username: string;
	password: string;
	tenantId?: number;
}

// Signup form configuration
const signupFormConfig: GroupConfig[] = [
	{
		layoutType: 'group',
		title: '회원가입 정보',
		fields: [
			{
				name: 'username',
				label: '사용자명',
				type: 'text',
				props: {
					required: true,
					placeholder: '사용자명을 입력해주세요',
				},
				span: 6,
			},
			{
				name: 'password',
				label: '비밀번호',
				type: 'password',
				props: {
					required: true,
					placeholder: '비밀번호를 입력해주세요',
				},
				span: 6,
			},
			{
				name: 'tenantId',
				label: '테넌트 ID',
				type: 'number',
				props: {
					required: true,
					placeholder: '테넌트 ID를 입력해주세요',
				},
				span: 6,
			},
			{
				name: 'name',
				label: '이름',
				type: 'text',
				props: {
					required: true,
					placeholder: '이름을 입력해주세요',
				},
				span: 6,
			},
			{
				name: 'userEmail',
				label: '이메일',
				type: 'email',
				props: {
					placeholder: '이메일을 입력해주세요 (선택사항)',
				},
				span: 6,
			},
			{
				name: 'mobileTel',
				label: '휴대폰 번호',
				type: 'text',
				props: {
					placeholder: '010-1234-5678 (선택사항)',
				},
				span: 6,
			},
			{
				name: 'isTenantAdmin',
				label: '테넌트 관리자',
				type: 'toggle',
				props: {},
				span: 12,
			},
		],
	},
];

export const LoginFormComponent: React.FC<LoginFormProps> = ({
	hasLabel = false,
	layout = 'simple',
	login,
	initialValues,
	useSignIn = false,
	signIn,
	signInFormConfig,
	signup
}) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState<LoginPayload>(
		initialValues || { username: '', password: '' }
	);
	const [remember, setRemember] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isSignupOpen, setIsSignupOpen] = useState(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		login(formData);
	};

	const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSignupSubmit = async (data: any) => {
		try {
			console.log('Original signup data:', data);

			const { confirmPassword, ...submitData } = data;
			console.log('Data after removing confirmPassword:', submitData);

			submitData.tenantId = Number(submitData.tenantId);
			submitData.isTenantAdmin = submitData.isTenantAdmin ? 1 : 0;

			// Remove empty optional fields to avoid validation errors
			if (!submitData.userEmail?.trim()) {
				delete submitData.userEmail;
			}
			if (!submitData.mobileTel?.trim()) {
				delete submitData.mobileTel;
			}

			console.log('Final transformed data:', submitData);
			if (signup) {
				await signup(submitData);
			}
		} catch (err) {
			console.error('Signup failed:', err);
		}
		setIsSignupOpen(false);
	};

	return (
		<>
			{useSignIn && signIn && signInFormConfig && (
				<SignInModalComponent
					open={isOpen}
					closeModal={setIsOpen}
					signFormConfigs={signInFormConfig}
					signIn={signIn}
					title="로그인"
				/>
			)}
			<SignInModalComponent
				open={isSignupOpen}
				closeModal={setIsSignupOpen}
				signFormConfigs={signupFormConfig}
				signIn={handleSignupSubmit}
				title="회원가입"
				initialValues={{
					tenantId: 10001,
					isTenantAdmin: 0,
				}}
			/>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					{hasLabel && <Form.Label>ID</Form.Label>}
					<Form.Control
						placeholder={!hasLabel ? 'ID' : ''}
						value={formData.username}
						name="username"
						onChange={handleFieldChange}
						type="text"
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					{hasLabel && <Form.Label>Password</Form.Label>}
					<Form.Control
						placeholder={!hasLabel ? 'Password' : ''}
						value={formData.password}
						name="password"
						onChange={handleFieldChange}
						type="password"
					/>
				</Form.Group>

				<Row className="justify-content-between align-items-center">
					<Col xs="auto">
						<Form.Check
							type="checkbox"
							id="rememberMe"
							className="mb-0"
						>
							<Form.Check.Input
								type="checkbox"
								name="remember"
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
							/>
							<Form.Check.Label className="mb-0 text-700">
								Remember me
							</Form.Check.Label>
						</Form.Check>
					</Col>

					<Col xs="auto">Forgot Password?</Col>
				</Row>

				<Form.Group>
					<Button
						type="submit"
						variant="primary"
						className="mt-3 w-100"
						disabled={!formData.username || !formData.password}
					>
						Log in
					</Button>
					<div
						className="text-center mt-2"
						style={{
							cursor: 'pointer',
							color: '#007bff',
							textDecoration: 'underline',
						}}
						onClick={() => setIsSignupOpen(true)}
					>
						Sign up
					</div>
					{useSignIn && (
						<Button
							type="button"
							variant="primary"
							className="mt-3 w-100"
							onClick={() => setIsOpen(true)}
						>
							Sign in
						</Button>
					)}
				</Form.Group>
			</Form>
		</>
	);
};
