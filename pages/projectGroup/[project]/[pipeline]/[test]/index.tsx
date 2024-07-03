import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Swal from 'sweetalert2';

import { useRouter } from 'next/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Findings } from '@/components/Findings';
import { useTestList } from '@/hooks/test';
import moment from 'moment';
import axios from 'axios';
import { appConfig } from '@/configs';

export default function Test() {
    const router = useRouter();
    console.log('router', router.asPath);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Checkbox Table'));
    });

    const [{ data, error, loading }, refetch] = useTestList({
        pipeline_run_id: router.query.test,
    });

    const [lastClickTime, setLastClickTime] = useState(0);
    const doubleClickThreshold = 300; // Khoảng thời gian tối đa giữa hai lần nhấp để được coi là double-click (300ms)
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [dataProjectGroupsLocalStore, setDataProjectGroupsLocalStore] = useState<any>();
    const [dataProjectLocalStore, setDataProjectLocalStore] = useState<any>();
    const [dataPipelineLocalStore, setDataPipelineLocalStore] = useState<any>();

    const [dataEvaluateCicd, setDataEvaluateCicd] = useState({
        evaluate: false,
        threshold_score: 0,
        score: 0,
    });

    const [initialRecords, setInitialRecords] = useState<any>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [defaultParams] = useState({
        id: null,
        name: '',
        description: '',
        members: '',
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
        showMessage('User has been deleted successfully.');
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
            let user: any = initialRecords.find((d: any) => d.id === params.id);
            user.name = params.name;
            user.date = params.date;
            user.duplicates = params.duplicates;
            user.active = params.active;
            user.total_findings = params.total_findings;
        } else {
            //add user
            let maxUserId = initialRecords.length ? initialRecords.reduce((max: any, character: any) => (character.id > max ? character.id : max), initialRecords[0].id) : 0;

            let user = {
                id: maxUserId + 1,
                name: params.name,
                date: params.date,
                duplicates: params.duplicates,
                active: params.active,
                total_findings: params.total_findings,
            };
            initialRecords.splice(0, 0, user);
            //   searchContacts();
        }

        showMessage('User has been saved successfully.');
        setAddContactModal(false);
    };

    const handleClick = useCallback(
        (data: any) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < doubleClickThreshold) {
                console.log('Double click detected', data);
                // Thực hiện hành động khi phát hiện double-click ở đây
                router.push(`${router.asPath}/${data.id}`);
                window.localStorage.setItem('test', JSON.stringify(data));
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
        setDataProjectGroupsLocalStore(JSON.parse(window.localStorage.getItem('projectGroups') || ''));
        setDataProjectLocalStore(JSON.parse(window.localStorage.getItem('project') || ''));
        setDataPipelineLocalStore(JSON.parse(window.localStorage.getItem('pipeline') || ''));
    }, [typeof window]);

    useEffect(() => {
        if (data) {
            setInitialRecords(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (dataPipelineLocalStore?.id) {
            axios
                .get(`${appConfig.apiBe}/pipeline-runs/evaluate?project_id=${dataPipelineLocalStore.project_id}&pipeline_run_id=${dataPipelineLocalStore.pipeline_run_id}&latest_request=false`)
                .then((res) => {
                    setDataEvaluateCicd(res.data.data);
                });
        }
    }, [dataPipelineLocalStore?.id]);

    return (
        <div>
            <Breadcrumbs
                listArr={[
                    { name: 'Home', link: '/' },
                    { name: 'Project Groups', link: '/projectGroup' },
                    { name: dataProjectGroupsLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}` },
                    { name: dataProjectLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}` },
                    // { name: dataCicdLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataCicdLocalStore?.id}` },
                    {
                        name: dataPipelineLocalStore?.name || dataPipelineLocalStore?.id || '',
                        link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataPipelineLocalStore?.id}`,
                        active: true,
                    },
                ]}
            />
            <div className="grid grid-cols-2 gap-4">
                <div className="panel mt-4">
                    <div className="text-lg font-bold text-blue-500">Evaluate CI/CD Pipeline</div>
                    <div>CI/CD Pipeline {dataEvaluateCicd.evaluate ? 'Successfully' : 'Failed'}</div>
                    <div>Threshold: {dataEvaluateCicd.threshold_score}</div>
                    <div>Pipeline score: {dataEvaluateCicd.score}</div>
                </div>
                <div className="panel mt-4">
                    <div className="text-lg font-bold text-blue-500">Infomation</div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-2">Commit Hash</div>
                        <div className="col-span-4">
                            <div className="break-words">{dataPipelineLocalStore?.commit_hash}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-2">Branch Name</div>
                        <div className="break-words">{dataPipelineLocalStore?.branch_name}</div>
                    </div>
                </div>
            </div>

            <div className="panel mt-4">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Tests</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            { accessor: 'id' },
                            { accessor: 'name' },
                            {
                                accessor: 'date',
                                render: (record: any) => {
                                    return <span>{moment(record.created_at).format('HH:mm:ss DD/MM/YYYY')}</span>;
                                },
                            },
                            { accessor: 'total_findings' },
                            { accessor: 'active' },
                            { accessor: 'duplicates' },
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
            <Findings />
        </div>
    );
}
