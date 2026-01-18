import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Instância para a API OSDR (Open Science Data Repository)
const apiOSDR = axios.create({
  baseURL: 'https://osdr.nasa.gov/osdr/data/search',
});

export function useOSDRData() {
  return useQuery({
    queryKey: ['osdr-search'],
    queryFn: async () => {
      // Buscando estudos que contenham dados de radiação ou biologia
      const { data } = await apiOSDR.get('', {
        params: {
          term: 'radiation', // Termo de busca para garantir resultados
          type: 'study',
          from: 0,
          size: 20,
        },
      });
      // Retorna a lista de estudos (hits)
      return data.hits.hits;
    },
  });
}
