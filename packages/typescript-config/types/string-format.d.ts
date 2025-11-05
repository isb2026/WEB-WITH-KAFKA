// global.d.ts
declare module 'string-format' {
	function format(template: string, ...args: any[]): string;
	export default format;
}
