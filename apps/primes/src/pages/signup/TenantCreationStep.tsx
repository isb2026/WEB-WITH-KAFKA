import React, { useState, useRef } from 'react';
import { RadixTextInput, Button } from '@repo/radix-ui/components';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { SignUpData } from '../SignUp';
import { uploadFile, getFileUrl } from '@primes/services/common/fileService';

interface TenantCreationStepProps {
	data: SignUpData;
	onUpdate: (data: Partial<SignUpData>) => void;
}


export const TenantCreationStep: React.FC<TenantCreationStepProps> = ({
	data,
	onUpdate,
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const dragCounterRef = useRef(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const formatBusinessNumber = (value: string) => {
		// 숫자만 추출
		const numbers = value.replace(/[^\d]/g, '');
		
		// 사업자등록번호 형식으로 포맷팅 (000-00-00000)
		if (numbers.length <= 3) {
			return numbers;
		} else if (numbers.length <= 5) {
			return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
		} else {
			return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
		}
	};

	const handleCompanyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatBusinessNumber(e.target.value);
		onUpdate({ companyNumber: formatted });
	};

	const validateFile = (file: File): string | null => {
		// 파일 타입 검증
		if (!file.type.startsWith('image/')) {
			return '이미지 파일만 업로드할 수 있습니다.';
		}
		
		// 파일 크기 검증 (5MB)
		if (file.size > 5 * 1024 * 1024) {
			return '파일 크기는 5MB 이하여야 합니다.';
		}
		
		return null;
	};

	const handleImageUpload = async (file: File) => {
		if (!file) return;

		// 파일 검증
		const validationError = validateFile(file);
		if (validationError) {
			alert(validationError);
			return;
		}

		setIsUploading(true);

		try {
			// 기존 파일 서비스 사용
			const result = await uploadFile(file);
			
			// 업로드된 파일 URL 생성
			if (result.data && result.data.fileName) {
				const fileUrl = getFileUrl(result.data.fileName);
				onUpdate({ companyLogo: fileUrl });
			}
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
			alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다. 다시 시도해주세요.');
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImageUpload(file);
		}
	};

	const handleRemoveImage = () => {
		onUpdate({ companyLogo: '' });
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	// 드래그앤드롭 핸들러들 - 카운터 방식으로 안정적인 상태 관리
	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current++;
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDragOver(true);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current--;
		if (dragCounterRef.current === 0) {
			setIsDragOver(false);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		
		// 드래그 상태 초기화
		dragCounterRef.current = 0;
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			handleImageUpload(file);
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-2">
					회사 정보를 입력해주세요
				</h3>
				<p className="text-sm text-gray-600">
					테넌트 생성을 위한 회사 기본 정보가 필요합니다
				</p>
			</div>

			{/* 테넌트명 (회사명) */}
			<div>
				<label
					htmlFor="tenant-name"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					회사명 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="tenant-name"
					type="text"
					value={data.tenantName}
					onChange={(e) => onUpdate({ tenantName: e.target.value })}
					placeholder="회사명을 입력하세요"
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					required
				/>
			</div>

			{/* 사업자등록번호 */}
			<div>
				<label
					htmlFor="company-number"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					사업자등록번호 <span className="text-red-500">*</span>
				</label>
				<RadixTextInput
					id="company-number"
					type="text"
					value={data.companyNumber}
					onChange={handleCompanyNumberChange}
					placeholder="000-00-00000"
					maxLength={12}
					className="w-full h-12 px-4 border border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all bg-white text-sm shadow-sm placeholder-gray-400"
					style={{
						height: '48px',
						borderRadius: '12px',
					}}
					required
				/>
				<p className="text-xs text-gray-500 mt-1">
					사업자등록번호 10자리를 입력하세요 (자동으로 하이픈이 추가됩니다)
				</p>
			</div>

			{/* 회사 로고 업로드 */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					회사 로고 <span className="text-red-500">*</span>
				</label>
				
				{/* 숨겨진 파일 입력 */}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileInputChange}
					className="hidden"
				/>

				{data.companyLogo ? (
					/* 업로드된 이미지 표시 */
					<div className="relative">
						<div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
							<img
								src={data.companyLogo}
								alt="회사 로고"
								className="w-16 h-16 object-cover rounded-lg border border-gray-200"
							/>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-700">회사 로고가 업로드되었습니다</p>
								<p className="text-xs text-gray-500">클릭하여 다른 이미지로 변경하거나 삭제할 수 있습니다</p>
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={handleUploadClick}
									disabled={isUploading}
									className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
								>
									<Upload className="w-4 h-4 mr-1" />
									변경
								</Button>
								<Button
									type="button"
									onClick={handleRemoveImage}
									disabled={isUploading}
									className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
								>
									<X className="w-4 h-4 mr-1" />
									삭제
								</Button>
							</div>
						</div>
					</div>
				) : (
					/* 업로드 영역 */
					<div
						onClick={handleUploadClick}
						onDragOver={handleDragOver}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 min-h-[140px] flex items-center justify-center ${
							isUploading 
								? 'border-purple-400 bg-purple-50' 
								: isDragOver
								? 'border-purple-500 bg-purple-100'
								: 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
						}`}
					>
						{isUploading ? (
							<div className="flex flex-col items-center justify-center h-20 space-y-2">
								<div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
								<p className="text-sm text-purple-600 font-medium">업로드 중...</p>
							</div>
						) : isDragOver ? (
							<div className="flex flex-col items-center justify-center h-20 space-y-2">
								<ImageIcon className="w-8 h-8 text-purple-500" />
								<p className="text-sm text-purple-600 font-medium">파일을 놓아주세요</p>
								<p className="text-xs text-purple-500">이미지 파일을 여기에 드롭하세요</p>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-20 space-y-1">
								<ImageIcon className="w-8 h-8 text-gray-400" />
								<p className="text-sm text-gray-600 font-medium">회사 로고 업로드</p>
								<p className="text-xs text-gray-500">클릭하여 이미지를 선택하거나 드래그하여 업로드하세요</p>
								<p className="text-xs text-gray-400">JPG, PNG, GIF (최대 5MB)</p>
							</div>
						)}
					</div>
				)}
			</div>


			{/* 안내 메시지 */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg
							className="h-5 w-5 text-blue-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">
							테넌트 생성 안내
						</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>
								입력하신 회사 정보를 바탕으로 독립적인 테넌트 환경이 생성됩니다.
								테넌트는 회사의 데이터와 설정을 안전하게 분리하여 관리합니다.
							</p>
							<p className="mt-1 font-medium">
								<span className="text-red-600">*</span> 표시된 항목은 필수 입력 사항입니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
