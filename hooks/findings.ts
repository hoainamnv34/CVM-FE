import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
    findings?: number | string | string[];
    parent_id?: number | string | string[];
    parent_type?: number | string | string[];
}

function useFindingsList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    return useAxios({
        method: 'GET',
        url: '/findings/parent',
        params,
    });
}

function useFindingId(id: string) {
    return useAxios({
        method: 'GET',
        url: `/findings/${id}`,
        // params,
    });
}

function useCreateFindings() {
    return useAxios(
        {
            method: 'POST',
            url: '/findings',
        },
        {
            manual: true,
        }
    );
}

function useEditFindings() {
    return useAxios(
        {
            method: 'PUT',
            url: '/findings/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeleteFindings() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/findings/:id',
        },
        {
            manual: true,
        }
    );
}

export { useFindingsList, useCreateFindings, useEditFindings, useDeleteFindings, useFindingId };
