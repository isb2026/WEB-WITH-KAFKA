import React from 'react';
import { getIconComponent, isValidIcon } from '../../utils/iconMapping';
import * as LucideIcons from 'lucide-react';

interface SubmenuIconProps {
	iconName: string;
	className?: string;
	size?: number;
}

const SubmenuIcon: React.FC<SubmenuIconProps> = ({ 
	iconName, 
	className = "w-4 h-4 text-gray-500 dark:text-gray-400",
	size = 16 
}) => {
	// First try to get the icon directly from Lucide
	if (isValidIcon(iconName)) {
		const DirectIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
		return <DirectIcon className={className} size={size} />;
	}
	
	// If not found directly, try to get it from the mapping
	const IconComponent = getIconComponent(iconName);
	
	// If we still don't have a valid icon, use a fallback
	if (!IconComponent || IconComponent === LucideIcons.Circle) {
		// Enhanced fallback logic with more specific matches
		const fallbackIcon = 
			iconName === 'StretchHorizontal'? LucideIcons.StretchHorizontal:
			iconName === 'UserPlus' ? LucideIcons.UserPlus :
			iconName === 'Calculator' ? LucideIcons.Calculator :
			iconName === 'PlayCircle' ? LucideIcons.Play :
			iconName === 'Analytics' ? LucideIcons.BarChart3 :
			iconName === 'Assessment' ? LucideIcons.ClipboardCheck :
			iconName === 'ClipboardList' ? LucideIcons.ClipboardList :
			iconName === 'PackageCheck' ? LucideIcons.PackageCheck :
			iconName === 'MapPin' ? LucideIcons.MapPin :
			iconName === 'Building' ? LucideIcons.Building :
			iconName === 'FileText' ? LucideIcons.FileText :
			iconName === 'CheckCircle' ? LucideIcons.CheckCircle :
			iconName === 'Truck' ? LucideIcons.Truck :
			iconName === 'Package' ? LucideIcons.Package :
			iconName === 'Users' ? LucideIcons.Users :
			iconName === 'Settings' ? LucideIcons.Settings :
			iconName === 'Monitor' ? LucideIcons.Monitor :
			iconName === 'ListTree' ? LucideIcons.ListTree :
			iconName === 'Code' ? LucideIcons.Code :
			iconName === 'Calendar' ? LucideIcons.Calendar :
			iconName === 'BarChart2' ? LucideIcons.BarChart2 :
			iconName === 'Clipboard' ? LucideIcons.Clipboard :
			iconName === 'User' ? LucideIcons.User :
			iconName === 'FileText' ? LucideIcons.FileText :
			iconName === 'CheckCircle' ? LucideIcons.CheckCircle :
			iconName === 'Package' ? LucideIcons.Package :
			iconName === 'Truck' ? LucideIcons.Truck :
			iconName === 'Calculator' ? LucideIcons.Calculator :
			iconName === 'Clipboard' ? LucideIcons.Clipboard :
			iconName === 'Play' ? LucideIcons.Play :
			iconName === 'BarChart3' ? LucideIcons.BarChart3 :
			iconName === 'ClipboardCheck' ? LucideIcons.ClipboardCheck :
			iconName === 'Building' ? LucideIcons.Building :
			iconName === 'Monitor' ? LucideIcons.Monitor :
			iconName === 'List' ? LucideIcons.List :
			iconName === 'Code' ? LucideIcons.Code :
			iconName === 'Calendar' ? LucideIcons.Calendar :
			iconName === 'Settings' ? LucideIcons.Settings :
			iconName === 'BarChart2' ? LucideIcons.BarChart2 :
			// Generic fallbacks based on name patterns
			iconName.toLowerCase().includes('user') ? LucideIcons.User :
			iconName.toLowerCase().includes('file') ? LucideIcons.FileText :
			iconName.toLowerCase().includes('check') ? LucideIcons.CheckCircle :
			iconName.toLowerCase().includes('package') ? LucideIcons.Package :
			iconName.toLowerCase().includes('truck') ? LucideIcons.Truck :
			iconName.toLowerCase().includes('calculator') ? LucideIcons.Calculator :
			iconName.toLowerCase().includes('clipboard') ? LucideIcons.Clipboard :
			iconName.toLowerCase().includes('play') ? LucideIcons.Play :
			iconName.toLowerCase().includes('analytics') ? LucideIcons.BarChart3 :
			iconName.toLowerCase().includes('assessment') ? LucideIcons.ClipboardCheck :
			iconName.toLowerCase().includes('building') ? LucideIcons.Building :
			iconName.toLowerCase().includes('monitor') ? LucideIcons.Monitor :
			iconName.toLowerCase().includes('list') ? LucideIcons.List :
			iconName.toLowerCase().includes('code') ? LucideIcons.Code :
			iconName.toLowerCase().includes('calendar') ? LucideIcons.Calendar :
			iconName.toLowerCase().includes('settings') ? LucideIcons.Settings :
			iconName.toLowerCase().includes('bar') ? LucideIcons.BarChart2 :
			LucideIcons.Circle;
		
		const FallbackIcon = fallbackIcon as React.ElementType;
		return <FallbackIcon className={className} size={size} />;
	}
	
	return (
		<IconComponent 
			className={className}
			size={size}
		/>
	);
};

export default SubmenuIcon; 