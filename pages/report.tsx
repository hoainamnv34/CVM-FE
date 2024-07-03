import ReportComponent from '@/components/Report';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { appConfig } from '@/configs';
import { useProjectGroupsList } from '@/hooks/projectGroup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function Report() {
    const [{ data, error, loading }, refetch] = useProjectGroupsList({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any[]>([]);
    const [reportData, setReportData] = useState(null);
    const [infoProject, setInfoProject] = useState<any>({});

    const getOptions = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            };
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

    const onSubmit = () => {
        if (!(selectedOption && selectedOption2)) {
            showMessage('Select is required.', 'error');
            return true;
        }
        axios.get(`${appConfig.apiBe}/findings?project_id=${selectedOption2['value']}`).then((res) => {
            console.log('Log LOG::: ', res.data.data);
            setReportData(res.data.data);
        });
    };

    useEffect(() => {
        if (selectedOption)
            axios.get(`${appConfig.apiBe}/projects?project_group_id=${selectedOption['value']}`).then((res) => {
                setSelectedProject(res.data.data);
            });
    }, [selectedOption]);

    useEffect(() => {
        if (selectedOption2)
            axios.get(`${appConfig.apiBe}/projects/${selectedOption2['value']}`).then((res) => {
                setInfoProject(res.data.data);
            });
    }, [selectedOption2]);

    return (
        <div>
            <Breadcrumbs
                listArr={[
                    { name: 'Home', link: '/' },
                    { name: 'Generate Report', link: '/report' },
                ]}
            />
            <div className="panel mt-4 flex justify-center">
                <div>
                    <div className="space-y-5">
                        {/* <div className="flex flex-col sm:flex-row">
                            <label htmlFor="horizontalEmail" className="mb-0 !w-[100px] rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                Report Name
                            </label>
                            <input id="horizontalEmail" type="email" placeholder="Enter Report Name" className="form-input flex-1" />
                        </div> */}
                        <div className="flex flex-col sm:flex-row">
                            <label htmlFor="horizontalPassword" className="mb-0 !w-[100px] whitespace-nowrap rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                Project Groups
                            </label>
                            <Select
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                className="w-[250px]"
                                placeholder="Choose..."
                                options={getOptions(data?.data ?? [])}
                                isSearchable={false}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <label htmlFor="horizontalPassword" className="mb-0 !w-[100px] whitespace-nowrap rtl:ml-2 sm:w-1/4 sm:ltr:mr-2">
                                Project
                            </label>
                            <Select
                                defaultValue={selectedOption2}
                                onChange={setSelectedOption2}
                                className="w-[250px]"
                                placeholder="Choose..."
                                options={getOptions(selectedProject) ?? []}
                                isSearchable={false}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button onClick={onSubmit} className="btn btn-primary !mt-6">
                                Generate Report
                            </button>
                        </div>
                    </div>
                    {reportData && (
                        <ReportComponent
                            data={{
                                info: {
                                    name: infoProject?.name ?? 'Report',
                                    description: infoProject?.description ?? '',
                                    repository_url: infoProject?.repository_url ?? '',
                                },
                                data: reportData,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
