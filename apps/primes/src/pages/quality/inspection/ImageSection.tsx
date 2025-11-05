import React, { useState, useMemo, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { RadixIconButton } from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { ImageGallery } from '@repo/swiper';
import { useResponsive } from '@primes/hooks';
import { FileUploadResponse } from '@primes/types/common/file';
import { FileLinkDto } from '@primes/types/fileUrl';
import { useFileUpload } from '@primes/hooks/common/useFileUpload';
import { useFileLinkListQuery, useCreateFileLink } from '@primes/hooks/common/useFileLink';
import { FileOwnerType } from '@primes/types/fileUrl';
import { toast } from 'sonner';

// 이미지 섹션 props 인터페이스
export interface ImageSectionProps {
	// 필수 props
	targetId: number;
	ownerType: string;
	
	// 선택적 props
	title?: string;
	className?: string;
	showUploadButton?: boolean;
	showTitle?: boolean;
	maxImages?: number;
	allowedFileTypes?: string[];
	maxFileSize?: number; // MB 단위
	
	// 커스텀 스타일링
	imageSectionClassName?: string;
	uploadButtonClassName?: string;
	
	// 이벤트 핸들러
	onImageUpload?: (file: File, response: FileUploadResponse) => void;
	onImageDelete?: (filePath: string) => void;
	onError?: (error: string) => void;
	
	// 초기 이미지 (외부에서 추가로 제공할 이미지들)
	additionalImages?: string[];
}

// 기본값 정의
const defaultProps: Partial<ImageSectionProps> = {
	title: '이미지 뷰어',
	className: '',
	showUploadButton: true,
	showTitle: true,
	maxImages: 50,
	allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
	maxFileSize: 10, // 10MB
	imageSectionClassName: '',
	uploadButtonClassName: '',
	additionalImages: [],
};

const ImageSection: React.FC<ImageSectionProps> = (props) => {
	// props와 기본값 병합
	const {
		targetId,
		ownerType,
		title,
		className,
		showUploadButton,
		showTitle,
		maxImages,
		allowedFileTypes,
		maxFileSize,
		imageSectionClassName,
		uploadButtonClassName,
		onImageUpload,
		onImageDelete,
		onError,
		additionalImages,
	} = { ...defaultProps, ...props };

	const { t: tCommon } = useTranslation('common');
	const { isMobile, isTablet } = useResponsive();

	// 로컬 상태 관리
	const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [isInitialized, setIsInitialized] = useState(false);

	// File API 연동
	const {
		uploadState,
		handleFileUpload,
		resetUpload,
		clearError,
	} = useFileUpload();

	// FileLink API를 통한 이미지 조회
	const itemImageLinks = useFileLinkListQuery({
		searchRequest: {
			ownerTable: 'item_progress',
			ownerType: ownerType as FileOwnerType,
			ownerId: targetId,
			isUse: true
		},
		page: 0,
		size: maxImages || 50
	});

	// FileLink 생성 훅
	const createFileLinkMutation = useCreateFileLink();

	// 모든 이미지 URL 통합
	const allImages = useMemo(() => {
		// FileUploadResponse에서 파일 경로 추출
		const uploadedImageUrls = uploadedFiles.map(file => file.data.filePath);
		
		// FileLink API에서 이미지 URL 추출
		const itemImageUrls = (itemImageLinks?.data as any)?.content?.map((link: FileLinkDto) => 
			"https://api.orcamaas.com/file/" + link.url
		) || [];
		
		// 외부에서 제공된 추가 이미지들
		const externalImages = additionalImages || [];
		
		return [...uploadedImageUrls, ...itemImageUrls, ...externalImages];
	}, [uploadedFiles, itemImageLinks?.data, additionalImages]);

	// 컴포넌트 초기화 시 이미지 인덱스 설정
	useEffect(() => {
		if (!isInitialized && allImages.length > 0) {
			setActiveSlideIndex(0);
			setIsInitialized(true);
		}
	}, [allImages.length, isInitialized]);

	// 이미지 업로드 핸들러
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const imageFiles = Array.from(files).filter(file => {
			// 파일 타입 검증
			if (!allowedFileTypes?.includes(file.type)) {
				onError?.(`지원하지 않는 파일 형식입니다: ${file.type}`);
				return false;
			}
			
			// 파일 크기 검증
			if (file.size > (maxFileSize || 10) * 1024 * 1024) {
				onError?.(`파일 크기가 너무 큽니다. 최대 ${maxFileSize}MB까지 업로드 가능합니다.`);
				return false;
			}
			
			return true;
		});
		
		if (imageFiles.length === 0) return;

		try {
			// 단일 파일씩 순차적으로 업로드
			for (const file of imageFiles) {
				const result = await handleFileUpload(file);
				if (result) {
					// 업로드 성공 시 파일 목록에 추가
					setUploadedFiles(prev => [...prev, result]);
					
					// FileLink 생성
					try {
						await createFileLinkMutation.mutateAsync({
							ownerTable: 'item_progress',
							ownerType: ownerType as FileOwnerType,
							ownerId: targetId,
							url: result.data.filePath,
							sortOrder: 1,
							isPrimary: false,
							description: `${file.name} - ${new Date().toLocaleString()}`
						});
						
						// 성공 메시지
						toast.success(`${file.name} 업로드 완료`);
						
						// 외부 콜백 호출
						onImageUpload?.(file, result);
						
					} catch (fileLinkError) {
						console.error('FileLink 생성 실패:', fileLinkError);
						onError?.(`이미지 업로드는 성공했지만 연결에 실패했습니다: ${file.name}`);
					}
				}
			}
			
			// 업로드 후 슬라이드 인덱스 조정
			const currentUploadedCount = uploadedFiles.length + imageFiles.length;
			setActiveSlideIndex(Math.max(0, currentUploadedCount - 1));
			
			// 파일 입력 초기화
			event.target.value = '';
			
		} catch (error) {
			console.error('Image upload failed:', error);
			onError?.(`이미지 업로드에 실패했습니다: ${error}`);
		}
	};

	// 이미지 삭제 핸들러 (선택사항)
	const handleImageDelete = (imageUrl: string) => {
		// 로컬 업로드된 파일에서 제거
		setUploadedFiles(prev => prev.filter(file => file.data.filePath !== imageUrl));
		
		// 외부 콜백 호출
		onImageDelete?.(imageUrl);
		
		// 슬라이드 인덱스 조정
		setActiveSlideIndex(prev => Math.max(0, prev - 1));
	};

	// 로딩 상태 표시
	if (uploadState.isUploading) {
		return (
			<div className={`flex flex-col border rounded-lg overflow-hidden ${className || ''} ${imageSectionClassName || ''}`}>
				{showTitle && (
					<div className="px-2 py-2 border-b">
						<div className="text-base font-bold">{title}</div>
					</div>
				)}
				<div className="flex items-center justify-center p-8">
					<div className="text-sm text-gray-500">이미지 업로드 중...</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`flex flex-col border rounded-lg overflow-hidden ${className || ''} ${imageSectionClassName || ''}`}>
			{/* 헤더 */}
			{showTitle && (
				<div className="px-2 py-2 border-b flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="text-base font-bold">{title}</div>
						{allImages.length > 0 && (
							<span className="text-xs text-gray-500">
								({allImages.length}개)
							</span>
						)}
					</div>
					
					{/* 업로드 버튼 */}
					{showUploadButton && (
						<RadixIconButton
							onClick={() => document.getElementById('image-upload')?.click()}
							disabled={uploadState.isUploading}
							className={`flex gap-1.5 px-2 py-1.5 rounded-lg ${isMobile ? 'text-xs' : 'text-sm'} items-center border hover:bg-gray-50 ${uploadState.isUploading ? 'opacity-50 cursor-not-allowed' : ''} ${uploadButtonClassName || ''}`}
						>
							<Upload size={14} />
							{uploadState.isUploading ? '업로드 중...' : ''}
						</RadixIconButton>
					)}
					
					{/* 숨겨진 파일 입력 */}
					{showUploadButton && (
						<input
							id="image-upload"
							type="file"
							multiple
							accept={allowedFileTypes?.join(',')}
							onChange={handleImageUpload}
							className="hidden"
							disabled={uploadState.isUploading}
						/>
					)}
				</div>
			)}
			
			{/* FileLink API 로딩 상태 표시 */}
			{itemImageLinks.isLoading && (
				<div className="flex items-center justify-center p-4">
					<div className="text-sm text-gray-500">이미지를 불러오는 중...</div>
				</div>
			)}
			
			{/* 이미지 갤러리 */}
			{!itemImageLinks.isLoading && (
				<>
					{allImages.length > 0 ? (
						<ImageGallery
							images={allImages}
							className=""
							mainSwiperClassName="rounded-lg overflow-hidden"
							thumbsSwiperClassName=""
							showNavigation={true}
							spaceBetween={10}
							thumbsPerView={isMobile ? 2 : 4}
							initialSlide={activeSlideIndex}
						/>
					) : (
						<div className="flex flex-col items-center justify-center p-8 text-center">
							<div className="text-sm text-gray-500 mb-2">
								등록된 이미지가 없습니다
							</div>
							<div className="text-xs text-gray-400">
								{showUploadButton ? '이미지를 업로드하거나 품목에 연결된 이미지를 확인하세요' : '품목에 연결된 이미지를 확인하세요'}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ImageSection; 