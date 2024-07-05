import { useCallback, useEffect, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

import { useRouter } from 'next/router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Description } from '@/components/Description';
import { useFindingId } from '@/hooks/findings';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import Markdown from 'react-markdown';

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

    const references_list = data?.data?.reference.split('\n');
    const references = `
        <div>
            ${references_list
                ?.map(
                    (line: any, index: any) => `
            <p key=${index}>
                <a href="${line}" target="_blank" rel="noopener noreferrer">${line}</a>
            </p>
            `
                )
                .join('')}
        </div>
    `;

    const description_list = data?.data?.description.split('\n');
    const description = `
        <div>
            ${description_list
                ?.map(
                    (line: any, index: any) => `
                <ReactMarkdown>${line}</ReactMarkdown>
            `
                )
                .join('')}
        </div>
    `;

    // useEffect(() => {
    //     console.log(description_list);
    //     console.log(description);
    // }, [description]);
    const [repoURL, setRepoURL] = useState('');
    const [commitHash, setCommitHash] = useState('');
    const [filePath, setFilePath] = useState('');
    const [line, setLine] = useState('');
    const [linkLocation, setLinkLocation] = useState('');

    useEffect(() => {
        console.log(dataProjectLocalStore?.repository_url);
        console.log(dataPipelineLocalStore?.commit_hash);
        console.log(dataFindingLocalStore?.file_path);
        console.log(dataFindingLocalStore?.line);
        setRepoURL(dataProjectLocalStore?.repository_url);
        setCommitHash(dataPipelineLocalStore?.commit_hash);
        setFilePath(dataFindingLocalStore?.file_path);
        setLine(dataFindingLocalStore?.line);
        setLinkLocation(`${repoURL}/blob/${commitHash}/${filePath}#L${line}`);
    }, [description]);

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
                <span className="text-lg font-bold text-blue-500">{data?.data?.title}</span>
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
                                {/* <th>Found By</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={data?.data?.id}>
                                <td>{data?.data?.id}</td>
                                <td>{convertSeverity(data?.data?.severity)}</td>
                                <td>
                                    {' '}
                                    {data?.data?.active ? 'Active' : 'Inactive'} {data?.data?.risk_accepted && ', Risk Accepted'}
                                </td>

                                <td>
                                    {data?.data?.static_finding ? 'Static' : ''}
                                    &nbsp;
                                    {data?.data?.dynamic_finding ? 'Dynamic' : ''}
                                </td>
                                <td>{moment(data?.data?.created_at).format('HH:mm:ss DD/MM/YYYY')}</td>
                                <td>{data?.data?.cwe ? data?.data?.cwe : ''}</td>
                                <td>{data?.data?.vuln_id_from_tool}</td>
                                {/* <td>Admin</td> */}
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
            <Description title="Location" className={'mt-4'} isUrl={true} link={`${repoURL}/blob/${commitHash}/${filePath}#L${line}`} text={data?.data?.file_path} notEdit />
            <Description title="Line Number" className={'mt-4'} text={data?.data?.line} notEdit />

            {/* <Description title="History" className={'mt-4'} text="Description History" /> */}
            <Description className={'mt-4'} isMarkdown={true} text={data?.data?.description} notEdit={true} />
            <Description title="Mitigation" className={'mt-4'} text={data?.data?.mitigation} notEdit={true} />
            {/* <Description title="Steps To Reproduce" className={'mt-4'} text="Description Steps To Reproduce" /> */}
            <Description title="References" className={'mt-4'} html={true} text={references} notEdit={true} />
            {/* <Markdown>{markdown}</Markdown> */}
        </div>
    );
}
