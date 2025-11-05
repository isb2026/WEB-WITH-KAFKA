import { useCallback, useEffect } from 'react';
import { useActionButtonContext } from '@moornmo/providers/ActionButtonProvider';

export const useActionButtons = () => {
	const { state, dispatch } = useActionButtonContext();

	// 각각의 상태 제어 함수
	const setCreate = useCallback(
		(enabled: boolean) => {
			dispatch({ type: 'SET_CREATE', payload: enabled });
		},
		[dispatch]
	);

	const setEdit = useCallback(
		(enabled: boolean) => {
			dispatch({ type: 'SET_EDIT', payload: enabled });
		},
		[dispatch]
	);

	const setDelete = useCallback(
		(enabled: boolean) => {
			dispatch({ type: 'SET_DELETE', payload: enabled });
		},
		[dispatch]
	);

	// 핸들러 등록
	const setHandlers = useCallback(
		(handlers: {
			onHandleCreate?: () => void;
			onHandleEdit?: () => void;
			onHandleDelete?: () => void;
		}) => {
			dispatch({ type: 'SET_ACTION_HANDLERS', payload: handlers });
		},
		[dispatch]
	);

	const setCreateHandler = useCallback(
		(handlers: () => void) => {
			dispatch({ type: 'SET_CREATE_ACTION_HANDLERS', payload: handlers });
		},
		[dispatch]
	);

	const setEditHandler = useCallback(
		(handlers: () => void) => {
			dispatch({ type: 'SET_EDIT_ACTION_HANDLERS', payload: handlers });
		},
		[dispatch]
	);

	const setDeleteHandler = useCallback(
		(handlers: () => void) => {
			dispatch({ type: 'SET_DELETE_ACTION_HANDLERS', payload: handlers });
		},
		[dispatch]
	);

	return {
		...state, // 현재 상태도 반환
		setCreate,
		setEdit,
		setDelete,
		setHandlers,
		setCreateHandler,
		setEditHandler,
		setDeleteHandler,
	};
};
