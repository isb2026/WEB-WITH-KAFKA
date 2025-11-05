import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { PhotoProvider, PhotoView } from 'react-photo-view';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// Import react-photo-view styles
import 'react-photo-view/dist/react-photo-view.css';

import './../styles.css';

export interface ImageGalleryProps {
	images: string[];
	className?: string;
	mainSwiperClassName?: string;
	thumbsSwiperClassName?: string;
	showNavigation?: boolean;
	spaceBetween?: number;
	thumbsPerView?: number;
	initialSlide?: number;
	editable?: boolean;
	deleteImage?: (image: string, index: number) => void;
	editImage?: (image: string, index: number, newImage: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
	images,
	className = '',
	mainSwiperClassName = '',
	thumbsSwiperClassName = '',
	showNavigation = true,
	spaceBetween = 4,
	thumbsPerView = 6,
	initialSlide = 0,
	editable = false,
	deleteImage,
	editImage,
}) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editInput, setEditInput] = useState<string>('');

	const handleEdit = (image: string, index: number) => {
		setEditingIndex(index);
		setEditInput(image);
	};

	const handleSaveEdit = () => {
		if (editingIndex !== null && editImage && editInput.trim()) {
			editImage(images[editingIndex], editingIndex, editInput.trim());
			setEditingIndex(null);
			setEditInput('');
		}
	};

	const handleCancelEdit = () => {
		setEditingIndex(null);
		setEditInput('');
	};

	const handleDelete = (image: string, index: number) => {
		if (deleteImage && window.confirm('이미지를 삭제하시겠습니까?')) {
			deleteImage(image, index);
		}
	};

	return (
		<div className={`flex flex-col flex-1 ${className}`}>
			{/* Thumbnails Swiper - moved above */}
			<div className="rounded p-2">
				<Swiper
					onSwiper={setThumbsSwiper}
					spaceBetween={spaceBetween}
					slidesPerView={thumbsPerView}
					freeMode
					watchSlidesProgress
					initialSlide={initialSlide}
					modules={[FreeMode, Navigation, Thumbs]}
					className={`rounded thumb-swiper ${thumbsSwiperClassName}`}
				>
					{images.map((image, index) => (
						<SwiperSlide
							key={index}
							className="cursor-pointer !h-full border flex items-center justify-center rounded-lg overflow-hidden relative group"
						>
							{editingIndex === index ? (
								// 편집 모드
								<div className="w-full h-full flex flex-col items-center justify-center p-2 bg-white">
									<input
										type="text"
										value={editInput}
										onChange={(e) =>
											setEditInput(e.target.value)
										}
										className="w-full px-2 py-1 border rounded text-sm mb-2"
										placeholder="이미지 URL을 입력하세요"
									/>
									<div className="flex gap-1">
										<button
											onClick={handleSaveEdit}
											className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
										>
											저장
										</button>
										<button
											onClick={handleCancelEdit}
											className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
										>
											취소
										</button>
									</div>
								</div>
							) : (
								// 일반 모드
								<>
									<img
										src={image}
										alt={`Thumbnail ${index + 1}`}
										className="h-full w-auto object-cover"
									/>
									{editable && (
										<div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="flex gap-1">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleEdit(
															image,
															index
														);
													}}
													className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-blue-600"
													title="수정"
												>
													✏️
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(
															image,
															index
														);
													}}
													className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-600"
													title="삭제"
												>
													🗑️
												</button>
											</div>
										</div>
									)}
								</>
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Main Swiper */}
			<div className="flex-1 p-2">
				<PhotoProvider>
					<Swiper
						style={
							{
								'--swiper-navigation-color': '#fff',
								'--swiper-pagination-color': '#fff',
							} as React.CSSProperties
						}
						spaceBetween={spaceBetween}
						navigation={showNavigation}
						initialSlide={initialSlide}
						thumbs={{
							swiper:
								thumbsSwiper && !thumbsSwiper.destroyed
									? thumbsSwiper
									: null,
						}}
						modules={[FreeMode, Navigation, Thumbs]}
						className={`main-swiper ${mainSwiperClassName}`}
					>
						{images.map((image, index) => (
							<SwiperSlide key={index}>
								<PhotoView src={image}>
									<div className="relative w-full h-full group">
										<img
											src={image}
											alt={`Image ${index + 1}`}
											className="w-full h-full object-contain cursor-pointer border rounded-lg"
										/>
										{editable && (
											<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<div className="flex gap-2">
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleEdit(
																image,
																index
															);
														}}
														className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
													>
														수정
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(
																image,
																index
															);
														}}
														className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
													>
														삭제
													</button>
												</div>
											</div>
										)}
									</div>
								</PhotoView>
							</SwiperSlide>
						))}
					</Swiper>
				</PhotoProvider>
			</div>
		</div>
	);
};
