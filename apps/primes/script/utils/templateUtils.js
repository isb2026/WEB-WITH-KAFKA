/**
 * 템플릿 생성 공통 유틸리티 함수들
 */

import { toCamelCase, toPascalCase, toHookName, toComponentName } from './stringUtils.js';
import { safeGet, nullishCoalescing } from './compatibilityUtils.js';

/**
 * 액션 정보에서 안전하게 값 추출
 * @param {Array} actions - 액션 배열
 * @param {string} type - 액션 타입
 * @param {string} property - 추출할 속성
 * @param {*} defaultValue - 기본값
 * @returns {*} 추출된 값 또는 기본값
 */
export const getActionProperty = (actions, type, property, defaultValue = '') => {
    if (!Array.isArray(actions)) {
        return defaultValue;
    }

    const action = actions.find(a => a && a.type === type);
    return safeGet(action, property, defaultValue);
};

/**
 * 탭 정보 파싱 (호환성 개선)
 * @param {string} tabsString - 탭 문자열
 * @returns {Array} 파싱된 탭 정보 배열
 */
export const parseTabInfo = (tabsString) => {
    if (!tabsString || typeof tabsString !== 'string') {
        return [];
    }

    const tabItems = [];
    const tabLines = tabsString.split(',\n');

    tabLines.forEach(line => {
        const idMatch = line.match(/id:\s*['"`]([^'"`]+)['"`]/);
        const pathMatch = line.match(/to:\s*['"`]([^'"`]+)['"`]/);

        if (idMatch && pathMatch) {
            tabItems.push({
                id: idMatch[1],
                path: pathMatch[1]
            });
        }
    });

    return tabItems;
};

/**
 * 안전한 import 문 생성
 * @param {Array} imports - import할 항목들
 * @param {string} from - import 경로
 * @returns {string} import 문
 */
export const generateImportStatement = (imports, from) => {
    if (!Array.isArray(imports) || imports.length === 0) {
        return '';
    }

    const validImports = imports.filter(imp => imp && typeof imp === 'string');

    if (validImports.length === 0) {
        return '';
    }

    if (validImports.length === 1) {
        return `import { ${validImports[0]} } from '${from}';`;
    }

    return `import {\n\t${validImports.join(',\n\t')}\n} from '${from}';`;
};

/**
 * TypeScript 인터페이스 생성
 * @param {string} interfaceName - 인터페이스명
 * @param {Object} properties - 속성들
 * @returns {string} 인터페이스 정의
 */
export const generateInterface = (interfaceName, properties) => {
    if (!interfaceName || !properties || typeof properties !== 'object') {
        return '';
    }

    const props = Object.entries(properties)
        .map(([key, type]) => `\t${key}: ${type};`)
        .join('\n');

    return `interface ${interfaceName} {\n${props}\n}`;
};

/**
 * 함수 매개변수 생성
 * @param {Array} params - 매개변수 배열
 * @returns {string} 매개변수 문자열
 */
export const generateFunctionParams = (params) => {
    if (!Array.isArray(params) || params.length === 0) {
        return '';
    }

    return params
        .filter(param => param && typeof param === 'object')
        .map(param => {
            const name = param.name || 'param';
            const type = param.type || 'any';
            const optional = param.optional ? '?' : '';
            const defaultValue = param.defaultValue ? ` = ${param.defaultValue}` : '';

            return `${name}${optional}: ${type}${defaultValue}`;
        })
        .join(', ');
};

/**
 * JSDoc 주석 생성
 * @param {Object} options - JSDoc 옵션
 * @returns {string} JSDoc 주석
 */
export const generateJSDoc = (options) => {
    if (!options || typeof options !== 'object') {
        return '';
    }

    const lines = ['/**'];

    if (options.description) {
        lines.push(` * ${options.description}`);
    }

    if (options.params && Array.isArray(options.params)) {
        options.params.forEach(param => {
            if (param.name && param.type) {
                const description = param.description || '';
                lines.push(` * @param {${param.type}} ${param.name} - ${description}`);
            }
        });
    }

    if (options.returns) {
        lines.push(` * @returns {${options.returns.type}} ${options.returns.description || ''}`);
    }

    if (options.example) {
        lines.push(' * @example');
        lines.push(` * ${options.example}`);
    }

    lines.push(' */');

    return lines.join('\n');
};

/**
 * 조건부 코드 블록 생성
 * @param {boolean} condition - 조건
 * @param {string} code - 조건이 true일 때 포함할 코드
 * @returns {string} 조건부 코드
 */
export const conditionalCode = (condition, code) => {
    return condition ? code : '';
};

/**
 * 들여쓰기 적용
 * @param {string} code - 코드 문자열
 * @param {number} level - 들여쓰기 레벨
 * @param {string} indent - 들여쓰기 문자 (기본: 탭)
 * @returns {string} 들여쓰기가 적용된 코드
 */
export const indentCode = (code, level = 1, indent = '\t') => {
    if (!code || typeof code !== 'string') {
        return '';
    }

    const indentation = indent.repeat(level);
    return code
        .split('\n')
        .map(line => line.trim() ? indentation + line : line)
        .join('\n');
};

/**
 * 코드 블록을 중괄호로 감싸기
 * @param {string} code - 코드 문자열
 * @param {boolean} multiline - 여러 줄 여부
 * @returns {string} 중괄호로 감싸진 코드
 */
export const wrapInBraces = (code, multiline = true) => {
    if (!code || typeof code !== 'string') {
        return '{}';
    }

    if (multiline) {
        return `{\n${indentCode(code)}\n}`;
    } else {
        return `{ ${code.trim()} }`;
    }
};

/**
 * 배열을 문자열로 변환 (코드 생성용)
 * @param {Array} array - 변환할 배열
 * @param {number} indentLevel - 들여쓰기 레벨
 * @returns {string} 문자열로 변환된 배열
 */
export const arrayToString = (array, indentLevel = 1) => {
    if (!Array.isArray(array)) {
        return '[]';
    }

    if (array.length === 0) {
        return '[]';
    }

    const indent = '\t'.repeat(indentLevel);
    const items = array.map(item => {
        if (typeof item === 'string') {
            return `${indent}'${item}'`;
        } else if (typeof item === 'object') {
            return `${indent}${JSON.stringify(item, null, indentLevel + 1)}`;
        } else {
            return `${indent}${item}`;
        }
    });

    return `[\n${items.join(',\n')}\n${'\t'.repeat(indentLevel - 1)}]`;
};

/**
 * 모듈명에서 훅 이름 생성 (하이픈 처리 포함)
 * @param {string} moduleName - 모듈명
 * @returns {string} 훅 이름
 */
export const moduleNameToHookName = (moduleName) => {
    if (!moduleName || typeof moduleName !== 'string') {
        return 'useDefault';
    }

    // 하이픈을 camelCase로 변환 후 훅 이름 생성
    const camelCase = toCamelCase(moduleName);
    return 'use' + toPascalCase(camelCase);
};

/**
 * 모듈명에서 컴포넌트 이름 생성 (하이픈 처리 포함)
 * @param {string} moduleName - 모듈명
 * @param {string} suffix - 접미사
 * @returns {string} 컴포넌트 이름
 */
export const moduleNameToComponentName = (moduleName, suffix = '') => {
    if (!moduleName || typeof moduleName !== 'string') {
        return 'Default' + suffix;
    }

    // 하이픈을 PascalCase로 변환 후 컴포넌트 이름 생성
    const pascalCase = toPascalCase(moduleName);
    return pascalCase + suffix;
};