/**
 * 컬럼 생성 및 개선 유틸리티 함수들
 */

/**
 * 날짜 필드인지 확인
 * @param {string} fieldName - 필드명
 * @returns {boolean} 날짜 필드 여부
 */
export const isDateField = (fieldName) => {
	if (!fieldName || typeof fieldName !== 'string') {
		return false;
	}

	const datePatterns = [
		/date$/i,
		/time$/i,
		/at$/i,
		/created/i,
		/updated/i,
		/modified/i,
		/deleted/i,
		/expired/i,
	];

	return datePatterns.some((pattern) => pattern.test(fieldName));
};

/**
 * 숫자 필드인지 확인
 * @param {string} fieldName - 필드명
 * @returns {boolean} 숫자 필드 여부
 */
export const isNumberField = (fieldName) => {
	if (!fieldName || typeof fieldName !== 'string') {
		return false;
	}

	const numberPatterns = [
		/^id$/i,
		/id$/i,
		/no$/i,
		/number$/i,
		/count$/i,
		/amount$/i,
		/price$/i,
		/cost$/i,
		/quantity$/i,
		/size$/i,
		/length$/i,
		/width$/i,
		/height$/i,
	];

	return numberPatterns.some((pattern) => pattern.test(fieldName));
};

/**
 * 상태 필드인지 확인
 * @param {string} fieldName - 필드명
 * @returns {boolean} 상태 필드 여부
 */
export const isStatusField = (fieldName) => {
	if (!fieldName || typeof fieldName !== 'string') {
		return false;
	}

	const statusPatterns = [
		/status$/i,
		/state$/i,
		/type$/i,
		/category$/i,
		/level$/i,
	];

	return statusPatterns.some((pattern) => pattern.test(fieldName));
};

/**
 * 기본 컬럼 세트 생성
 * @returns {Array} 기본 컬럼 배열
 */
export const generateDefaultColumns = () => {
	return [
		{
			accessorKey: 'id',
			header: 'ID',
			size: 80,
			minSize: 60,
		},
		{
			accessorKey: 'name',
			header: '이름',
			size: 150,
		},
		{
			accessorKey: 'code',
			header: '코드',
			size: 120,
		},
		{
			accessorKey: 'status',
			header: '상태',
			size: 100,
		},
		{
			accessorKey: 'createdAt',
			header: '등록일시',
			size: 150,
			cell: '({ getValue }: { getValue: () => any }) => { const value = getValue(); return value ? new Date(value).toLocaleDateString("ko-KR") : "-"; }',
		},
		{
			accessorKey: 'updatedAt',
			header: '수정일시',
			size: 150,
			cell: '({ getValue }: { getValue: () => any }) => { const value = getValue(); return value ? new Date(value).toLocaleDateString("ko-KR") : "-"; }',
		},
	];
};

/**
 * 컬럼 정보 개선
 * @param {Array} columns - 원본 컬럼 배열
 * @returns {Array} 개선된 컬럼 배열
 */
export const improveColumns = (columns) => {
	if (!Array.isArray(columns)) {
		return generateDefaultColumns();
	}

	return columns.map((col) => {
		const improved = { ...col };

		// 기본 크기 설정
		if (!improved.size) {
			if (isNumberField(improved.accessorKey)) {
				improved.size = 80;
			} else if (isDateField(improved.accessorKey)) {
				improved.size = 150;
			} else if (isStatusField(improved.accessorKey)) {
				improved.size = 100;
			} else {
				improved.size = 120;
			}
		}

		// 최소 크기 설정
		if (!improved.minSize && improved.accessorKey === 'id') {
			improved.minSize = 60;
		}

		// 날짜 필드에 대한 cell 렌더러 추가
		if (isDateField(improved.accessorKey) && !improved.cell) {
			improved.cell =
				'({ getValue }: { getValue: () => any }) => { const value = getValue(); return value ? new Date(value).toLocaleDateString("ko-KR") : "-"; }';
		}

		// 숫자 필드에 대한 cell 렌더러 추가
		if (
			isNumberField(improved.accessorKey) &&
			!improved.cell &&
			improved.accessorKey !== 'id'
		) {
			improved.cell =
				'({ getValue }: { getValue: () => any }) => { const value = getValue(); return value ? value.toLocaleString() : "-"; }';
		}

		// 상태 필드에 대한 cell 렌더러 추가
		if (isStatusField(improved.accessorKey) && !improved.cell) {
			improved.cell =
				'({ getValue }: { getValue: () => any }) => { const value = getValue(); return value || "-"; }';
		}

		return improved;
	});
};

/**
 * 컬럼 배열을 문자열로 변환 (템플릿에서 사용)
 * @param {Array} columns - 컬럼 배열
 * @returns {string} 문자열로 변환된 컬럼 정의
 */
export const columnsToString = (columns) => {
	if (!Array.isArray(columns) || columns.length === 0) {
		columns = generateDefaultColumns();
	}

	const improvedColumns = improveColumns(columns);

	// cell 함수를 문자열에서 실제 함수로 변환하기 위한 처리
	const columnStrings = improvedColumns.map((col) => {
		const colCopy = { ...col };

		// cell 속성이 문자열인 경우 함수로 변환 표시
		if (typeof colCopy.cell === 'string') {
			const cellFunction = colCopy.cell;
			delete colCopy.cell;

			const colString =
				JSON.stringify(colCopy, null, 3).slice(0, -1) + // 마지막 } 제거
				',\n			cell: ' +
				cellFunction +
				'\n		}';

			return colString;
		}

		return JSON.stringify(colCopy, null, 3);
	});

	return '[\n		' + columnStrings.join(',\n		') + '\n	]';
};

/**
 * 마스터-디테일 페이지용 InfoGrid 키 생성
 * @param {Array} masterColumns - 마스터 컬럼 배열
 * @param {number} maxKeys - 최대 키 개수
 * @returns {Array} InfoGrid 키 배열
 */
export const generateInfoGridKeys = (masterColumns, maxKeys = 8) => {
	if (!Array.isArray(masterColumns) || masterColumns.length === 0) {
		return [
			{ key: 'id', label: 'ID' },
			{ key: 'code', label: '코드' },
			{ key: 'name', label: '이름' },
			{ key: 'status', label: '상태' },
			{ key: 'createdAt', label: '등록일시' },
			{ key: 'updatedAt', label: '수정일시' },
			{ key: 'createdBy', label: '등록자' },
			{ key: 'updatedBy', label: '수정자' },
		];
	}

	// 마스터 컬럼에서 InfoGrid에 적합한 키들만 선택
	const suitableColumns = masterColumns
		.filter((col) => {
			// 너무 긴 텍스트나 배열 필드는 제외
			const key = col.accessorKey;
			return (
				!key.includes('Details') &&
				!key.includes('List') &&
				!key.includes('Array') &&
				key !== 'description' &&
				key !== 'memo' &&
				key !== 'content'
			);
		})
		.slice(0, maxKeys)
		.map((col) => ({
			key: col.accessorKey,
			label: col.header,
		}));

	// 기본 키들이 없으면 추가
	const hasId = suitableColumns.some((item) => item.key === 'id');
	const hasCreatedAt = suitableColumns.some(
		(item) => item.key === 'createdAt'
	);

	if (!hasId && suitableColumns.length < maxKeys) {
		suitableColumns.unshift({ key: 'id', label: 'ID' });
	}

	if (!hasCreatedAt && suitableColumns.length < maxKeys) {
		suitableColumns.push({ key: 'createdAt', label: '등록일시' });
	}

	return suitableColumns.slice(0, maxKeys);
};

/**
 * 컬럼 정의를 JSON 문자열에서 파싱
 * @param {string} columnsString - JSON 문자열
 * @returns {Array} 파싱된 컬럼 배열
 */
export const parseColumnsFromString = (columnsString) => {
	try {
		if (!columnsString || typeof columnsString !== 'string') {
			return [];
		}

		// 빈 배열이거나 빈 문자열인 경우
		if (columnsString.trim() === '[]' || columnsString.trim() === '') {
			return [];
		}

		return JSON.parse(columnsString);
	} catch (error) {
		console.warn('Failed to parse columns:', error);
		return [];
	}
};
