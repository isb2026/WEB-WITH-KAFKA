import React, { useMemo, useRef, useState } from 'react';
import PageTemplate from '@primes/templates/PageTemplate';
import FormComponent from '@primes/components/form/FormComponent';
import { DynamicForm } from '@primes/components/form/DynamicFormComponent';
import { EchartComponent } from '@repo/echart/components';
import { RadixButton } from '@repo/radix-ui/components';
import type { UseFormReturn } from 'react-hook-form';

interface TemplateRow {
	id: number;
	name: string;
	version: string;
	isActive: boolean;
	updatedAt: string;
}

const QualityCertificateTemplatePage: React.FC = () => {
	const [templates, setTemplates] = useState<TemplateRow[]>([
		{
			id: 1,
			name: '기본 템플릿',
			version: 'v1.2',
			isActive: true,
			updatedAt: '2024-01-10',
		},
		{
			id: 2,
			name: '영문 템플릿',
			version: 'v1.0',
			isActive: false,
			updatedAt: '2024-01-08',
		},
	]);
	const [selected, setSelected] = useState<TemplateRow | null>(templates[0]);

	const leftFormFields = useMemo(
		() => [
			{
				name: 'name',
				label: '템플릿명',
				type: 'text',
				required: true,
				defaultValue: selected?.name,
			},
			{
				name: 'version',
				label: '버전',
				type: 'text',
				required: true,
				defaultValue: selected?.version,
			},
			{
				name: 'isActive',
				label: '활성화',
				type: 'select',
				options: [
					{ label: '활성', value: 'true' },
					{ label: '비활성', value: 'false' },
				],
				defaultValue: selected?.isActive ? 'true' : 'false',
			},
		],
		[selected]
	);

	const formMethodsRef = useRef<UseFormReturn<
		Record<string, unknown>
	> | null>(null);
	const onFormReady = (m: UseFormReturn<Record<string, unknown>>) =>
		(formMethodsRef.current = m);
	const handleSave = () =>
		formMethodsRef.current?.handleSubmit((data) => {
			if (!selected) return;
			const next = {
				...selected,
				name: String(data.name || selected.name),
				version: String(data.version || selected.version),
				isActive:
					String(
						data.isActive || (selected.isActive ? 'true' : 'false')
					) === 'true',
			};
			setTemplates((prev) =>
				prev.map((t) => (t.id === selected.id ? next : t))
			);
			setSelected(next);
		})();
	const handleReset = () => formMethodsRef.current?.reset();

	return (
		<PageTemplate
			firstChildWidth="38%"
			splitterSizes={[38, 62]}
			splitterMinSize={[360, 560]}
			splitterGutterSize={8}
		>
			{/* 좌측: 템플릿 메타 정보 */}
			<div className="border rounded-lg h-full overflow-hidden">
				<FormComponent
					title="템플릿 정보"
					actionButtons={
						<div className="flex items-center gap-2.5">
							<RadixButton
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-white hover:bg-gray-50"
								onClick={handleReset}
							>
								초기화
							</RadixButton>
							<RadixButton
								className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-600 text-white hover:bg-Colors-Brand-700"
								onClick={handleSave}
							>
								저장
							</RadixButton>
						</div>
					}
				>
					<div className="space-y-3">
						<div className="bg-white rounded-lg shadow p-3">
							<ul className="divide-y">
								{templates.map((t) => (
									<li
										key={t.id}
										className={`py-2 px-2 cursor-pointer ${selected?.id === t.id ? 'bg-Colors-Brand-50' : ''}`}
										onClick={() => setSelected(t)}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-sm">
													{t.name}
												</p>
												<p className="text-xs text-gray-500">
													{t.version} · {t.updatedAt}
												</p>
											</div>
											<span
												className={`text-xs px-2 py-0.5 rounded ${t.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}
											>
												{t.isActive ? '활성' : '비활성'}
											</span>
										</div>
									</li>
								))}
							</ul>
						</div>
						<div className="bg-white rounded-lg shadow p-4">
							<DynamicForm
								fields={leftFormFields}
								onFormReady={onFormReady}
								visibleSaveButton={false}
							/>
						</div>
					</div>
				</FormComponent>
			</div>

			{/* 우측: 템플릿 미리보기 (간소화) */}
			<div className="border rounded-lg h-full overflow-auto">
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold">미리보기</h2>
				</div>
				<div className="p-4 space-y-4">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-base font-semibold mb-4">헤더</h3>
						<p className="text-sm text-gray-700">
							템플릿: {selected?.name} ({selected?.version})
						</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-base font-semibold mb-4">
							본문 예시
						</h3>
						<p className="text-sm text-gray-600">
							검사 결과 요약, 차트, 측정값 테이블 등이 배치됩니다.
						</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-base font-semibold mb-4">
							차트 예시
						</h3>
						<EchartComponent
							options={{
								tooltip: { trigger: 'item' as const },
								series: [
									{
										type: 'pie',
										radius: '60%',
										data: [
											{ value: 72, name: 'OK' },
											{ value: 18, name: 'WARNING' },
											{ value: 10, name: 'NG' },
										],
									},
								],
							}}
							height="280px"
						/>
					</div>
				</div>
			</div>
		</PageTemplate>
	);
};

export default QualityCertificateTemplatePage;
