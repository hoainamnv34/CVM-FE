import useAxios from "axios-hooks";

function useEditDescription() {
    return useAxios(
        {
            method: 'PUT',
            url: '/app/:id',
        },
        {
            manual: true,
        }
    );
}

export {
    useEditDescription
}