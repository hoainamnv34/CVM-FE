import useAxios from '@/share/useAxiosWrapper';

export interface GetParams {
    keyword?: string;
    per_page?: number;
    page?: number;
}

function useProjectGroupsList(params: GetParams) {
    const { page = 0, per_page = 10, keyword = '' } = params ?? {};
    return useAxios({
        method: 'GET',
        url: '/project-groups',
        params,
    });
}

function useCreateProjectGroups() {
    return useAxios(
        {
            method: 'POST',
            url: '/project-groups',
        },
        {
            manual: true,
        }
    );
}

function useEditProjectGroups() {
    return useAxios(
        {
            method: 'PUT',
            url: '/project-groups/:id',
        },
        {
            manual: true,
        }
    );
}

function useDeleteProjectGroups() {
    return useAxios(
        {
            method: 'DELETE',
            url: '/project-groups/:id',
        },
        {
            manual: true,
        }
    );
}

export { useProjectGroupsList, useCreateProjectGroups, useEditProjectGroups, useDeleteProjectGroups };
