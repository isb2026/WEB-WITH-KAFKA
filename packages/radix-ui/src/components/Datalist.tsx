import React from 'react';

export interface DatalistProps extends React.HTMLAttributes<HTMLDataListElement> {
	children?: React.ReactNode;
}
 
export const RadixDatalist = ({ children, ...props }: DatalistProps) => (
	<datalist {...props}>{children}</datalist>
); 