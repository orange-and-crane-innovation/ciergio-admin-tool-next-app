/* eslint-disable react/jsx-key */
import Link from 'next/link'
import { Button, FormInput, FormSelect, Card } from '@app/components/globals'

function Component() {
  return (
    // <main className={style.Login}>
    <section className={'content-wrap py-5 px-8'}>
      <h1 className="content-title mb-5">Bulletin Post</h1>
      <div className="toolbar">
        <ul className="content-tabs col-span-4 pt-3">
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
        <div className="p-0">
          <FormInput placeholder="Search by title" rightIcon="ciergio-search" />
        </div>
      </div>
      <div className="toolbar">
        <div className="p-0 inline-flex space-x-2 col-span-2">
          <div className="p-0 w-1/2">
            <FormSelect
              options={[{ label: 'Option 1', value: 'option1val' }]}
            />
          </div>
          <div className="p-0 w-1/2">
            <Button />
          </div>
        </div>
        <div className="p-0" />
        <div className="p-0" />
        <div className="p-0">
          <FormInput placeholder="Search by title" rightIcon="ciergio-search" />
        </div>
      </div>
      <Card
        title="All Posts"
        actions={[
          <Button leftIcon="ciergio-circle-plus" label="Create Post" />,
          <Button leftIcon="ciergio-circle-plus" label="Create Post" />
        ]}
        content={
          <ul>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
          </ul>
        }
      />
    </section>
  )
}

export default Component
