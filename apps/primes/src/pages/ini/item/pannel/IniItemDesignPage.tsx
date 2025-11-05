import { useEffect, useState } from 'react';
import { ImageGallery } from '@repo/swiper';
import { mockImages } from '@primes/pages/quality/mock-data';
import { RadixIconButton } from '@repo/radix-ui/components';
import { Upload, Trash2 } from 'lucide-react';

export const IniItemDesignPage = () => {
	const [activeSlideIndex, setActiveSlideIndex] = useState(0);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	const allImages = [...mockImages, ...uploadedImages];

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const newImages: string[] = [];
		Array.from(files).forEach((file) => {
			if (file.type.startsWith('image/')) {
				newImages.push(URL.createObjectURL(file));
			}
		});

		if (newImages.length > 0) {
			const currentTotalImages =
				mockImages.length + uploadedImages.length;
			setUploadedImages((prev) => [...prev, ...newImages]);
			setActiveSlideIndex(currentTotalImages);
		}
	};
	const handleImageDelete = (image: string) => {
		setUploadedImages((prev) => prev.filter((img) => img !== image));
	};

	useEffect(() => {
		return () => {
			uploadedImages.forEach((url) => {
				if (url.startsWith('blob:')) URL.revokeObjectURL(url);
			});
		};
	}, [uploadedImages]);

	useEffect(() => {
		console.log(allImages);
	}, [allImages]);

	return (
		<div
			className={`w-full h-full flex flex-col  rounded-lg overflow-hidden`}
		>
			<div className="px-2 mt-2 flex items-center justify-end gap-2">
				<RadixIconButton
					onClick={() =>
						document.getElementById('image-upload')?.click()
					}
					className={`flex gap-1.5 px-2 py-1.5 rounded-lg text-sm items-center border hover:bg-gray-50`}
				>
					도면 업로드
					<Upload size={14} />
				</RadixIconButton>
				<input
					id="image-upload"
					type="file"
					multiple
					accept="image/*"
					onChange={handleImageUpload}
					className="hidden"
				/>
				<RadixIconButton
					onClick={() => {
						handleImageDelete(allImages[activeSlideIndex]);
					}}
					className={`flex gap-1.5 px-2 py-1.5 rounded-lg text-sm items-center border hover:bg-gray-50`}
				>
					<Trash2 size={14} />
				</RadixIconButton>
			</div>
			<ImageGallery
				images={allImages}
				className=""
				mainSwiperClassName="rounded-lg overflow-hidden"
				thumbsSwiperClassName=""
				showNavigation={true}
				spaceBetween={10}
				thumbsPerView={4}
				initialSlide={activeSlideIndex}
			/>
		</div>
	);
};
