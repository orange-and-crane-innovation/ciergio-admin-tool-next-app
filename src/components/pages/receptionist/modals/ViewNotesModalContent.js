import { useEffect, useState } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { BiLoaderAlt } from 'react-icons/bi'
import moment from 'moment'

import NotifCard from '@app/components/globals/NotifCard'

import { GET_REGISTRYRECORD } from '../query'

function ViewNotes({ id, refetch }) {
  const [notes, setNotes] = useState([])
  const {
    loading,
    data,
    error,
    refetch: refetchNotes
  } = useQuery(GET_REGISTRYRECORD, {
    fetchPolicy: 'network-only',
    variables: { recordId: id }
  })

  useEffect(() => {
    refetchNotes()
  }, [refetch])

  useEffect(() => {
    if (!loading && data && !error) {
      const { notes } = data?.getRegistryRecord
      setNotes(notes ? notes?.data : [])
    }
  }, [loading, data, error])

  return (
    <>
      {loading ? (
        <span className="p-16">
          <BiLoaderAlt className="m-auto icon-spin text-neutral-500 text-3xl" />
        </span>
      ) : notes.length > 0 ? (
        notes.map(note => {
          return (
            <div key={note._id} className="p-4">
              <div className="mb-2 font-semibold text-base leading-5">
                {note.content}
              </div>
              <div className="flex flex-row text-neutral-600 text-md">
                {`Added by ${note.author.user.firstName} ${
                  note.author.user.lastName
                } ${moment(note.createdAt).fromNow()}`}
              </div>
            </div>
          )
        })
      ) : notes.length === 0 ? (
        <NotifCard icon={<IoDocumentTextOutline />} header={`No Notes`} />
      ) : null}
    </>
  )
}

ViewNotes.propTypes = {
  id: P.string.isRequired,
  refetch: P.any
}

export default ViewNotes
