/**
 * 문자열 변환 유틸리티 함수들
 */

/**
 * 하이픈을 camelCase로 변환
 * @param {string} str - 변환할 문자열
 * @returns {string} camelCase로 변환된 문자열
 * @example
 * toCamelCase('tax-invoice') // 'taxInvoice'
 * toCamelCase('user-profile-data') // 'userProfileData'
 */
export const toCamelCase = (str) => {
    if (!str || typeof str !== 'string') {
        return str;
    }

    return str.replace(/-([a-z])/g, (match, letter) => {
        return letter.toUpperCase();
    });
};

/**
 * 하이픈을 PascalCase로 변환
 * @param {string} str - 변환할 문자열
 * @returns {string} PascalCase로 변환된 문자열
 * @example
 * toPascalCase('tax-invoice') // 'TaxInvoice'
 * toPascalCase('user-profile-data') // 'UserProfileData'
 */
export const toPascalCase = (str) => {
    if (!str || typeof str !== 'string') {
        return str;
    }

    const camelCase = toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

/**
 * 안전한 변수명 생성 (특수문자 제거, 숫자로 시작하는 경우 처리)
 * @param {string} str - 변환할 문자열
 * @returns {string} 안전한 변수명
 * @example
 * toSafeVariableName('123-test') // '_123Test'
 * toSafeVariableName('user@name') // 'userName'
 */
export const toSafeVariableName = (str) => {
    if (!str || typeof str !== 'string') {
        return 'defaultName';
    }

    // 특수문자를 제거하고 하이픈은 camelCase로 변환
    let safeName = str
        .replace(/[^a-zA-Z0-9-]/g, '') // 영문, 숫자, 하이픈만 유지
        .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase()); // camelCase 변환

    // 숫자로 시작하는 경우 앞에 언더스코어 추가
    if (/^[0-9]/.test(safeName)) {
        safeName = '_' + safeName;
    }

    // 빈 문자열인 경우 기본값 반환
    if (!safeName) {
        return 'defaultName';
    }

    return safeName;
};

/**
 * 훅 이름 생성 (use + PascalCase)
 * @param {string} str - 변환할 문자열
 * @returns {string} 훅 이름
 * @example
 * toHookName('tax-invoice') // 'useTaxInvoice'
 * toHookName('user-profile') // 'useUserProfile'
 */
export const toHookName = (str) => {
    if (!str || typeof str !== 'string') {
        return 'useDefault';
    }

    const pascalCase = toPascalCase(str);
    return 'use' + pascalCase;
};

/**
 * 컴포넌트 이름 생성 (PascalCase + 접미사)
 * @param {string} str - 변환할 문자열
 * @param {string} suffix - 접미사 (예: 'Page', 'Component')
 * @returns {string} 컴포넌트 이름
 * @example
 * toComponentName('tax-invoice', 'Page') // 'TaxInvoicePage'
 * toComponentName('user-profile', 'Component') // 'UserProfileComponent'
 */
export const toComponentName = (str, suffix = '') => {
    if (!str || typeof str !== 'string') {
        return 'Default' + suffix;
    }

    const pascalCase = toPascalCase(str);
    return pascalCase + suffix;
};

/**
 * 파일 경로에서 안전한 디렉토리명 생성
 * @param {string} str - 변환할 문자열
 * @returns {string} 안전한 디렉토리명
 * @example
 * toSafeDirectoryName('Tax Invoice') // 'tax-invoice'
 * toSafeDirectoryName('User Profile Data') // 'user-profile-data'
 */
export const toSafeDirectoryName = (str) => {
    if (!str || typeof str !== 'string') {
        return 'default';
    }

    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // 영문 소문자, 숫자가 아닌 것은 하이픈으로
        .replace(/-+/g, '-') // 연속된 하이픈을 하나로
        .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
};