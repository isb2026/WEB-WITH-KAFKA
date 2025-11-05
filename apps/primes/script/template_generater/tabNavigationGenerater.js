import { parseTabInfo, getActionProperty } from '../utils/templateUtils.js';
import { safeGet, nullishCoalescing } from '../utils/compatibilityUtils.js';

export const TabNavigationGenerater = (
	tabKey,
	tabs,
	createType,
	defaultValue,
	title,
	actions = [],
	pageType = 'singlePage', // 페이지 타입 추가
	moduleRoute = '', // 모듈 기본 경로 추가
	moduleKey = '' // 번역 키를 위한 모듈 키 추가
) => {
	// 페이지 타입에 따라 등록 방식 결정
	let hasModal = createType === 'modal';
	let hasNavigation = createType === 'navigation';

	// 페이지 타입이 masterDetailPage이면 navigation 방식으로 강제 변경
	if (pageType === 'masterDetailPage') {
		hasModal = false;
		hasNavigation = true;
	} else if (pageType === 'singlePage') {
		// singlePage는 기본적으로 modal 방식
		hasModal = true;
		hasNavigation = false;
	}

	// 탭 정보 파싱 (유틸리티 함수 사용)
	const tabItems = parseTabInfo(tabs);

	// 액션 버튼 생성 로직 개선
	const generateActionButton = () => {
		if (hasModal) {
			return `
	const RegisteButton = () => {
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => setOpenModal(true)}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};`;
		} else if (hasNavigation) {
			// Optional chaining 대신 호환성 함수 사용
			const createAction = actions.find((a) => a && a.type === 'create');
			// 모듈 기본 경로에 /register 추가
			const navigatePath = moduleRoute
				? `${moduleRoute}/register`
				: '/register';
			return `
	const RegisteButton = () => {
		const navigate = useNavigate();
		
		return (
			<div className="ml-auto shrink-0 flex-grow-0 flex gap-2">
				<RadixIconButton
					className="bg-Colors-Brand-700 flex gap-2 px-3 py-2 text-white rounded-lg text-sm items-center hover:bg-Colors-Brand-800 transition-colors"
					onClick={() => navigate('${navigatePath}')}
				>
					<Plus size={16} />
					{t('tabs.actions.register')}
				</RadixIconButton>
			</div>
		);
	};`;
		}
		return '';
	};

	// 모달 다이얼로그 생성 로직
	const generateModalDialog = () => {
		if (hasModal) {
			const createAction = actions.find((a) => a && a.type === 'create');
			const actionTitle = safeGet(createAction, 'title', '등록');
			const pageName = safeGet(createAction, 'pageName', 'div');
			return `
			<DraggableDialog
				open={openModal}
				onOpenChange={setOpenModal}
				title={t('tabs.actions.register')}
				content={<${pageName} onClose={() => setOpenModal(false)} />}
			/>`;
		}
		return '';
	};

	// SetActionButton 함수 생성 개선
	const generateSetActionButton = () => {
		const tabCases = tabItems
			.map(
				(tab) => `			case '${tab.id}':
				return <RegisteButton />;`
			)
			.join('\n');

		return `
	const SetActionButton = (tab: string) => {
		switch (tab) {
${tabCases}
			default:
				return null;
		}
	};`;
	};

	// useEffect 로직 개선 - 더 안정적인 경로 매칭
	const generateUseEffect = () => {
		const tabCases = tabItems
			.map(
				(
					tab
				) => `		if (pathname === '${tab.path}' || pathname.startsWith('${tab.path}/')) {
			setCurrentTab('${tab.id}');
			return;
		}`
			)
			.join('\n');

		return `
	useEffect(() => {
		const pathname = location.pathname;
${tabCases}
	}, [location.pathname]);`;
	};

	// 타입 정의 개선
	const generateTypeDefinitions = () => {
		return `interface TabNavigationProps {
	activetab?: string;
}`;
	};

	return `import React, { useState, useEffect } from 'react';
import TabLayout from '@primes/layouts/TabLayout';
import { TabItem } from '@primes/templates/TabTemplate';
import { RadixIconButton } from '@radix-ui/components';
import { Plus } from 'lucide-react';
import { useLocation${hasNavigation ? ', useNavigate' : ''} } from 'react-router-dom';
import { useTranslation } from '@repo/i18n';
${hasModal ? "import { DraggableDialog } from '@repo/radix-ui/components';" : ''}

${generateTypeDefinitions()}

const ${tabKey}: React.FC<TabNavigationProps> = ({ activetab }) => {
	const { t } = useTranslation('common');
	const [currentTab, setCurrentTab] = useState<string>(activetab || ${defaultValue});
	${hasModal ? 'const [openModal, setOpenModal] = useState<boolean>(false);' : ''}
	const location = useLocation();

${generateUseEffect()}

	// Tab 아이템 정의
	const tabs: TabItem[] = [
${tabs}
	];

${generateActionButton()}
${generateSetActionButton()}

	return (
		<>
${generateModalDialog()}
			<TabLayout
				title={t('tabs.titles.${moduleKey}Management')}
				tabs={tabs}
				defaultValue={currentTab}
				buttonSlot={SetActionButton(currentTab)}
				onValueChange={setCurrentTab}
			/>
		</>
	);
};

export default ${tabKey};
`;
};
