import P from 'prop-types'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'

import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

function Component({ title, content }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-base px-8 py-4">{title}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            primary
            leftIcon={<FaPlusCircle />}
            label="Create Ticket"
            // onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card noPadding content={content} className="rounded-t-none" />
    </>
  )
}

Component.propTypes = {
  title: P.string,
  content: P.node || P.string
}

export default Component
