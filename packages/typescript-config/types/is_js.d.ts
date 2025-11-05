declare module 'is_js' {
	const is: {
		windows: () => boolean;
		chrome: () => boolean;
		firefox: () => boolean;
		safari: () => boolean;
		// 필요한 추가 메서드들 정의
		array: (input: any) => boolean;
		boolean: (input: any) => boolean;
		date: (input: any) => boolean;
		email: (input: any) => boolean;
		function: (input: any) => boolean;
		null: (input: any) => boolean;
		number: (input: any) => boolean;
		object: (input: any) => boolean;
		string: (input: any) => boolean;
	};
	export default is;
}
