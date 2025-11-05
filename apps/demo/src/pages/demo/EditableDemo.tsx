import * as React from 'react';
import {
	Editable,
	EditableArea,
	EditableCancel,
	EditableInput,
	EditablePreview,
	EditableSubmit,
	EditableToolbar,
	EditableTrigger,
} from '@repo/radix-ui/components';
import { Button } from '@repo/radix-ui/components';

export function EditableDemo() {
	return (
		<Editable
			defaultValue="Click to edit"
			placeholder="Enter your text here"
		>
			<EditableArea>
				<EditablePreview />
				<EditableInput />
			</EditableArea>
			<div>
				<EditableTrigger asChild>
					<Button size="1">Edit</Button>
				</EditableTrigger>
			</div>
			<EditableToolbar>
				<EditableSubmit asChild>
					<Button size="1">Save</Button>
				</EditableSubmit>
				<EditableCancel asChild>
					<Button variant="outline" size="1">
						Cancel
					</Button>
				</EditableCancel>
			</EditableToolbar>
		</Editable>
	);
}
