import { useLocale } from '@repo/i18n';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const LANGS = {
	en: 'English',
	ko: '한국어',
};

export const ToggleLocales: React.FC = () => {
	const [locale, setLocale] = useLocale();

	return (
		<Dropdown as="li" navbar>
			{/* ───── 드롭다운 토글 ───── */}
			<Dropdown.Toggle
				bsPrefix="toggle"
				as={Link}
				to="#!"
				className="pe-0 ps-2 nav-link"
			>
				{/* 언어 아이콘만 표시하거나 현재 언어 텍스트를 넣어도 OK */}
				<FontAwesomeIcon
					className="fs-6"
					transform="shrink-4"
					icon={['fas', 'language']}
				/>
			</Dropdown.Toggle>

			{/* ───── 드롭다운 메뉴 ───── */}
			<Dropdown.Menu className="dropdown-caret dropdown-menu-card dropdown-menu-end">
				{Object.entries(LANGS).map(([code, label]) => (
					<Dropdown.Item
						key={code}
						active={locale === code} // 현재 언어 하이라이트
						onClick={() => setLocale(code)} // 해당 언어로 전환
						role="button"
					>
						{label}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
