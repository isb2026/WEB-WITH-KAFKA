import React, { useState } from 'react';
import { PrimesDatePicker, PrimesDatePickerPresets } from './PrimesDatePicker';
import {
	DateValueType,
	DataPickerComponent,
} from '@repo/react-tailwind-datepicker';
import { RadixIconButton } from '@repo/radix-ui/components';
import { Calendar } from 'lucide-react';

export const PrimesDatePickerDemo: React.FC = () => {
	const [showDemo, setShowDemo] = useState(false);
	const [simpleDate, setSimpleDate] = useState<DateValueType | null>(null);
	const [singleDate, setSingleDate] = useState<DateValueType | null>(null);
	const [monthDate, setMonthDate] = useState<DateValueType | null>(null);
	const [tailwindMonthDate, setTailwindMonthDate] =
		useState<DateValueType | null>(null);
	const [dateTimeValue, setDateTimeValue] = useState<DateValueType | null>(
		null
	);
	const [rangeDate, setRangeDate] = useState<DateValueType | null>(null);
	const [multiLangDate, setMultiLangDate] = useState<DateValueType | null>(
		null
	);

	if (!showDemo) {
		return (
			<RadixIconButton
				onClick={() => setShowDemo(true)}
				className="flex gap-1.5 px-2.5 py-1.5 rounded-lg text-sm items-center border bg-Colors-Brand-50 hover:bg-Colors-Brand-100 text-Colors-Brand-700 border-Colors-Brand-200"
			>
				<Calendar size={16} />
				DatePicker 데모
			</RadixIconButton>
		);
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
			<div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-Colors-Brand-700">
						🎨 Primes DatePicker 데모
					</h2>
					<button
						onClick={() => setShowDemo(false)}
						className="text-gray-500 hover:text-gray-700 text-xl"
					>
						✕
					</button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 1. Simple DatePicker */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							📅 Simple DatePicker
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								간단한 날짜 선택 (단축키 없음)
							</label>
							<PrimesDatePicker
								mode="simple"
								value={simpleDate}
								onChange={setSimpleDate}
								placeholder="날짜를 선택하세요"
							/>
							{simpleDate?.startDate && (
								<p className="text-sm text-Colors-Brand-600 mt-2">
									선택된 날짜:{' '}
									{new Date(
										simpleDate.startDate
									).toLocaleDateString('ko-KR')}
								</p>
							)}
						</div>
					</div>

					{/* 2. Single DatePicker (풀 기능) */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							📆 Single DatePicker
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								풀 기능 (단축키 포함)
							</label>
							<PrimesDatePicker
								mode="single"
								value={singleDate}
								onChange={setSingleDate}
								placeholder="날짜를 선택하세요"
							/>
							{singleDate?.startDate && (
								<p className="text-sm text-Colors-Brand-600 mt-2">
									선택된 날짜:{' '}
									{new Date(
										singleDate.startDate
									).toLocaleDateString('ko-KR')}
								</p>
							)}
						</div>
					</div>

					{/* 3. Month Picker - 네이티브 */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							📅 Month Picker (네이티브)
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								년월 선택 - HTML input[type="month"]
							</label>
							<PrimesDatePicker
								mode="month"
								value={monthDate}
								onChange={setMonthDate}
								placeholder="년월을 선택하세요"
							/>
							{monthDate?.startDate && (
								<p className="text-sm text-Colors-Brand-600 mt-2">
									선택된 년월:{' '}
									{new Date(
										monthDate.startDate
									).toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'long',
									})}
								</p>
							)}
						</div>
					</div>

					{/* 4. Month Picker - react-datepicker 버전 */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							📅 Month Picker (react-datepicker)
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								년월 선택 - react-datepicker (월별 전용 UI)
							</label>
							<PrimesDatePicker
								mode="month-react"
								value={tailwindMonthDate}
								onChange={setTailwindMonthDate}
								placeholder="년월을 선택하세요"
							/>
							<p className="text-xs text-green-600 mt-1">
								✅ 월별 전용 달력이 표시됩니다
							</p>
							{tailwindMonthDate?.startDate && (
								<p className="text-sm text-Colors-Brand-600 mt-2">
									선택된 년월:{' '}
									{new Date(
										tailwindMonthDate.startDate
									).toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'long',
									})}
								</p>
							)}
						</div>
					</div>

					{/* 4. Date Range Picker */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							📊 Date Range Picker
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								날짜 범위 선택
							</label>
							<PrimesDatePicker
								mode="range"
								value={rangeDate}
								onChange={setRangeDate}
								placeholder="기간을 선택하세요"
							/>
							{rangeDate?.startDate && rangeDate?.endDate && (
								<div className="text-sm text-Colors-Brand-600 mt-2 space-y-1">
									<p>
										시작일:{' '}
										{new Date(
											rangeDate.startDate
										).toLocaleDateString('ko-KR')}
									</p>
									<p>
										종료일:{' '}
										{new Date(
											rangeDate.endDate
										).toLocaleDateString('ko-KR')}
									</p>
									<p className="font-medium">
										총 기간:{' '}
										{Math.ceil(
											(new Date(
												rangeDate.endDate
											).getTime() -
												new Date(
													rangeDate.startDate
												).getTime()) /
												(1000 * 60 * 60 * 24) +
												1
										)}
										일
									</p>
								</div>
							)}
						</div>
					</div>

					{/* 5. DateTime Picker */}
					<div className="space-y-3">
						<h3 className="text-lg font-semibold text-Colors-Brand-600">
							🕐 DateTime Picker
						</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								날짜 + 시간 선택 (react-datepicker)
							</label>
							<PrimesDatePicker
								mode="datetime"
								value={dateTimeValue}
								onChange={setDateTimeValue}
								placeholder="날짜와 시간을 선택하세요"
							/>
							<p className="text-xs text-green-600 mt-1">
								✅ 5분 간격으로 시간 선택 가능
							</p>
							{dateTimeValue?.startDate && (
								<p className="text-sm text-Colors-Brand-600 mt-2">
									선택된 날짜시간:{' '}
									{new Date(
										dateTimeValue.startDate
									).toLocaleString('ko-KR')}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* 6. 다국어 테스트 */}
				<div className="mt-6 space-y-3">
					<h3 className="text-lg font-semibold text-Colors-Brand-600">
						🌍 다국어 DatePicker
					</h3>
					<div className="bg-gray-50 p-4 rounded-lg">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							한국어/영어/태국어 지원
						</label>
						<PrimesDatePicker
							mode="single"
							value={multiLangDate}
							onChange={setMultiLangDate}
							placeholder="언어를 선택하고 날짜를 선택하세요"
							showLanguageToggle={true}
						/>
						{multiLangDate?.startDate && (
							<p className="text-sm text-Colors-Brand-600 mt-2">
								선택된 날짜:{' '}
								{new Date(
									multiLangDate.startDate
								).toLocaleDateString('ko-KR')}
							</p>
						)}
					</div>
				</div>

				{/* 테스트 결과 */}
				<div className="mt-6 bg-Colors-Brand-50 border border-Colors-Brand-200 rounded-lg p-4">
					<h3 className="text-lg font-semibold text-Colors-Brand-800 mb-3">
						📋 테스트 결과 (JSON)
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
						<div>
							<span className="font-medium text-Colors-Brand-700">
								Simple:
							</span>
							<span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
								{simpleDate?.startDate
									? new Date(simpleDate.startDate)
											.toISOString()
											.slice(0, 10)
									: 'null'}
							</span>
						</div>
						<div>
							<span className="font-medium text-Colors-Brand-700">
								Single:
							</span>
							<span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
								{singleDate?.startDate
									? new Date(singleDate.startDate)
											.toISOString()
											.slice(0, 10)
									: 'null'}
							</span>
						</div>
						<div>
							<span className="font-medium text-Colors-Brand-700">
								Month:
							</span>
							<span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
								{monthDate?.startDate
									? new Date(monthDate.startDate)
											.toISOString()
											.slice(0, 7)
									: 'null'}
							</span>
						</div>
						<div>
							<span className="font-medium text-Colors-Brand-700">
								DateTime:
							</span>
							<span className="ml-2 font-mono bg-white px-2 py-1 rounded border text-xs">
								{dateTimeValue?.startDate
									? new Date(dateTimeValue.startDate)
											.toISOString()
											.slice(0, 16)
									: 'null'}
							</span>
						</div>
						<div>
							<span className="font-medium text-Colors-Brand-700">
								Range:
							</span>
							<span className="ml-2 font-mono bg-white px-2 py-1 rounded border text-xs">
								{rangeDate?.startDate && rangeDate?.endDate
									? `${new Date(rangeDate.startDate).toISOString().slice(0, 10)} ~ ${new Date(rangeDate.endDate).toISOString().slice(0, 10)}`
									: 'null'}
							</span>
						</div>
					</div>
				</div>

				<div className="flex justify-end mt-6 pt-4 border-t">
					<button
						onClick={() => setShowDemo(false)}
						className="px-4 py-2 text-sm text-white bg-Colors-Brand-600 rounded-md hover:bg-Colors-Brand-700 transition-colors"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};

export default PrimesDatePickerDemo;
