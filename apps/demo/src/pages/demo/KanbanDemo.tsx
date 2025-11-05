import * as React from 'react';
import * as Kanban from '@repo/radix-ui/components';
import { cn } from '../../../../../packages/radix-ui/src/lib/utils';
import { GripVertical } from 'lucide-react';

interface KanbanItem {
	id: string;
	title: string;
	priority: 'High' | 'Medium' | 'Low';
	assignee: string;
	date: string;
}

interface KanbanData {
	[key: string]: KanbanItem[];
}

const initialData: KanbanData = {
	todo: [
		{
			id: '1',
			title: 'Add authentication',
			priority: 'High',
			assignee: 'John Doe',
			date: '2024-04-01',
		},
		{
			id: '2',
			title: 'Create API endpoints',
			priority: 'Medium',
			assignee: 'Jane Smith',
			date: '2024-04-05',
		},
		{
			id: '3',
			title: 'Write documentation',
			priority: 'Low',
			assignee: 'Bob Johnson',
			date: '2024-04-10',
		},
	],
	inProgress: [
		{
			id: '4',
			title: 'Design system components',
			priority: 'High',
			assignee: 'Alice Brown',
			date: '2024-03-28',
		},
		{
			id: '5',
			title: 'Initial commit',
			priority: 'Low',
			assignee: 'Frank White',
			date: '2024-03-24',
		},
		{
			id: '6',
			title: 'Setup project',
			priority: 'High',
			assignee: 'Eve Davis',
			date: '2024-03-25',
		},
	],
	done: [
		{
			id: '7',
			title: 'Implement dark mode',
			priority: 'Medium',
			assignee: 'Charlie Wilson',
			date: '2024-04-02',
		},
	],
};

export default function KanbanBoardDemo() {
	const [data, setData] = React.useState<KanbanData>(initialData);

	return (
		<div className="p-2">
			<Kanban.Root
				value={data}
				onValueChange={setData}
				getItemValue={(item: KanbanItem) => item.id}
			>
				<Kanban.Board className="gap-4 flex-wrap">
					{Object.entries(data).map(([columnId, items]) => (
						<Kanban.Column
							key={columnId}
							value={columnId}
							className="min-w-60 flex-grow-0 flex-shrink-0 basis-1/3 md:basis-1/4 lg:basis-1/5"
						>
							<div className="flex items-center justify-between p-2">
								<h2 className="text-lg font-semibold capitalize">
									{columnId.replace(/([A-Z])/g, ' $1').trim()}
								</h2>
								<Kanban.ColumnHandle className="bg-transparent p-0">
									<GripVertical color="#000" size={22} />
								</Kanban.ColumnHandle>
							</div>
							{items.map((item) => (
								<Kanban.Item
									key={item.id}
									value={item.id}
									asHandle
								>
									<div className="flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm dark:bg-gray-800 cursor-grab data-dragging:cursor-grabbing">
										<div className="flex items-center justify-between gap-1">
											<h3 className="font-sm text-black line-clamp-1">
												{item.title}
											</h3>
											<span
												className={cn(
													'px-2 py-0.4 rounded-md text-white text-sm font-medium',
													item.priority === 'High'
														? 'bg-red-500'
														: item.priority ===
															  'Medium'
															? 'bg-black'
															: 'bg-gray-400'
												)}
											>
												{item.priority}
											</span>
										</div>
										<div className="flex justify-between">
											<p className="text-xs text-gray-600">
												{item.assignee}
											</p>
											<p className="text-xs text-gray-600">
												{item.date}
											</p>
										</div>
									</div>
								</Kanban.Item>
							))}
						</Kanban.Column>
					))}
				</Kanban.Board>
				<Kanban.Overlay>
					{({ value, variant }) => (
						<div
							className={cn(
								variant === 'column'
									? 'flex flex-col gap-2 rounded-lg border bg-zinc-100 p-2.5 dark:bg-zinc-900 opacity-40'
									: 'rounded-md border bg-white p-3 shadow-sm dark:bg-gray-800 opacity-40'
							)}
						>
							{variant === 'column' ? (
								<div className="flex items-center justify-between p-2">
									<h2 className="text-lg font-semibold capitalize">
										{value
											.toString()
											.replace(/([A-Z])/g, ' $1')
											.trim()}
									</h2>
								</div>
							) : (
								data[
									Object.keys(data).find((key) =>
										data[key].some(
											(item) => item.id === value
										)
									)!
								]?.find((item) => item.id === value)?.title ||
								'Item'
							)}
						</div>
					)}
				</Kanban.Overlay>
			</Kanban.Root>
		</div>
	);
}
