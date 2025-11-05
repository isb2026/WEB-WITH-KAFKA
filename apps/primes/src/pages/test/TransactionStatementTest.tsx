import React from 'react';
import TransactionStatement, {
	StatementData,
} from '../../components/transaction/TransactionStatement';

const sample: StatementData = {
	doc_no: 'D250912-00007',
	issue_date: '2025-09-12',
	supplier: {
		reg_no: '608-81-99892',
		name: 'MOORNMO Co.',
		ceo: 'Hwang',
		address:
			'인천 연수구 송도과학로 32 (송도동, 송도테크노파크IT센터) S동 27층 2704호',
		biz_type: 'Service',
		biz_item: 'Software',
	},
	buyer: {
		reg_no: '000-00-88888',
		name: 'CLIENT1',
		ceo: 'Hwang',
		address: '인천 미수홀구 용현동 91-1',
		biz_type: 'Production',
		biz_item: 'Manifacture',
	},
	tax_rate: 0.1,
	stamp_image_url: '/stamp_dims.gif',
	rows: [
		{
			no: 1,
			item_name: 'THW (60227 IEC01 THW 450/750V 70C)',
			spec: '1*1.5',
			qty: 100,
			unit_price: 0,
			supply_amt: 0,
			vat_amt: 0,
			remark: '',
		},
	],
	totals: {
		total_supply: 0,
		total_vat: 0,
		grand_total: 0,
		amount_in_words: 'Zero Won (₩0)',
	},
};

const TransactionStatementTest: React.FC = () => {
	return (
		<div className="p-4">
			<TransactionStatement data={sample} />
		</div>
	);
};

export default TransactionStatementTest;
