import Link from 'next/link';

interface BreadcrumbsProps {
    listArr: {
        name?: string;
        link?: string;
        active?: boolean;
    }[];
}

export function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <ol className="flex font-semibold text-gray-500 dark:text-white-dark">
            {props.listArr.map((item, index) => {
                return (
                    <li key={index} className={index ? 'before:relative before:-top-0.5 before:mx-4 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-primary' : ''}>
                        {item.active ? (
                            <Link href={item.link ?? '#'} className="text-primary hover:underline">
                                {item.name}
                            </Link>
                        ) : (
                            <Link href={item.link ?? '#'} className="hover:underline">
                                {item.name}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
