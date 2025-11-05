// 개발 환경 전용 컨텍스트
import React, { createContext, useContext, useState, useEffect } from 'react';
import { devModeStore } from '../utils/devModeStore';

interface DevModeContextType {
	isDevMode: boolean;
	useLocalEndpoints: boolean;
	toggleEndpoints: () => void;
	currentEndpointMode: 'local' | 'server';
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);



export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const isDevMode = import.meta.env.VITE_DEV_MODE === 'true' && import.meta.env.DEV;
	
	// 전역 스토어에서 상태 가져오기
	const [useLocalEndpoints, setUseLocalEndpoints] = useState(() => {
		return isDevMode ? devModeStore.getUseLocalEndpoints() : false;
	});

	// 전역 스토어 변경 사항 구독
	useEffect(() => {
		if (!isDevMode) return;

		const unsubscribe = devModeStore.subscribe(() => {
			setUseLocalEndpoints(devModeStore.getUseLocalEndpoints());
		});

		return () => {
			unsubscribe();
		};
	}, [isDevMode]);

	const toggleEndpoints = () => {
		if (isDevMode) {
			const newValue = !useLocalEndpoints;
			devModeStore.setUseLocalEndpoints(newValue);
			console.log(`🔧 DEV MODE: Switching to ${newValue ? 'local' : 'server'} endpoints`);
		}
	};

	const currentEndpointMode: 'local' | 'server' = useLocalEndpoints ? 'local' : 'server';

	return (
		<DevModeContext.Provider value={{
			isDevMode,
			useLocalEndpoints,
			toggleEndpoints,
			currentEndpointMode
		}}>
			{children}
		</DevModeContext.Provider>
	);
};

export const useDevMode = () => {
	const context = useContext(DevModeContext);
	if (context === undefined) {
		throw new Error('useDevMode must be used within a DevModeProvider');
	}
	return context;
};