// src/IconProvider.tsx
import React, { useEffect, PropsWithChildren } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faBell,
	faUser,
	faCrown,
	faBuilding,
	faFolderPlus,
	faChartLine,
	faNewspaper,
	faTag,
	faBolt,
	faLanguage,
	faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

// 모듈 로딩 시점에 한 번만 실행
library.add(
	faBell,
	faUser,
	faCrown,
	faBuilding,
	faFolderPlus,
	faChartLine,
	faNewspaper,
	faTag,
	faBolt,
	faLanguage,
	faEnvelope
);

export const AweSomeIconProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	return <>{children}</>;
};
