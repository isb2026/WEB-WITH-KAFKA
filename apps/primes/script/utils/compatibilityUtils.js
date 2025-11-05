/**
 * Node.js 호환성 유틸리티 함수들
 * Optional chaining(?.)과 Nullish coalescing(??) 연산자를 구형 문법으로 대체
 */

/**
 * 안전한 객체 속성 접근 (Optional chaining 대체)
 * @param {Object} obj - 접근할 객체
 * @param {string} path - 접근 경로 (점으로 구분)
 * @param {*} defaultValue - 기본값
 * @returns {*} 속성 값 또는 기본값
 * @example
 * safeGet(user, 'profile.name', 'Unknown') // user?.profile?.name ?? 'Unknown'
 * safeGet(data, 'items.0.id', null) // data?.items?.[0]?.id ?? null
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
    if (!obj || typeof path !== 'string') {
        return defaultValue;
    }

    try {
        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current === null || current === undefined) {
                return defaultValue;
            }

            // 배열 인덱스 처리 (예: items.0.name)
            if (/^\d+$/.test(key)) {
                current = current[parseInt(key, 10)];
            } else {
                current = current[key];
            }
        }

        return current !== undefined ? current : defaultValue;
    } catch (error) {
        return defaultValue;
    }
};

/**
 * Nullish coalescing 연산자 대체
 * @param {*} value - 확인할 값
 * @param {*} fallback - 대체값
 * @returns {*} value가 null/undefined가 아니면 value, 아니면 fallback
 * @example
 * nullishCoalescing(user.name, 'Guest') // user.name ?? 'Guest'
 * nullishCoalescing(0, 'default') // 0 (0은 falsy하지만 null/undefined가 아님)
 */
export const nullishCoalescing = (value, fallback) => {
    return value !== null && value !== undefined ? value : fallback;
};

/**
 * 안전한 함수 호출
 * @param {Function} fn - 호출할 함수
 * @param {...*} args - 함수 인자들
 * @returns {*} 함수 실행 결과 또는 undefined
 * @example
 * safeCall(user.getName) // user.getName?.()
 * safeCall(callback, data) // callback?.(data)
 */
export const safeCall = (fn, ...args) => {
    if (typeof fn === 'function') {
        try {
            return fn(...args);
        } catch (error) {
            console.warn('Function call failed:', error);
            return undefined;
        }
    }
    return undefined;
};

/**
 * 안전한 배열 접근
 * @param {Array} arr - 배열
 * @param {number} index - 인덱스
 * @param {*} defaultValue - 기본값
 * @returns {*} 배열 요소 또는 기본값
 * @example
 * safeArrayGet(items, 0, null) // items?.[0] ?? null
 */
export const safeArrayGet = (arr, index, defaultValue = undefined) => {
    if (!Array.isArray(arr) || typeof index !== 'number') {
        return defaultValue;
    }

    if (index < 0 || index >= arr.length) {
        return defaultValue;
    }

    const value = arr[index];
    return value !== undefined ? value : defaultValue;
};

/**
 * 코드에서 optional chaining 패턴을 찾아서 호환 가능한 형태로 변환
 * @param {string} code - 변환할 코드 문자열
 * @returns {string} 변환된 코드
 */
export const convertOptionalChaining = (code) => {
    if (!code || typeof code !== 'string') {
        return code;
    }

    // obj?.prop 패턴을 (obj && obj.prop)로 변환
    let converted = code.replace(/(\w+)\?\./g, '($1 && $1.');

    // obj?.method() 패턴을 (obj && obj.method())로 변환
    converted = converted.replace(/(\w+)\?\.([\w]+)\(/g, '($1 && $1.$2(');

    // 중첩된 optional chaining 처리
    // obj?.prop?.subprop 같은 패턴
    converted = converted.replace(/\(\((\w+) && \1\.([\w]+)\) && \(\1 && \1\.([\w]+)\)/g,
        '($1 && $1.$2 && $1.$2.$3)');

    return converted;
};

/**
 * 코드에서 nullish coalescing 패턴을 찾아서 호환 가능한 형태로 변환
 * @param {string} code - 변환할 코드 문자열
 * @returns {string} 변환된 코드
 */
export const convertNullishCoalescing = (code) => {
    if (!code || typeof code !== 'string') {
        return code;
    }

    // value ?? fallback 패턴을 삼항 연산자로 변환
    return code.replace(/(\w+)\s*\?\?\s*(.+)/g,
        '($1 !== null && $1 !== undefined ? $1 : $2)');
};

/**
 * 전체 코드를 Node.js 호환 가능한 형태로 변환
 * @param {string} code - 변환할 코드 문자열
 * @returns {string} 변환된 코드
 */
export const makeCompatible = (code) => {
    if (!code || typeof code !== 'string') {
        return code;
    }

    let compatible = convertOptionalChaining(code);
    compatible = convertNullishCoalescing(compatible);

    return compatible;
};