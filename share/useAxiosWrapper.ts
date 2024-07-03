import { AxiosRequestConfig } from 'axios';
import useOriginalAxios, { Options, UseAxiosResult } from 'axios-hooks';

function useAxios<TResponse = any, TBody = any, TError = any>(config: AxiosRequestConfig<TBody> | string, options?: Options & { mockData?: TResponse }): UseAxiosResult<TResponse, TBody, TError> {
    const apiResult = useOriginalAxios<TResponse>(config, {
        ...options,
        manual: options?.manual,
    });
    return apiResult;
}

export default useAxios;
