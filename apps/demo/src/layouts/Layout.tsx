import { Outlet } from 'react-router-dom';
import Aside from './Aside';

const LayoutPage = () => {
	return (
		<div className="flex w-full min-h-screen bg-gray-50">
			<Aside />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default LayoutPage;
