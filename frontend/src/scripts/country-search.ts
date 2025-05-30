import type { RestCountriesCountry } from '@/types';

export async function filterCountriesByName(input: string): Promise<RestCountriesCountry[]> {
    const endpoint = encodeURI(`https://restcountries.com/v3.1/name/${input}?fields=independent,name,cca3`);

    return fetch(endpoint, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    }).then(response => response.ok ? response.json().catch(() => []) : []);
}
