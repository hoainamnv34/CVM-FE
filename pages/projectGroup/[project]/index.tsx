import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import { Description } from '@/components/Description';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useCreateProject, useDeleteProject, useEditProject, useProjectList } from '@/hooks/project';
import { ProjectType } from '@/types/project';
import moment from 'moment';

export default function Project() {
    const router = useRouter();
    const [dataLocalStore, setDataLocalStore] = useState<any>();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Project'));
    });

    const [{ data, error, loading }, refetch] = useProjectList({
        project_group_id: router.query.project,
    });
    const [{ loading: loadingCreate, error: errorCreate }, doCreate] = useCreateProject();
    const [{ loading: loadingEdit, error: errorEdit }, doEdit] = useEditProject();
    const [{ loading: loadingDelete, error: errorDelete }, doDelete] = useDeleteProject();

    const [lastClickTime, setLastClickTime] = useState(0);
    const doubleClickThreshold = 300; // Khoảng thời gian tối đa giữa hai lần nhấp để được coi là double-click (300ms)
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [initialRecords, setInitialRecords] = useState<ProjectType[]>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [defaultParams] = useState({
        name: '',
        description: '',
        repository_url: '',
    });
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        console.log('user', user);
        setInitialRecords(recordsData.filter((d: any) => d.id !== user.id));
        doDelete({
            url: `/projects/${user.id}`,
        }).then((res) => {
            console.log('res', res);
        });
        showMessage('Projects has been deleted successfully.');
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const saveUser = () => {
        if (!params.name) {
            showMessage('Name is required.', 'error');
            return true;
        }

        if (params.id) {
            //update user
            doEdit({
                url: `/projects/${params.id}`,
                data: params,
            }).then((res) => {
                if (res.data && res.data.code === 200) {
                    refetch();
                }
            });
        } else {
            //add user
            doCreate({
                data: {
                    ...params,
                    project_group_id: Number(router.query.project),
                },
            }).then((res) => {
                if (res.data && res.data.code === 201) {
                    refetch();
                }
            });
        }

        showMessage('Projects has been saved successfully.');
        setAddContactModal(false);
    };

    const handleClick = useCallback(
        (data: any) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < doubleClickThreshold) {
                console.log('Double click detected', data);
                // Thực hiện hành động khi phát hiện double-click ở đây
                router.push(`${router.asPath}/${data.id}`);
                window.localStorage.setItem('project', JSON.stringify(data));
            } else {
                console.log('Single click detected', data);
            }
            setLastClickTime(currentTime);
        },
        [lastClickTime, doubleClickThreshold]
    );

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return initialRecords.filter((item: any) => {
                return item.id.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search]);

    useEffect(() => {
        setDataLocalStore(JSON.parse(window.localStorage.getItem('projectGroups') || ''));
    }, [typeof window]);

    useEffect(() => {
        if (data) {
            setInitialRecords(data.data);
        }
    }, [data]);

    return (
        <div>
            <Breadcrumbs
                listArr={[
                    { name: 'Home', link: '/' },
                    { name: 'Project Groups', link: '/projectGroup' },
                    { name: dataLocalStore?.name || '', link: `/projectGroup/${dataLocalStore?.id}`, active: true },
                ]}
            />
            <Description className={'mt-4'} text={dataLocalStore?.description} url={`/project-groups/${dataLocalStore?.id}`} />
            <div className="panel mt-4">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <div>
                        <h5 className="text-lg font-semibold dark:text-white-light">Project {dataLocalStore?.name}</h5>
                    </div>
                    <div className="flex ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                        <button type="button" className="btn btn-primary ml-4" onClick={() => editUser()}>
                            Add Project
                        </button>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            { accessor: 'id' },
                            { accessor: 'name' },
                            { accessor: 'description' },
                            {
                                accessor: 'created_at',
                                render: (record) => {
                                    return <span>{moment(record.created_at).format('HH:mm:ss DD/MM/YYYY')}</span>;
                                },
                            },
                            { accessor: 'repository_url' },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (record) => {
                                    return (
                                        <div className="flex items-center justify-center gap-4">
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(record)}>
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={(e) => {
                                                    e.defaultPrevented;
                                                    e.stopPropagation();
                                                    deleteUser(record);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                },
                            },
                        ]}
                        onRowClick={(record) => handleClick(record)}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {params.id ? 'Edit Projects' : 'Add Projects'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="description">Description</label>
                                                <input
                                                    id="description"
                                                    type="text"
                                                    placeholder="Enter Description"
                                                    className="form-input"
                                                    value={params.description}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="repository_url">Repository Url</label>
                                                <input
                                                    id="repository_url"
                                                    type="text"
                                                    placeholder="Enter Repository Url"
                                                    className="form-input"
                                                    value={params.repository_url}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>

                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
