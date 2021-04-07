import { useEffect, useState } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORD } from '../query'
import { IoDocumentTextOutline } from 'react-icons/io5'

import moment from 'moment'

function ViewNotes({ id }) {
  const [notes, setNotes] = useState([])
  const { loading, data, error } = useQuery(GET_REGISTRYRECORD, {
    variables: { recordId: id }
  })

  useEffect(() => {
    if (!loading && data && !error) {
      const { notes } = data?.getRegistryRecord
      setNotes(notes ? notes?.data : [])
    }
  }, [loading, data, error])

  return (
    <>
      {notes.length > 0 ? (
        notes.map(note => {
          return (
            <div key={note._id}>
              <div
                className="p-0 mb-2 leading-5 text-neutral-dark font-body font-bold text-base"
                style={{ margin: '0px !important; ' }}
              >
                {note.content}
              </div>
              <div className="p-0 m-0 text-neutral-dark flex flex-row">
                {`Added by ${note.author.user.firstName} ${
                  note.author.user.lastName
                } ${moment(note.createdAt).fromNow()}`}
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <IoDocumentTextOutline size={70} />
          <p className="text-lg font-bold text-gray-500">No Notes</p>
        </div>
      )}
    </>
  )
}

ViewNotes.propTypes = {
  id: P.string.isRequired
}

export default ViewNotes
