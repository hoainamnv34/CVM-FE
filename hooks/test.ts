import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
    pipeline_run_id?: number | string | string[];
}

function useTestList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    return useAxios({
        method: 'GET',
        url: '/tests',
        params,
    });
}

function useCreateTest() {
    return useAxios(
        {
            method: 'POST',
            url: '/tests',
        },
        {
            manual: true,
        }
    );
}

function useEditTest() {
    return useAxios(
        {
            method: 'PUT',
            url: '/tests/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeleteTest() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/tests/:id',
        },
        {
            manual: true,
        }
    );
}

export { useTestList, useCreateTest, useEditTest, useDeleteTest };
