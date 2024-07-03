import { useCallback, useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

import { useRouter } from 'next/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Description } from '@/components/Description';
import { useFindingId } from '@/hooks/findings';
import moment from 'moment';

export default function Finding() {
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Checkbox Table'));
    });

    const [{ data, error, loading }, refetch] = useFindingId(router.query.finding as string);

    const [dataProjectGroupsLocalStore, setDataProjectGroupsLocalStore] = useState<any>();
    const [dataProjectLocalStore, setDataProjectLocalStore] = useState<any>();
    const [dataPipelineLocalStore, setDataPipelineLocalStore] = useState<any>();
    const [dataTestLocalStore, setDataTestLocalStore] = useState<any>();
    const [dataFindingLocalStore, setDataFindingLocalStore] = useState<any>();

    useEffect(() => {
        setDataProjectGroupsLocalStore(JSON.parse(window.localStorage.getItem('projectGroups') || ''));
        setDataProjectLocalStore(JSON.parse(window.localStorage.getItem('project') || ''));
        setDataPipelineLocalStore(JSON.parse(window.localStorage.getItem('pipeline') || ''));
        setDataTestLocalStore(JSON.parse(window.localStorage.getItem('test') || ''));
        setDataFindingLocalStore(JSON.parse(window.localStorage.getItem('findings') || ''));
    }, [typeof window]);

    const duplicateFindings = [
        {
            id: 1,
            severity: 'John Doe',
            title: 'Complete',
            test: 'Web',
            status: 'Complete',
            type: 'Web',
            date: '10/08/2020',
            cwe: 'CWE-123',
            vulnerabilityId: 'V-123',
            file: 'File',
            foundBy: 'John Doe',
        },
        {
            id: 2,
            severity: 'John Doe',
            title: 'Complete',
            test: 'Web',
            status: 'Complete',
            type: 'Web',
            date: '10/08/2020',
            cwe: 'CWE-123',
            vulnerabilityId: 'V-123',
            file: 'File',
            foundBy: 'John Doe',
        },
    ];

    return (
        <div>
            <Breadcrumbs
                listArr={[
                    { name: 'Home', link: '/' },
                    { name: 'Project Groups', link: '/projectGroup' },
                    { name: dataProjectGroupsLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}` },
                    { name: dataProjectLocalStore?.name || '', link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}` },
                    {
                        name: dataPipelineLocalStore?.name || dataPipelineLocalStore?.id || '',
                        link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataPipelineLocalStore?.id}`,
                    },
                    {
                        name: dataTestLocalStore?.name || dataTestLocalStore?.id || '',
                        link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataPipelineLocalStore?.id}/${dataTestLocalStore?.id}`,
                    },
                    {
                        name: dataFindingLocalStore?.name || dataFindingLocalStore?.id || '',
                        link: `/projectGroup/${dataProjectGroupsLocalStore?.id}/${dataProjectLocalStore?.id}/${dataPipelineLocalStore?.id}/${dataTestLocalStore?.id}/${dataFindingLocalStore?.id}`,
                        active: true,
                    },
                ]}
            />
            <div className="panel mt-4">
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr className="dark:!bg-transparent">
                                <th>ID</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>CWE</th>
                                <th>Vulnerability ID</th>
                                <th>Found By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={data?.data?.id}>
                                <td>{data?.data?.id}</td>
                                <td>{data?.data?.severity}</td>
                                <td>{data?.data?.active ? 'Active ' : 'Inactive'}</td>
                                <td>
                                    {data?.data?.static_finding ? 'Static' : ''}
                                    &nbsp;
                                    {data?.data?.dynamic_finding ? 'Dynamic' : ''}
                                </td>
                                <td>{moment(data?.data?.created_at).format('HH:mm:ss DD/MM/YYYY')}</td>
                                <td>{data?.data?.cwe}</td>
                                <td>{data?.data?.vuln_id_from_tool}</td>
                                <td>Admin</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <div className="panel mt-4">
                <div className="grid grid-cols-2">
                    <div>Location: {data?.data?.file_path}</div>
                    <div>Line Number: {data?.data?.line}</div>
                </div>
            </div> */}
            <Description title="Location" className={'mt-4'} text={data?.data?.file_path} notEdit />
            <Description title="Line Number" className={'mt-4'} text={data?.data?.line} notEdit />
            <div className="panel mt-4">
                <div className="text-lg font-bold text-blue-500">Duplicate Findings</div>
                <div className="table-responsive mb-5">
                    <table className="table-hover">
                        <thead>
                            <tr className="dark:!bg-transparent">
                                <th>Severity</th>
                                <th>Title</th>
                                <th>Test</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>CWE</th>
                                <th>Vulnerability ID</th>
                                <th>File</th>
                                <th>Found By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {duplicateFindings.map((data) => {
                                return (
                                    <tr key={data.id}>
                                        <td>{data.severity}</td>
                                        <td>{data.title}</td>
                                        <td>{data.test}</td>
                                        <td>{data.status}</td>
                                        <td>{data.type}</td>
                                        <td>{data.date}</td>
                                        <td>{data.cwe}</td>
                                        <td>{data.vulnerabilityId}</td>
                                        <td>{data.file}</td>
                                        <td>{data.foundBy}</td>
                                    </tr>
                                );
                            })} */}
                        </tbody>
                    </table>
                </div>
            </div>
            <Description title="History" className={'mt-4'} text="Description History" />
            <Description className={'mt-4'} text={data?.data?.risk_description} />
            <Description title="Mitigation" className={'mt-4'} text={data?.data?.mitigation} />
            <Description title="Steps To Reproduce" className={'mt-4'} text="Description Steps To Reproduce" />
            <Description title="References" className={'mt-4'} text="Description References" />
        </div>
    );
}
