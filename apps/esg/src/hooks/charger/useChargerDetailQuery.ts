// import { useQuery } from '@tanstack/react-query';
// import { getChargerDetail } from '@esg/services/chargerService';
// import { CompanyManager } from '@esg/types/company_manager';

// export const useChargerDetailQuery = (id: number) => {
//   return useQuery<CompanyManager>({
//     queryKey: ['chargerDetail', id],
//     queryFn: () => getChargerDetail(id),
//     enabled: !!id, 
//     staleTime: 5 * 60 * 1000, 
//   });
// };
