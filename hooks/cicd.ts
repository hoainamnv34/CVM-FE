import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
    project_id?: number | string | string[];
}

function useCicdList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    return useAxios({
        method: 'GET',
        url: '/cicd-pipelines',
        params,
    });
}

function useCreateCicd() {
    return useAxios(
        {
            method: 'POST',
            url: '/cicd-pipelines',
        },
        {
            manual: true,
        }
    );
}

function useEditCicd() {
    return useAxios(
        {
            method: 'PUT',
            url: '/cicd-pipelines/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeleteCicd() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/cicd-pipelines/:id',
        },
        {
            manual: true,
        }
    );
}

export { useCicdList, useCreateCicd, useEditCicd, useDeleteCicd };
