// apps/demo/src/pages/TabsDemo.tsx

import {
	RadixTabsRoot,
	RadixTabsList,
	RadixTabsTrigger,
	RadixTabsContent,
} from '@repo/radix-ui/components';

export default function App() {
	return (
		<RadixTabsRoot defaultValue="account">
			<RadixTabsList className="flex space-x-2 border-b p-2">
				<RadixTabsTrigger
					value="account"
					className="bg-red-600 text-white px-4 py-2 rounded 
			data-[state=active]:text-blue-600 
			data-[state=active]:border-b-2 
			data-[state=active]:border-blue-600 
			data-[state=active]:bg-white"
				>
					Account
				</RadixTabsTrigger>
				<RadixTabsTrigger
					value="documents"
					className="bg-red-600 text-white px-4 py-2 rounded 
			data-[state=active]:text-blue-600 
			data-[state=active]:border-b-2 
			data-[state=active]:border-blue-600 
			data-[state=active]:bg-white"
				>
					Documents
				</RadixTabsTrigger>
				<RadixTabsTrigger
					value="settings"
					className="bg-red-600 text-white px-4 py-2 rounded 
			data-[state=active]:text-blue-600 
			data-[state=active]:border-b-2 
			data-[state=active]:border-blue-600 
			data-[state=active]:bg-white"
				>
					Settings
				</RadixTabsTrigger>
			</RadixTabsList>

			<div className="pt-4">
				<RadixTabsContent
					value="account"
					className="p-4 bg-white rounded shadow"
				>
					<p className="text-gray-800">
						Make changes to your account.
					</p>
				</RadixTabsContent>
				<RadixTabsContent
					value="documents"
					className="p-4 bg-white rounded shadow"
				>
					<p className="text-gray-800">
						Access and update your documents.
					</p>
				</RadixTabsContent>
				<RadixTabsContent
					value="settings"
					className="p-4 bg-white rounded shadow"
				>
					<p className="text-gray-800">
						Edit your profile or update contact information.
					</p>
				</RadixTabsContent>
			</div>
		</RadixTabsRoot>
	);
}
