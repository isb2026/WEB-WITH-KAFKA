import React from 'react';
import {
	Box,
	Typography,
	Chip,
	Paper,
} from '@mui/material';
import { Building, MapPin, Folder, Network } from 'lucide-react';
import { GroupTreeNode } from '@esg/components/treeNavigation/GroupTreeNavigation';

interface SelectedNodeInfoProps {
	selectedNode: GroupTreeNode | null;
}

export const SelectedNodeInfo: React.FC<SelectedNodeInfoProps> = ({
	selectedNode,
}) => {
	if (!selectedNode) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 2,
					bgcolor: '#f8f9fa',
					border: '1px dashed #dee2e6',
					borderRadius: 2,
					textAlign: 'center',
				}}
			>
				<Typography variant="body2" color="textSecondary">
					분석할 그룹, 회사 또는 사업장을 선택해주세요
				</Typography>
			</Paper>
		);
	}

	// 노드 타입별 아이콘과 색상
	const getNodeTypeInfo = (type: string) => {
		switch (type) {
			case 'GROUP':
				return {
					icon: Network,
					color: '#1976d2',
					bgColor: '#e3f2fd',
					label: '그룹',
				};
			case 'COMPANY':
				return {
					icon: Building,
					color: '#2e7d32',
					bgColor: '#e8f5e8',
					label: '회사',
				};
			case 'WORKPLACE':
				return {
					icon: MapPin,
					color: '#ed6c02',
					bgColor: '#fff3e0',
					label: '사업장',
				};
			default:
				return {
					icon: Folder,
					color: '#666',
					bgColor: '#f5f5f5',
					label: '기타',
				};
		}
	};

	const typeInfo = getNodeTypeInfo(selectedNode.companyType);
	const IconComponent = typeInfo.icon;

	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				bgcolor: 'white',
				border: '1px solid #e0e0e0',
				borderRadius: 2,
				boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					mb: 2,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 48,
						height: 48,
						bgcolor: typeInfo.bgColor,
						borderRadius: '50%',
						color: typeInfo.color,
					}}
				>
					<IconComponent size={24} />
				</Box>
				
				<Box sx={{ flex: 1 }}>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							color: '#1a1a1a',
							mb: 0.5,
						}}
					>
						{selectedNode.name}
					</Typography>
					<Typography
						variant="body2"
						color="textSecondary"
						sx={{ mb: 1 }}
					>
						{typeInfo.label} • ID: {selectedNode.id}
					</Typography>
					
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
						<Chip
							label={typeInfo.label}
							size="small"
							sx={{
								bgcolor: typeInfo.bgColor,
								color: typeInfo.color,
								fontWeight: 600,
							}}
						/>
						<Chip
							label={`레벨 ${selectedNode.level}`}
							size="small"
							variant="outlined"
							sx={{
								borderColor: '#e0e0e0',
								color: '#666',
							}}
						/>
						{selectedNode.children && selectedNode.children.length > 0 && (
							<Chip
								label={`하위 ${selectedNode.children.length}개`}
								size="small"
								variant="outlined"
								sx={{
									borderColor: '#4caf50',
									color: '#4caf50',
								}}
							/>
						)}
					</Box>
				</Box>
			</Box>
			
			{/* 추가 정보 */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
					gap: 2,
					pt: 2,
					borderTop: '1px solid #f0f0f0',
				}}
			>
				<Box>
					<Typography variant="caption" color="textSecondary">
						회사 ID
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{selectedNode.companyId}
					</Typography>
				</Box>
				
				<Box>
					<Typography variant="caption" color="textSecondary">
						노드 타입
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{selectedNode.companyType}
					</Typography>
				</Box>
				
				<Box>
					<Typography variant="caption" color="textSecondary">
						트리 레벨
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{selectedNode.level}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
};
