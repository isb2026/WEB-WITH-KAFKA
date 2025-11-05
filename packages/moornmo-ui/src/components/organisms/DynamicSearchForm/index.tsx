import { FC, useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, Paper, Popover } from '@mui/material';
import { Form, InputGroup } from 'react-bootstrap';
import { getFormattedDate } from '@repo/utils';
import Grid from '@mui/material/Grid';
import { SearchFieldRenderer } from './SearchFieldRenderer';
import { SearchOption } from '@moornmo/types/searchForm';

export interface DynamicSearchProps {
	/** 검색 필드 설정 */
	config: SearchOption[];
	/** 검색 제출 핸들러 */
	onSubmit?: (values: Record<string, any>) => void;
	/** 검색 초기값 */
	initialValues?: Record<string, any>;
}

export const DynamicSearch: FC<DynamicSearchProps> = ({
	config,
	onSubmit,
	initialValues = {},
}) => {
	const [open, setOpen] = useState(false);
	const openBtnRef = useRef<HTMLButtonElement>(null);
	const [formData, setFormData] =
		useState<Record<string, any>>(initialValues);
	const { register, handleSubmit, reset } = useForm<Record<string, any>>({
		defaultValues: initialValues,
	});

	// 키이벤트로 토글 및 제출
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'F3') {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
			if (e.key === 'F8') {
				console.log('F8 pressed', formData);
				handleSubmit(onFormSubmit)();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleSubmit]);

	const onFormSubmit: SubmitHandler<Record<string, any>> = (data) => {
		console.log('Form submitted:', data);
		onSubmit?.(formData);
		reset(initialValues);
		setOpen(false);
	};

	const getDefaultDateValue = (props: any, name: string, format: string) => {
		const { is_default } = props || {};
		const initialValue = initialValues[name];
		if (!is_default) return initialValue || '';
		return initialValue || getFormattedDate(format);
	};

	const handleChange = (name: string, value: any) => {
		console.log('handleChange', name, value);
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<Box sx={{ position: 'relative' }}>
			<Button
				variant="contained"
				onClick={() => setOpen((prev) => !prev)}
				ref={openBtnRef}
			>
				검색 (F3)
			</Button>

			<Popover
				open={open}
				anchorEl={openBtnRef.current}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				onClose={() => setOpen(false)}
				sx={{ zIndex: 2000 }}
			>
				<Paper sx={{ p: 2, minWidth: 300, maxWidth: '40vw' }}>
					<Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
						<Grid container spacing={1}>
							{config.map((field: any, idx: number) => (
								<Grid
									key={idx}
									size={{
										xs: 12,
										sm:
											field.span && field.span < 6
												? 6
												: field.span,
										md: field.span || 4,
									}}
								>
									<Form.Group
										controlId={field.name}
										className="mb-1 d-flex flex-row align-items-center"
									>
										{field.label && (
											<Form.Label
												style={{
													flexShrink: 0,
													width: field.labelWidth
														? field.labelWidth
														: '100px',
													marginBottom: 0,
													textAlign: 'right',
													marginRight: '10px',
												}}
											>
												{field.label}
											</Form.Label>
										)}
										{
											<SearchFieldRenderer
												type={field.type}
												name={field.name}
												fieldProps={field.props}
												value={formData[field.name]}
												formData={formData}
												onChange={handleChange}
												getDefaultDateValue={
													getDefaultDateValue
												}
											/>
										}
									</Form.Group>
								</Grid>
							))}
							<Grid size={12}>
								<Button
									variant="contained"
									color="primary"
									sx={{ mt: 2 }}
									type="button"
									onClick={handleSubmit(onFormSubmit)}
								>
									검색 (F8)
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Popover>
		</Box>
	);
};

export default DynamicSearch;
