export const addDelay = async (ms: number = 1000, promise: Promise<any>) => {
	await new Promise((resolve) => setTimeout(resolve, ms));
	return promise;
};
