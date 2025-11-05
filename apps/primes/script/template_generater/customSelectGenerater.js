import { toPascalCase, toCamelCase } from '../utils/stringUtils.js';

/**
 * Custom Select 컴포넌트 생성기
 *
 * @param {string} moduleName - 모듈명 (예: vendor, item, order)
 * @param {string} solutionName - 솔루션명 (예: ini, sales, production)
 * @param {Object} config - 설정 옵션
 * @param {string} config.defaultValueKey - 기본 value 키 (기본: 'id')
 * @param {string} config.defaultLabelKey - 기본 label 키 (기본: 'value')
 * @returns {string} Custom Select 컴포넌트 코드
 */
const generateCustomSelectComponent = (
	moduleName,
	solutionName,
	config = {}
) => {
	const moduleNameCamel = toCamelCase(moduleName);
	const moduleNamePascal = toPascalCase(moduleNameCamel);
	const solutionNameCamel = toCamelCase(solutionName);

	const defaultValueKey = config.defaultValueKey || 'id';
	const defaultLabelKey = config.defaultLabelKey || 'value';
	const defaultFieldKey = config.defaultFieldKey || 'name'; // 기본 fieldKey

	return `import React, { useState, useEffect } from 'react';
import {
\tRadixSelect,
\tRadixSelectGroup,
\tRadixSelectItem,
} from '@repo/radix-ui/components';
import { useTranslation } from '@repo/i18n';
import { use${moduleNamePascal}FieldQuery } from '@primes/hooks/${solutionNameCamel}/${moduleNameCamel}';

interface ${moduleNamePascal}SelectProps {
\tfieldKey?: string;
\tplaceholder?: string;
\tonChange?: (value: string) => void;
\tclassName?: string;
\tvalue?: string | null;
\tdisabled?: boolean;
\tvalueKey?: string;
\tlabelKey?: string;
}

export const ${moduleNamePascal}SelectComponent: React.FC<${moduleNamePascal}SelectProps> = ({
\tfieldKey = '${defaultFieldKey}',
\tplaceholder,
\tonChange,
\tclassName = 'focus:border-Colors-Brand-500 focus:ring-1 ring-Colors-Brand-200',
\tvalue = '',
\tdisabled = false,
\tvalueKey = '${defaultValueKey}',
\tlabelKey = '${defaultLabelKey}',
}) => {
\tconst { t } = useTranslation('common');
\tconst { data, isLoading, error } = use${moduleNamePascal}FieldQuery(fieldKey);
\tconst [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
\t
\tconst defaultPlaceholder = placeholder || t('select.${moduleNameCamel}Placeholder');

\tuseEffect(() => {
\t\tif (data && Array.isArray(data)) {
\t\t\tsetOptions(
\t\t\t\tdata.map((item: any) => ({
\t\t\t\t\tlabel: item[labelKey]?.toString() || '',
\t\t\t\t\tvalue: item[valueKey]?.toString() || '',
\t\t\t\t}))
\t\t\t);
\t\t}
\t}, [data, valueKey, labelKey]);

\tif (error) {
\t\tconsole.error('${moduleNamePascal}SelectComponent Error:', error);
\t}

\treturn (
\t\t<RadixSelect
\t\t\tvalue={value ?? ''}
\t\t\tonValueChange={onChange}
\t\t\tplaceholder={isLoading ? t('select.loading') : defaultPlaceholder}
\t\t\tclassName={className}
\t\t\tdisabled={disabled || isLoading}
\t\t>
\t\t\t<RadixSelectGroup>
\t\t\t\t{options.length === 0 && !isLoading && (
\t\t\t\t\t<RadixSelectItem value="none" disabled>
\t\t\t\t\t\t{error ? t('select.loadFailed') : t('select.noOptions')}
\t\t\t\t\t</RadixSelectItem>
\t\t\t\t)}
\t\t\t\t{options.map((option, index) => (
\t\t\t\t\t<RadixSelectItem
\t\t\t\t\t\tkey={index}
\t\t\t\t\t\tvalue={option.value}
\t\t\t\t\t>
\t\t\t\t\t\t{option.label}
\t\t\t\t\t</RadixSelectItem>
\t\t\t\t))}
\t\t\t</RadixSelectGroup>
\t\t</RadixSelect>
\t);
};
`;
};

/**
 * otherTypeElements 등록을 위한 인덱스 파일 생성기
 *
 * @param {Array} customSelects - 생성된 Custom Select 목록
 * @returns {string} index.ts 파일 내용
 */
const generateCustomSelectIndex = (customSelects) => {
	const imports = customSelects
		.map(
			(select) =>
				`import { ${select.componentName} } from './${select.fileName}';`
		)
		.join('\n');

	const exports = customSelects
		.map((select) => `\t'${select.typeName}': ${select.componentName},`)
		.join('\n');

	return `${imports}

// DynamicFormComponent의 otherTypeElements에서 사용할 Custom Select들
export const customSelectElements = {
${exports}
};

// 개별 컴포넌트 export
${customSelects.map((select) => `export { ${select.componentName} } from './${select.fileName}';`).join('\n')}
`;
};

export {
	generateCustomSelectComponent,
	generateCustomSelectIndex,
};
