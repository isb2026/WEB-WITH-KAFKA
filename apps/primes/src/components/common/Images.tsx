import React, { useState } from 'react';

interface ImagesProps {
	imageUrl: string;
	className?: {
		container?: string;
		image?: string;
	};
}

export const Images: React.FC<ImagesProps> = ({ imageUrl, className }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<div className={className?.container}>
				<img
					src={imageUrl}
					alt="image"
					className={`cursor-pointer hover:opacity-80 transition-opacity ${className?.image || ''}`}
					onClick={openModal}
				/>
			</div>

			{/* Modal for enlarged image */}
			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
					onClick={closeModal}
				>
					<div className="relative max-w-[90vw] max-h-[90vh]">
						<img
							src={imageUrl}
							alt="image enlarged"
							className="max-w-full max-h-full object-contain"
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				</div>
			)}
		</>
	);
};
