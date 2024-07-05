import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import IconTrashLines from './Icon/IconTrashLines';
import IconXCircle from './Icon/IconXCircle';
import IconInfoHexagon from './Icon/IconInfoHexagon';
import { appConfig } from '@/configs';

interface FindingsProps {
    apiData?: string;
    id?: number | string;
}

interface Finding {
    id?: number;
    title?: string;
    description?: string;
    severity?: number;
    cwe?: number;
    line?: number;
    file_path?: string;
    vuln_id_from_tool?: string;
    mitigation?: string;
    reference?: string;
    active?: boolean;
    dynamic_finding?: boolean;
    duplicate?: boolean;
    risk_accepted?: boolean;
    static_finding?: boolean;
    created_at?: string;
    updated_at?: string;
}

export function Findings(props: FindingsProps) {
    const router = useRouter();
    console.log('router', router.asPath);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Checkbox Table'));
    });
    const [lastClickTime, setLastClickTime] = useState(0);
    const doubleClickThreshold = 300; // Khoảng thời gian tối đa giữa hai lần nhấp để được coi là double-click (300ms)
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [initialRecords, setInitialRecords] = useState<Finding[]>([]);
    const [recordsData, setRecordsData] = useState<Finding[]>(initialRecords);

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

    const deleteFinding = (finding: any = null) => {
        if (!finding) return;

        axios
            .delete(`${appConfig.apiBe}/findings/${finding.id}`)
            .then(() => {
                setInitialRecords(recordsData.filter((d: any) => d.id !== finding.id));
                showMessage('Finding has been deleted successfully.');
            })
            .catch((error) => {
                console.error('There was an error deleting the finding!', error);
            });
    };

    const toggleRiskAcceptanceFinding = (finding: any = null) => {
        if (!finding) return;

        axios
            .put(`${appConfig.apiBe}/findings/risk-accept/${finding.id}`)
            .then((response) => {
                // const updatedFinding = response.data.data;
                setInitialRecords(
                    recordsData.map((record) => {
                        if (record.id === finding.id) {
                            record.risk_accepted = !record.risk_accepted;
                        }
                        return record;
                    })
                );
                showMessage(`Risk acceptance for the finding has been ${!finding.risk_accepted ? 'accepted' : 'unaccepted'} successfully.`);
            })
            .catch((error) => {
                console.error('There was an error toggling risk acceptance for the finding!', error);
            });
    };

    const toggleFindingStatus = (finding: any = null) => {
        if (!finding) return;

        const newStatus = !finding.active;
        // const action = newStatus ? 'open' : 'close';

        axios
            .put(`${appConfig.apiBe}/findings/toggle-status/${finding.id}`)
            .then((response) => {
                // const updatedFinding = response.data.data;
                setInitialRecords(
                    recordsData.map((record) => {
                        if (record.id === finding.id) {
                            record.active = !record.active;
                        }
                        return record;
                    })
                );

                showMessage(`Finding has been ${newStatus ? 'opened' : 'closed'} successfully.`);
            })
            .catch((error) => {
                console.error(`There was an error ${newStatus ? 'opening' : 'closing'} the finding!`, error);
            });
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
            user.severity = params.severity;
            user.cwe = params.cwe;
            user.status = params.status;
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
                window.localStorage.setItem('findings', JSON.stringify(data));
            } else {
                console.log('Single click detected', data);
            }
            setLastClickTime(currentTime);
        },
        [lastClickTime, doubleClickThreshold]
    );

    const convertSeverity = (severity: number) => {
        switch (severity) {
            case 5:
                return 'CRITICAL';
            case 4:
                return 'HIGH';
            case 3:
                return 'MEDIUM';
            case 2:
                return 'LOW';
            default:
                return 'INFO';
        }
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
        if (props.apiData && !props.apiData.includes('undefined')) {
            axios.get(`${props.apiData}&size=0`).then((res) => {
                setInitialRecords(res.data.data);
            });
        }
    }, [props.apiData]);

    return (
        <div>
            <div className="panel mt-4">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Findings</h5>
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
                            {
                                accessor: 'title',
                                cellsClassName: 'max-w-[350px] w-[350px]',
                                render: (record: any) => {
                                    return (
                                        <Tippy content={record.title}>
                                            <div className="w-[300px] overflow-hidden text-ellipsis whitespace-nowrap ">{record.title}</div>
                                        </Tippy>
                                    );
                                },
                            },
                            {
                                accessor: 'severity',
                                render: (record: any) => {
                                    return <div>{convertSeverity(record.severity)}</div>;
                                },
                            },
                            {
                                accessor: 'cwe',
                                title: 'CWE',
                                render: (record: any) => {
                                    // return <div>{record.cwe == 0 ? ' ' : record.cwe}</div>;
                                    return (
                                        <a href={`https://cwe.mitre.org/data/definitions/${record.cwe}.html`} target="_blank" rel="noopener noreferrer">
                                            {record.cwe == 0 ? ' ' : record.cwe}
                                        </a>
                                    );
                                },
                            },
                            {
                                accessor: 'status',
                                render: (record: any) => {
                                    return (
                                        <div>
                                            {record.active ? 'Active' : 'Inactive'} {record.risk_accepted ? ', Risk Accepted' : ''}
                                        </div>
                                    );
                                },
                            },
                            {
                                accessor: 'file_path',
                                title: 'Location',
                                // render: () => {
                                //     return <div className="">Admin</div>;
                                // },
                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (record) => {
                                    return (
                                        <ul className="flex items-center justify-center gap-2">
                                            <li>
                                                <Tippy content={`${record.active ? 'Close' : 'Reopen'}`}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.defaultPrevented;
                                                            e.stopPropagation();
                                                            toggleFindingStatus(record);
                                                        }}
                                                    >
                                                        <IconXCircle className={`text-success`} />
                                                    </button>
                                                </Tippy>
                                            </li>
                                            <li>
                                                <Tippy content={`${!record.risk_accepted ? 'Accept Risk' : 'Unaccept Risk'}`}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.defaultPrevented;
                                                            e.stopPropagation();
                                                            toggleRiskAcceptanceFinding(record);
                                                        }}
                                                    >
                                                        <IconInfoHexagon className={`h-5 w-5 text-primary `} />
                                                    </button>
                                                </Tippy>
                                            </li>
                                            <li>
                                                <Tippy content="Delete">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.defaultPrevented;
                                                            e.stopPropagation();
                                                            deleteFinding(record);
                                                        }}
                                                    >
                                                        <IconTrashLines className="text-danger" />
                                                    </button>
                                                </Tippy>
                                            </li>
                                        </ul>
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
                                        {params.id ? 'Edit Contact' : 'Add Contact'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="severity">Severity</label>
                                                <input id="severity" type="text" placeholder="Enter Severity" className="form-input" value={params.severity} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="cwe">CWE</label>
                                                <input id="cwe" type="text" placeholder="Enter CWE" className="form-input" value={params.cwe} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="status">Status</label>
                                                <input id="status" type="text" placeholder="Enter Status" className="form-input" value={params.status} onChange={(e) => changeValue(e)} />
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
