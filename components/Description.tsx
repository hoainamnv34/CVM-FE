import IconBell from '@/components/Icon/IconBell';
import { Fragment, useEffect, useState } from 'react';
import IconEdit from './Icon/IconEdit';
import { Dialog, Transition } from '@headlessui/react';
import IconX from './Icon/IconX';
import Swal from 'sweetalert2';
import { useEditDescription } from '@/hooks/app';
import ReactMarkdown from 'react-markdown';

interface DescriptionProps {
    className?: string;
    text?: any;
    title?: string;
    isUrl?: boolean;
    link?: string;
    notEdit?: boolean;
    html?: boolean;
    url?: string;
    field?: string;
    isMarkdown?: boolean;
}

export function Description(props: DescriptionProps) {
    const [{ loading: loadingEdit, error: errorEdit }, doEdit] = useEditDescription();
    const [isEdit, setIsEdit] = useState(false);
    const [text, setText] = useState(props.text ?? '');
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setText(value);
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
        const objData = {
            [`${props.field ?? 'description'}`]: text,
        };
        doEdit({
            url: `${props.url}`,
            data: objData,
        }).then((res) => {
            // if (res.data && res.data.code === 200) {
            //     refetch();
            // }
        });
        showMessage('Successfully.');
        setIsEdit(false);
    };

    useEffect(() => {
        setText(props.text ?? '');
    }, [props.text]);
    return (
        <>
            <div className={`panel items-center overflow-x-auto whitespace-nowrap p-3 text-primary ${props.className}`}>
                <div className="flex items-center justify-between ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <span className="text-lg font-bold text-blue-500">{props.title ?? 'Description'}</span>
                    {props.notEdit ? null : (
                        <span onClick={() => setIsEdit(true)}>
                            <IconEdit />
                        </span>
                    )}
                </div>
                {props.isUrl ? (
                    <a href={props.link} target="_blank" className="mt-2 block text-black hover:underline" rel="noreferrer">
                        {text}
                    </a>
                ) : props.html ? (
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                ) : props.isMarkdown ? (
                    <div className="text-black">
                        {text.split('\n').map((line: any, index: any) => (
                            <ReactMarkdown key={index}>{line}</ReactMarkdown>
                        ))}
                    </div>
                ) : (
                    <span className="mt-2 block text-black hover:underline">{text}</span>
                )}
                <div></div>
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
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">{props.text ? 'Edit' : 'Add'}</div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">{props.title ?? 'Description'}</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder={`Enter ${props.title ?? 'Description'}`}
                                                    className="form-input"
                                                    value={text}
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
