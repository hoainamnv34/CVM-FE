import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import { Description } from '@/components/Description';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Findings } from '@/components/Findings';
import moment from 'moment';
import { useCreatePipeline, useDeletePipeline, useEditPipeline, usePipelineList } from '@/hooks/pipeline';
import { PipelinerRunType } from '@/types/pipelineRun';
import axios from 'axios';
import { appConfig } from '@/configs';
import Tippy from '@tippyjs/react';
import { PipelineEvaluation } from '@/components/PipelineEvaluation';

enum SeverityEnum {
    CRITICAL = 5,
    HIGH = 4,
    MEDIUM = 3,
    LOW = 2,
    INFORMATION = 1,
}

export default function Pipeline() {
    const router = useRouter();
    console.log('router', router);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Pipeline Run'));
    });

    const [{ data, error, loading }, refetch] = usePipelineList({
        project_id: router.query.pipeline,
    });

    const [{ loading: loadingCreate, error: errorCreate }, doCreate] = useCreatePipeline();
    const [{ loading: loadingEdit, error: errorEdit }, doEdit] = useEditPipeline();
    const [{ loading: loadingDelete, error: errorDelete }, doDelete] = useDeletePipeline();

    const [dataMetrics, setDataMetrics] = useState({
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        information: 0,
        total: 0,
    });

    const [pipelineEvaluations, setPipelineEvaluations] = useState<any>({});
    const [lastClickTime, setLastClickTime] = useState(0);
    const doubleClickThreshold = 300; // Khoảng thời gian tối đa giữa hai lần nhấp để được coi là double-click (300ms)
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [dataProjectGroupsLocalStore, setDataProjectGroupsLocalStore] = useState<any>();
    const [dataProjectLocalStore, setDataProjectLocalStore] = useState<any>();

    const [initialRecords, setInitialRecords] = useState<PipelinerRunType[]>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [defaultParams] = useState({
        id: null,
        name: '',
        date: '',
        status: 1,
        branch: '',
        commit_hash: '',
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
            url: `/pipeline-runs/${user.id}`,
        }).then((res) => {
            console.log('res', res);
        });
        showMessage('Pipeline Runs has been deleted successfully.');
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

   

    const convertStatus = (status: number) => {
        switch (status) {
            case 3:
                return 'Failure';  
            case 2:
                return 'Success';
            default:
                return 'In progress';
        }
    };


    const saveUser = () => {
        if (!params.name) {
            showMessage('Name is required.', 'error');
            return true;
        }

        if (params.id) {
            //update user
            doEdit({
                url: `/pipeline-runs/${params.id}`,
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
                    project_id: Number(router.query.pipeline),
                },
            }).then((res) => {
                if (res.data && res.data.code === 201) {
                    refetch();
                }
            });
            //   searchContacts();
        }

        showMessage('Pipeline Runs has been saved successfully.');
        setAddContactModal(false);
    };

    const handleClick = useCallback(
        (data: any) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < doubleClickThreshold) {
                console.log('Double click detected', data);
                // Thực hiện hành động khi phát hiện double-click ở đây
                router.push(`${router.asPath}/${data.id}`);
                window.localStorage.setItem('pipeline', JSON.stringify(data));
            } else {
                console.log('Single click detected', data);
            }
            setLastClickTime(currentTime);
        },
        [lastClickTime, doubleClickThreshold]
    );

    const fetchDataForId = (id: number, severity: number) => {
        // Thay 'https://example.com/api/items/' bằng endpoint thực tế của bạn
        return axios.get(`${appConfig.apiBe}/findings/count?project_id=${id}&severity=${severity}`);
    };

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
        setDataProjectGroupsLocalStore(JSON.parse(window.localStorage.getItem('projectGroups') || ''));
        setDataProjectLocalStore(JSON.parse(window.localStorage.getItem('project') || ''));
    }, [typeof window]);

    useEffect(() => {
        if (data) {
            setInitialRecords(data.data);
            console.log('data', data.data);
            axios.get(`${appConfig.apiBe}/projects/${dataProjectLocalStore?.id}`).then((res) => {
                axios.get(`${appConfig.apiBe}/pipeline-evaluations/${res.data.data.pipeline_evaluation_id}`).then((res) => {
                    setPipelineEvaluations(res.data.data);
                });
            });
        }
        if (dataProjectLocalStore?.id) {
            const severityTypes = [SeverityEnum.CRITICAL, SeverityEnum.HIGH, SeverityEnum.MEDIUM, SeverityEnum.LOW, SeverityEnum.INFORMATION];

            Promise.all(severityTypes.map((severity) => fetchDataForId(dataProjectLocalStore?.id, severity)))
                .then(
                    axios.spread((...responses) => {
                        // Xử lý kết quả của mỗi lời gọi API từ đây
                        const results = responses.map((response) => response.data);
                        console.log('results', results);
                        setDataMetrics({
                            critical: results[0].data,
                            high: results[1].data,
                            medium: results[2].data,
                            low: results[3].data,
                            information: results[4].data,
                            total: results.reduce((acc, cur) => acc + cur.data, 0),
                        });
                    })
                )
                .catch((errors) => {
                    // Xử lý lỗi ở đây nếu có
                    console.error(errors);
                });
        }
    }, [data, dataProjectLocalStore]);

    return (
        <div>
            <Breadcrumbs
                listArr={[
                    { name: 'Home', link: '/' },
                    { name: 'Project Groups', link: '/projectGroup' },
                    { name: dataProjectGroupsLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}` },
                    { name: dataProjectLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}` },
                    // { name: dataCicdLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataCicdLocalStore?.id}`, active: true },
                ]}
            />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Description className={'mt-4'} text={dataProjectLocalStore?.description} url={`/projects/${dataProjectLocalStore?.id}`}/>
                    <Description title="Repository Url" isUrl className={'mt-4'} text={dataProjectLocalStore?.repository_url} field={"repository_url"} url={`/projects/${dataProjectLocalStore?.id}`}/>
                </div>
                <PipelineEvaluation
                    title="Pipeline Evaluation​"
                    className={'mt-4'}
                    data={pipelineEvaluations}
                    id={dataProjectLocalStore?.id}
                />
            </div>
            <div className="panel mt-4">
                <h2>Metrics</h2>
                <div className="mt-2 grid grid-cols-6">
                    <div className="flex flex-col items-center justify-center bg-red-500 p-2 text-white">
                        <div>{dataMetrics.critical}</div>
                        <div>CRITICAL</div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-orange-500 p-2 text-white">
                        <div>{dataMetrics.high}</div>
                        <div>HIGH</div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-yellow-500 p-2 text-white">
                        <div>{dataMetrics.medium}</div>
                        <div>MEDIUM</div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-green-500 p-2 text-white">
                        <div>{dataMetrics.low}</div>
                        <div>LOW</div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-blue-500 p-2 text-white">
                        <div>{dataMetrics.information}</div>
                        <div>INFOMATION</div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-500 p-2 text-white">
                        <div>{dataMetrics.total}</div>
                        <div>TOTAL</div>
                    </div>
                </div>
            </div>
            <div className="panel mt-4">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Pipeline Run</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            { accessor: 'id' },
                            // { accessor: 'name' },
                            {
                                accessor: 'date',
                                render: (record: any) => {
                                    return <span>{moment(record.created_at).format('HH:mm:ss DD/MM/YYYY')}</span>;
                                },
                            },
                            { accessor: 'commit_hash' },
                            { accessor: 'branch' },
                            { accessor: 'status',
                                render: (record: any) => {
                                    return <span>{convertStatus(record.status)}</span>;
                                }, 

                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (record) => {
                                    return (
                                        <div className="flex items-center justify-center gap-4">
                                            {/* <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(record)}>
                                                Edit
                                            </button> */}
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
            <Findings apiData={`${appConfig.apiBe}/findings?project_id=${dataProjectLocalStore?.id}`} />
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
                                        {params.id ? 'Edit Contact' : 'Add Contact'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="email">Date</label>
                                                <input id="date" type="email" placeholder="Enter Email" className="form-input" value={params.description} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="phone">Status</label>
                                                <select id="status" className="form-select" value={params.status} onChange={(e) => changeValue(e)}>
                                                    <option value="1">Success</option>
                                                    <option value="2">Failed</option>
                                                </select>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="branch">Branch</label>
                                                <input id="branch" type="text" placeholder="Enter Branch" className="form-input" value={params.branch} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="number">Commit Hash</label>
                                                <input id="commit_hash" type="text" placeholder="Commit Hash" className="form-input" value={params.commit_hash} onChange={(e) => changeValue(e)} />
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
