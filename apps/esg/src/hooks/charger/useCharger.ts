import { useState, useEffect } from 'react';
import {
	CompanyManager,
	GetAllCompanyManagerListPayload,
	GetSearchCompanyManagerListPayload,
} from '@esg/types/company_manager';

let _ChargerList: CompanyManager[] = [
	{
		id: 1,
		address: '서울시 강남구',
		addressDetail: '테헤란로 123',
		company: {
			isUse: true,
			isDelete: false,
			tenantId: 1,
			createdAt: '2024-01-01T00:00:00Z',
			createdBy: 'system',
		},
		createdAt: '2024-01-01T00:00:00Z',
		createdBy: 'system',
		department: '개발팀',
		isUse: true,
		name: '이동은',
		phone: '010-1234-5678',
		updatedAt: '2024-01-01T00:00:00Z',
		updatedBy: 'system',
		username: 'de.lee',
	},
	{
		id: 2,
		address: '서울시 강남구',
		addressDetail: '테헤란로 123',
		company: {
			isUse: true,
			isDelete: false,
			tenantId: 1,
			createdAt: '2024-01-01T00:00:00Z',
			createdBy: 'system',
		},
		createdAt: '2024-01-01T00:00:00Z',
		createdBy: 'system',
		department: '기획팀',
		isUse: true,
		name: '이동은2',
		phone: '010-1234-5678',
		updatedAt: '2024-01-01T00:00:00Z',
		updatedBy: 'system',
		username: 'de.lee2',
	},
	{
		id: 3,
		address: '서울시 강남구',
		addressDetail: '테헤란로 123',
		company: {
			isUse: true,
			isDelete: false,
			tenantId: 1,
			createdAt: '2024-01-01T00:00:00Z',
			createdBy: 'system',
		},
		createdAt: '2024-01-01T00:00:00Z',
		createdBy: 'system',
		department: '영업팀',
		isUse: true,
		name: '홍길동',
		phone: '010-1234-5678',
		updatedAt: '2024-01-01T00:00:00Z',
		updatedBy: 'system',
		username: 'hong.gil',
	},
	{
		id: 4,
		address: '인천시 연수구',
		addressDetail: '송도국제도시',
		company: {
			isUse: true,
			isDelete: false,
			tenantId: 2,
			createdAt: '2024-01-01T00:00:00Z',
			createdBy: 'system',
		},
		createdAt: '2024-01-01T00:00:00Z',
		createdBy: 'system',
		department: '생산팀',
		isUse: true,
		name: '김영완',
		phone: '010-1234-5678',
		updatedAt: '2024-01-01T00:00:00Z',
		updatedBy: 'system',
		username: 'yw.kim',
	},
	{
		id: 5,
		address: '부산시 해운대구',
		addressDetail: '센텀시티',
		company: {
			isUse: true,
			isDelete: false,
			tenantId: 3,
			createdAt: '2024-01-01T00:00:00Z',
			createdBy: 'system',
		},
		createdAt: '2024-01-01T00:00:00Z',
		createdBy: 'system',
		department: '품질관리팀',
		isUse: true,
		name: '김에스탑',
		phone: '010-1234-5678',
		updatedAt: '2024-01-01T00:00:00Z',
		updatedBy: 'system',
		username: 'es.kim',
	},
];

type Params =
	| GetAllCompanyManagerListPayload
	| GetSearchCompanyManagerListPayload;

export const useCharger = () => {
	const [chargerList, setChargerList] =
		useState<CompanyManager[]>(_ChargerList);

	const getChargerList = (param: Params) => {
		const { page, size } = param;
		const start = page * size; // 시작 인덱스
		const end = start + size; // 끝 인덱스(미포함)
		return chargerList.slice(start, end);
	};

	const createCharger = (charger: CompanyManager) => {
		console.log('Creating charger with data:', charger);
		setChargerList((prevList) => [...prevList, charger]);
	};

	const updateCharger = (id: number, updatedCharger: CompanyManager) => {
		setChargerList((prevList) =>
			prevList.map((charger) =>
				charger.id === id ? { ...charger, ...updatedCharger } : charger
			)
		);
	};

	return {
		chargerList,
		getChargerList,
		createCharger,
		updateCharger,
	};
};
