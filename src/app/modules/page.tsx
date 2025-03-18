import Link from "next/link"
import ExampleFileTree from "./data"

export default function Page() {
    return (
        <>
            <ExampleFileTree />
            <Link
                className='text-sm text-gray-500 hover:text-gray-700 underline'
                href='https://github.com/remcostoeten/Beautiful-interactive-file-tree/tree/boilerplate/src/app/modules'
                target='_blank'
            >
                View source code on GitHub
            </Link>
        </>
    )
}