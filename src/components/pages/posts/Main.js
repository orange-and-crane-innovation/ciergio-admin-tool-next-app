import Link from 'next/link'
import { FormInput } from '@app/components/globals'

function Component() {
  return (
    // <main className={style.Login}>
    <section className={'content-wrap py-5 px-8'}>
      <h1 className="content-title mb-5">Bulletin Post</h1>
      <div className="toolbar inline-flex space-x-4 w-full">
        <ul className="content-tabs w-4/5 pt-3">
          <li className="inline-block mr-5 px-1 text-lg active">
            <Link href="/">All Posts</Link>
          </li>
          <li className="inline-block mr-5 text-lg">
            <Link href="/">My Posts</Link>
          </li>
          <li className="inline-block mr-5 text-lg">
            <Link href="/">Trash</Link>
          </li>
        </ul>
        <div className="p-0 w-1/5">
          <div className="p-0">
            <FormInput
              placeholder="Search by title"
              rightIcon={<i className="">d</i>}
            />
            <i></i>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Component
