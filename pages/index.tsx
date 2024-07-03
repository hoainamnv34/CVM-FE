import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
import Select from 'react-select';
import { useProjectGroupsList } from '@/hooks/projectGroup';
import axios from 'axios';
import { appConfig } from '@/configs';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Admin'));
    });
    const [selectedOption, setSelectedOption] = useState(null);

    const [dataChart, setDataChart] = useState<any>({
        data: [],
        names: [],
    });

    const [data4Card, setData4Card] = useState({
        total: 0,
        open: 0,
        closed: 0,
        riskAccepted: 0,
    });
    const getDataFindings = async (param?: string) => {
        const response = await axios.get(`${appConfig.apiBe}/findings/count?${param}`, {});
        return response.data.data;
    };

    const [dataChartLeft, setDataChartLeft] = useState<Array<any>>();
    const [dataChartRight, setDataChartRight] = useState<Array<any>>();
    const [dataChartNamesRight, setDataChartNamesRight] = useState<Array<any>>();

    // goi api cho 4 card
    useEffect(() => {
        Promise.all([getDataFindings(), getDataFindings('active=true'), getDataFindings('active=false'), getDataFindings('risk_accepted=true')])
            .then((values) => {
                setData4Card({
                    total: values[0],
                    open: values[1],
                    closed: values[2],
                    riskAccepted: values[3],
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    //goi api cho bieu do trai
    useEffect(() => {
        Promise.all([getDataFindings('severity=5'), getDataFindings('severity=4'), getDataFindings('severity=3'), getDataFindings('severity=2'), getDataFindings('severity=1')])
            .then((values) => {
                setDataChartLeft(values);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const [{ data, error, loading }, refetch] = useProjectGroupsList({});

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });

    //Sales By Category
    const salesByCategoryLeft = useMemo(() => {
        return {
            series: dataChartLeft ?? [],
            options: {
                chart: {
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '29px',
                                    offsetY: -10,
                                },
                                value: {
                                    show: true,
                                    fontSize: '26px',
                                    color: isDark ? '#bfc9d4' : undefined,
                                    offsetY: 16,
                                    formatter: (val: any) => {
                                        return val;
                                    },
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    color: '#888ea8',
                                    fontSize: '29px',
                                    formatter: (w: any) => {
                                        return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                            return a + b;
                                        }, 0);
                                    },
                                },
                            },
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                labels: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
                colors: ['#d9534f', '#f0ad4e', '#f0de28', '#337ab7', '#E0E0E0'],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
            },
        };
    }, [dataChartLeft]);

    const salesByCategoryRight = useMemo(() => {
        return {
            series: dataChartRight ?? [],
            options: {
                chart: {
                    type: 'donut',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '29px',
                                    offsetY: -10,
                                },
                                value: {
                                    show: true,
                                    fontSize: '26px',
                                    color: isDark ? '#bfc9d4' : undefined,
                                    offsetY: 16,
                                    formatter: (val: any) => {
                                        return val;
                                    },
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    color: '#888ea8',
                                    fontSize: '29px',
                                    formatter: (w: any) => {
                                        return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                            return a + b;
                                        }, 0);
                                    },
                                },
                            },
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                labels: dataChartNamesRight ?? [],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
            },
        };
    }, [dataChartRight]);

    const genrateData = () => {
        return Array.from({ length: 12 }, (_, i) => `Project ${i + 1}`);
    };

    const uniqueVisitorSeries: any = {
        series: dataChart.data,
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44', '#00b19d'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: dataChart.names,
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };

    const getOptions = (data: any) => {
        return data?.map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            };
        });
    };

    const fetchDataForId = (id: number) => {
        return axios.get(`${appConfig.apiBe}/findings/parent/count?parent_id=${id}&parent_type=1`);
    };

    const fetchDataFindingProject = (id: number) => {
        return axios.get(`${appConfig.apiBe}/dashboard/finding-type-count/${id}`);
    };

    useEffect(() => {
        console.log('data', data?.data.length);
        if (data?.data.length > 0) {
            const ids = data?.data.map((item: any) => item.id);
            const names = data?.data.map((item: any) => item.name);
            Promise.all(ids.map((id: number) => fetchDataForId(id)))
                .then(
                    axios.spread((...responses) => {
                        // Xử lý kết quả của mỗi lời gọi API từ đây
                        const results = responses.map((response) => response.data.data);
                        setDataChartRight(results);
                        setDataChartNamesRight(names);
                    })
                )
                .catch((errors) => {
                    // Xử lý lỗi ở đây nếu có
                    console.error(errors);
                });

            // const dataSalesByCategoryRight: any[] = [];
            // const dataSalesByCategoryRightName: any[] = [];
            // data?.data.map(async (item: any) => {
            //     dataSalesByCategoryRightName.push(item.name);
            //     await axios.get(`${appConfig.apiBe}/findings/parent/count?parent_id=${item.id}&parent_type=1`).then((response) => {
            //         dataSalesByCategoryRight.push(response.data.data);
            //     });
            // });
            // setDataChartRight(dataSalesByCategoryRight);
            // setDataChartNamesRight(dataSalesByCategoryRightName);
        }
    }, [data?.data]);

    useEffect(() => {
        if (selectedOption)
            axios.get(`${appConfig.apiBe}/projects?project_group_id=${selectedOption['value']}`).then((res) => {
                // setSelectedProject(res.data.data);
                const ids = res.data.data.map((item: any) => item.id);
                const names = res.data.data.map((item: any) => item.name);
                Promise.all(ids.map((id: number) => fetchDataFindingProject(id)))
                    .then(
                        axios.spread((...responses) => {
                            // Xử lý kết quả của mỗi lời gọi API từ đây
                            const results = responses.map((response) => response.data.data);
                            console.log('results', results);
                            const transformedData = [
                                {
                                    name: 'Open findings',
                                    data: [] as any[],
                                },
                                {
                                    name: 'Closed findings',
                                    data: [] as any[],
                                },
                                {
                                    name: 'Risk Accepted findings',
                                    data: [] as any[],
                                },
                            ];

                            results.forEach((item: any) => {
                                transformedData[0].data.push(item?.open_count);
                                transformedData[1].data.push(item.close_count);
                                transformedData[2].data.push(item.risk_count);
                            });

                            console.log('transformedData', transformedData);
                            setDataChart({
                                data: transformedData,
                                names,
                            });
                            // setDataChartRight(results);
                        })
                    )
                    .catch((errors) => {
                        // Xử lý lỗi ở đây nếu có
                        console.error(errors);
                    });
            });
    }, [selectedOption]);

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Total Findings​</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:opacity-80"
                                button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data4Card.total}</div>
                        {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                    </div>
                    {/* <div className="mt-5 flex items-center font-semibold">
                        <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 44,700
                    </div> */}
                </div>

                {/* Sessions */}
                <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Opened Findings​</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:opacity-80"
                                button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data4Card.open}</div>
                        {/* <div className="badge bg-white/30">- 2.35% </div> */}
                    </div>
                    {/* <div className="mt-5 flex items-center font-semibold">
                        <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 84,709
                    </div> */}
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Closed Findings​</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:opacity-80"
                                button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {data4Card.closed} </div>
                        {/* <div className="badge bg-white/30">+ 1.35% </div> */}
                    </div>
                    {/* <div className="mt-5 flex items-center font-semibold">
                        <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 37,894
                    </div> */}
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Risk Accepted Findings​</div>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:opacity-80"
                                button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                            >
                                <ul className="text-black dark:text-white-dark">
                                    <li>
                                        <button type="button">View Report</button>
                                    </li>
                                    <li>
                                        <button type="button">Edit Report</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {data4Card.riskAccepted} </div>
                        {/* <div className="badge bg-white/30">- 0.35% </div> */}
                    </div>
                    {/* <div className="mt-5 flex items-center font-semibold">
                        <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Last Week 50.01%
                    </div> */}
                </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <div className="panel h-full">
                        <div className="mb-5 flex items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Finding Severity​</h5>
                        </div>
                        <ReactApexChart
                            series={salesByCategoryLeft.series}
                            options={{ ...salesByCategoryLeft.options, chart: { ...salesByCategoryLeft.options?.chart, type: 'donut' } }}
                            type="donut"
                            height={460}
                            width={'100%'}
                        />
                    </div>
                </div>
                <div>
                    <div className="panel h-full">
                        <div className="mb-5 flex items-center">
                            <h5 className="text-lg font-semibold dark:text-white-light">Findings by Project Group​</h5>
                        </div>
                        <div>
                            <div className="rounded-lg bg-white dark:bg-black">
                                {isMounted ? (
                                    <ReactApexChart
                                        series={salesByCategoryRight.series}
                                        options={{ ...salesByCategoryRight.options, chart: { ...salesByCategoryRight.options?.chart, type: 'donut' } }}
                                        type="donut"
                                        height={460}
                                        width={'100%'}
                                    />
                                ) : (
                                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel h-full p-0 lg:col-span-2">
                <div className="mb-5 flex items-start justify-between border-b border-white-light p-5  dark:border-[#1b2e4b] dark:text-white-light">
                    <h5 className="text-lg font-semibold ">Finding by Projects</h5>
                    <div className="w-[200px]">
                        <Select defaultValue={selectedOption} onChange={setSelectedOption} placeholder="Choose Groups..." options={getOptions(data?.data ?? [])} isSearchable={false} />
                    </div>
                </div>

                {isMounted && <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} width={'100%'} />}
            </div>
        </div>
    );
};

export default Index;
