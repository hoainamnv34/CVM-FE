import { Fragment, useEffect, useState } from 'react';
import IconEdit from './Icon/IconEdit';
import { Dialog, Transition } from '@headlessui/react';
import IconX from './Icon/IconX';
import Swal from 'sweetalert2';
import axios from 'axios';
import { appConfig } from '@/configs';

interface DescriptionProps {
    className?: string;
    text?: any;
    title?: string;
    notEdit?: boolean;
    url?: string;
    data?: any;
    id?: string | number;
}

export function PipelineEvaluation(props: DescriptionProps) {
    const [data, setData] = useState<{
        severity_critical_score: number;
        severity_high_score: number;
        severity_medium_score: number;
        severity_low_score: number;
        threshold_score: number;
    }>(props.data);
    const [isEdit, setIsEdit] = useState(false);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setData({ ...data, [id]: Number(value) });
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

    const save = () => {
        //TODO: Save the text
        axios.put(`${appConfig.apiBe}/pipeline-evaluations/${props.id}`, data);
        showMessage('Updated successfully.');
        setIsEdit(false);
    };

    useEffect(() => {
        setData({
            severity_critical_score: props.data?.severity_critical_score,
            severity_high_score: props.data?.severity_high_score,
            severity_medium_score: props.data?.severity_medium_score,
            severity_low_score: props.data?.severity_low_score,
            threshold_score: props.data?.threshold_score,
        });
    }, [props.data]);
    return (
        <>
            <div className={`panel items-center overflow-x-auto whitespace-nowrap p-3 text-primary ${props.className}`}>
                <div className="flex items-center justify-between ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <span className="text-lg font-bold text-blue-500">Edit</span>
                    {props.notEdit ? null : (
                        <span onClick={() => setIsEdit(true)}>
                            <IconEdit />
                        </span>
                    )}
                </div>
                <div>
                    <div className="flex">
                        <div className="w-[200px]">Severity Critical Score​:</div>
                        <div>{data?.severity_critical_score}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[200px]">Severity High Score​:</div>
                        <div>{data?.severity_high_score}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[200px]">Severity Medium Score​:</div>
                        <div>{data?.severity_medium_score}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[200px]">Severity Low Score​: </div>
                        <div>{data?.severity_low_score}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[200px]">Threshold Score​: </div>
                        <div>{data?.threshold_score}</div>
                    </div>
                </div>
            </div>
            <Transition appear show={isEdit} as={Fragment}>
                <Dialog as="div" open={isEdit} onClose={() => setIsEdit(false)} className="relative z-50">
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
                                        onClick={() => setIsEdit(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">Edit</div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="severity_critical_score">Severity Critical Score</label>
                                                <input
                                                    id="severity_critical_score"
                                                    type="number"
                                                    placeholder={`Enter Severity Critical Score`}
                                                    className="form-input"
                                                    value={data?.severity_critical_score}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="severity_high_score">Severity High Score</label>
                                                <input
                                                    id="severity_high_score"
                                                    type="number"
                                                    placeholder={`Enter Severity High Score`}
                                                    className="form-input"
                                                    value={data?.severity_high_score}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="severity_medium_score">Severity Medium Score</label>
                                                <input
                                                    id="severity_medium_score"
                                                    type="number"
                                                    placeholder={`Enter Severity Medium Score`}
                                                    className="form-input"
                                                    value={data?.severity_medium_score}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="severity_low_score">Severity Low Score</label>
                                                <input
                                                    id="severity_low_score"
                                                    type="number"
                                                    placeholder={`Enter Severity Low Score`}
                                                    className="form-input"
                                                    value={data?.severity_low_score}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="threshold_score">Threshold Score</label>
                                                <input
                                                    id="threshold_score"
                                                    type="number"
                                                    placeholder={`Enter Threshold Score`}
                                                    className="form-input"
                                                    value={data?.threshold_score}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>

                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsEdit(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={save}>
                                                    {props.text ? 'Update' : 'Add'}
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
        </>
    );
}
