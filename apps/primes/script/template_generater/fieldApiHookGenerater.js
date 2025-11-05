import { toPascalCase, toCamelCase } from '../utils/stringUtils.js';

/**
 * Field API Hook 생성기
 *
 * @param {string} moduleName - 모듈명 (예: vendor, item, order)
 * @param {string} solutionName - 솔루션명 (예: ini, sales, production)
 * @returns {string} Field API Hook 코드
 */
const generateFieldApiHook = (moduleName, solutionName) => {
	const moduleNameCamel = toCamelCase(moduleName);
	const moduleNamePascal = toPascalCase(moduleNameCamel);
	const solutionNameCamel = toCamelCase(solutionName);

	return `import { useQuery } from '@tanstack/react-query';
import { get${moduleNamePascal}FieldName } from '@primes/services/${solutionNameCamel}/${moduleNameCamel}Service';

export const use${moduleNamePascal}FieldQuery = (fieldName: string, enabled = true) => {
\treturn useQuery({
\t\tqueryKey: ['${moduleNamePascal}-field', fieldName],
\t\tqueryFn: () => get${moduleNamePascal}FieldName(fieldName),
\t\tenabled: !!fieldName && enabled,
\t\tstaleTime: 1000 * 60 * 3, // 3분 캐시
\t\tgcTime: 1000 * 60 * 3,    // 3분 가비지 컬렉션
\t});
};
`;
};

/**
 * Field API Service 함수 생성기
 *
 * @param {string} moduleName - 모듈명
 * @param {string} solutionName - 솔루션명
 * @returns {string} Field API Service 함수 코드
 */
const generateFieldApiService = (moduleName, solutionName) => {
	const moduleNameCamel = toCamelCase(moduleName);
	const moduleNamePascal = toPascalCase(moduleNameCamel);
	const solutionNameCamel = toCamelCase(solutionName);

	return `
export const get${moduleNamePascal}FieldName = async (fieldName: string) => {
\tconst res = await FetchApiGet(\`/${solutionNameCamel}/${moduleNameCamel}/field/\${fieldName}\`);
\tif (res.status !== 'success') {
\t\tconst errorMessage = res.errorMessage || '${moduleName} 필드 조회 실패';
\t\tthrow new Error(errorMessage);
\t}
\treturn res.data;
};`;
};

export {
	generateFieldApiHook,
	generateFieldApiService,
};
