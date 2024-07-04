import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
    project_id?: number | string | string[];
}

function usePipelineList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    console.log('params', params);
    return useAxios({
        method: 'GET',
        url: '/pipeline-runs',
        params: params.project_id !== undefined ? params : {},
    });
}

function useCreatePipeline() {
    return useAxios(
        {
            method: 'POST',
            url: '/pipeline-runs',
        },
        {
            manual: true,
        }
    );
}

function useEditPipeline() {
    return useAxios(
        {
            method: 'PUT',
            url: '/pipeline-runs/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeletePipeline() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/pipeline-runs/:id',
        },
        {
            manual: true,
        }
    );
}

export { usePipelineList, useCreatePipeline, useEditPipeline, useDeletePipeline };
