import { createBrowserRouter } from 'react-router-dom';
import LayoutPage from '../layouts/Layout';
import TabsDemoWithCodePage from '../pages/TabsDemoWithCodePage';
import DialogDemoWithCodePage from '../pages/DialogDemoWithCodePage';
import CheckboxDemoWithCodePage from '../pages/CheckboxDemoWithCodePage';
import AvatarDemoWithCodePage from '../pages/AvatarDemoWithCodePage';
import ButtonDemoWithCodePage from '../pages/ButtonDemoWithCodePage';
import TextDemoWithCodePage from '../pages/TextDemoWithCodePage';
import HeadingDemoWithCodePage from '../pages/HeadingDemoWithCodePage';
import DatalistDemoWithCodePage from '../pages/DatalistDemoWithCodePage';
import IconButtonDemoWithCodePage from '../pages/IconButtonDemoWithCodePage';
import LayoutDemoWithCodePage from '../pages/LayoutDemoWithCodePage';
import SpinnerDemoWithCodePage from '../pages/SpinnerDemoWithCodePage';
import BadgeDemoWithCodePage from '../pages/BadgeDemoWithCodePage';
import CheckboxGroupDemoWithCodePage from '../pages/CheckboxGroupDemoWithCodePage';
import PopoverDemoWithCodePage from '../pages/PopoverDemoWithCodePage';
import RadioCardDemoWithCodePage from '../pages/RadioCardDemoWithCodePage';
import SwitchDemoWithCodePage from '../pages/SwitchDemoWithCodePage';
import FileUploadDemoWithCodePage from '../pages/FileUploadDemoWithCodePage';
import DropdownDemoWithCodePage from '../pages/DropdownDemoWithCodePage';
import TextInputDemoWithCodePage from '../pages/TextFieldDemoWithCodePage';
import DraggableDialogDemoWithCodePage from '../pages/DraggableDialogDemoWithCodePage';
import KanbanDemoWithCodePage from '../pages/KanbanDemoWithCodePage';
import TooltipDemoWithCodePage from '../pages/TooltipDemoWithCodePage';
import IconButtonComponentDemoCodePage from '../pages/IconButtonComponentCodeDemoPage';
import BadgeButtonCodeDemoPage from '../pages/BadgeButtonCodeDemoPage';
import SegmentedControlComponentCodeDemoPage from '../pages/SegmentedControlComponentCodeDemoPage';
import ItemSearchModalCodeDemoPage from '../pages/ItemSearchModalCodeDemoPage';
import LineChartDemoWithCodePage from '../pages/LineChartDemoWithCodePage';
import DataTableDemoWithCodePage from '../pages/DataTableDemoWithCodePage';
import SelectDemoWithCodePage from '../pages/SelectDemoWithCodePage';
import EditableDemoWithCodePage from '../pages/EditableDemoWithCodePage';
import BarChartDemoPage from '../pages/demo/BarChartDemoPage';
import BarChartDemoWithCodePage from '../pages/demo/BarChartDemoWithCodePage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <LayoutPage />, // 공통 레이아웃
		children: [
			{
				path: '/radix-ui',
				children: [
					{
						path: 'tabs',
						element: <TabsDemoWithCodePage />,
					},
					{
						path: 'dialog',
						element: <DialogDemoWithCodePage />,
					},
					{
						path: 'checkbox',
						element: <CheckboxDemoWithCodePage />,
					},
					{
						path: 'avatar',
						element: <AvatarDemoWithCodePage />,
					},
					{
						path: 'button',
						element: <ButtonDemoWithCodePage />,
					},
					{
						path: 'text',
						element: <TextDemoWithCodePage />,
					},
					{
						path: 'heading',
						element: <HeadingDemoWithCodePage />,
					},
					{
						path: 'spinner',
						element: <SpinnerDemoWithCodePage />,
					},
					{
						path: 'badge',
						element: <BadgeDemoWithCodePage />,
					},
					{
						path: 'checkbox',
						element: <CheckboxDemoWithCodePage />,
					},
					{
						path: 'checkbox-group',
						element: <CheckboxGroupDemoWithCodePage />,
					},
					{
						path: 'popover',
						element: <PopoverDemoWithCodePage />,
					},
					{
						path: 'radio-cards',
						element: <RadioCardDemoWithCodePage />,
					},
					{
						path: 'switch',
						element: <SwitchDemoWithCodePage />,
					},
					{
						path: 'file-upload',
						element: <FileUploadDemoWithCodePage />,
					},
					{
						path: 'datalist',
						element: <DatalistDemoWithCodePage />,
					},
					{
						path: 'icon-button',
						element: <IconButtonDemoWithCodePage />,
					},
					{
						path: 'layout',
						element: <LayoutDemoWithCodePage />,
					},
					{
						path: 'dropdown',
						element: <DropdownDemoWithCodePage />,
					},
					{
						path: 'text-field',
						element: <TextInputDemoWithCodePage />,
					},
					{
						path: 'kanban',
						element: <KanbanDemoWithCodePage />,
					},
					{
						path: 'select',
						element: <SelectDemoWithCodePage />,
					},
					{
						path: 'data-table',
						element: <DataTableDemoWithCodePage />,
					},
					{
						path: 'draggable-dialog',
						element: <DraggableDialogDemoWithCodePage />,
					},
					{
						path: 'editable',
						element: <EditableDemoWithCodePage />,
					},
					{
						path: 'tooltip',
						element: <TooltipDemoWithCodePage />,
					},
					{
						path: 'icon-button-component',
						element: <IconButtonComponentDemoCodePage />,
					},
					{
						path: 'badge-component',
						element: <BadgeButtonCodeDemoPage />,
					},
					{
						path: 'segmented-control',
						element: <SegmentedControlComponentCodeDemoPage />,
					},
					{
						path: 'item-search-modal',
						element: <ItemSearchModalCodeDemoPage />,
					},
				],
			},
			{
				path: '/echart/line',
				element: <LineChartDemoWithCodePage />,
			},
			{
				path: '/echart/bar',
				element: <BarChartDemoPage />,
			},
			{
				path: '/echart/bar/code',
				element: <BarChartDemoWithCodePage />,
			},
		],
	},
]);
