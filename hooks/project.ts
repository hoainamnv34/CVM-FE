import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
    project_group_id?: number | string | string[];
}

function useProjectList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    return useAxios({
        method: 'GET',
        url: '/projects',
        params,
    });
}

function useCreateProject() {
    return useAxios(
        {
            method: 'POST',
            url: '/projects',
        },
        {
            manual: true,
        }
    );
}

function useEditProject() {
    return useAxios(
        {
            method: 'PUT',
            url: '/projects/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeleteProject() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/projects/:id',
        },
        {
            manual: true,
        }
    );
}

export { useProjectList, useCreateProject, useEditProject, useDeleteProject };
