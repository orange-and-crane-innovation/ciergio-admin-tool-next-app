import { useEffect, useState } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORD } from '../query'
import { DATE } from '@app/utils'

function RowStyle({ header, child, child2, avatarImg }) {
  return (
    <>
      <div className="flex flex-col mb-4">
        <div
          className="p-0 mb-2 leading-5 text-neutral-dark font-body font-bold text-base"
          style={{ margin: '0px !important; ' }}
        >
          {header}
        </div>
        <div className="p-0 m-0 text-neutral-dark flex flex-row">
          {avatarImg && (
            <div className="image-wrap mr-2">
              <img src={avatarImg} alt="avatar" width="20" height="20"></img>
            </div>
          )}
          {child}
        </div>
        {child2 && <p className="p-0 m-0 bg-black">{child2}</p>}
      </div>
    </>
  )
}

function ModalContent({ recordId }) {
  const [recordData, setRecordData] = useState({})

  const { loading, data, error } = useQuery(GET_REGISTRYRECORD, {
    variables: { recordId }
  })

  useEffect(() => {
    if (!loading && !error && data) {
      const {
        createdAt,
        updatedAt,
        checkedInAt,
        checkInSchedule,
        checkedOutAt,
        visitor,
        author,
        forWho,
        mediaAttachments
      } = data?.getRegistryRecord
      const sched = new Date(+checkInSchedule)
      const checkedIn = new Date(+checkedInAt)
      const checkedO = new Date(+checkedOutAt)
      console.log({ author })
      setRecordData({
        unit: forWho ? forWho?.unit?.name : '',
        host: forWho
          ? `${forWho?.user?.firstName} ${forWho?.user?.lastName}`
          : '',
        schedule: checkInSchedule
          ? DATE.toFriendlyDateTime(sched.toUTCString())
          : DATE.toFriendlyDateTime(checkedIn.toUTCString()),
        visitor: visitor ? `${visitor?.firstName} ${visitor?.lastName}` : '',
        checkedIn: checkedIn
          ? DATE.toFriendlyDateTime(checkedIn.toUTCString())
          : '',
        checkedOut: checkedOutAt
          ? checkedO.toFriendlyDateTime(sched.toUTCString())
          : '----',
        createAt: createdAt ? DATE.toFriendlyDateTime(createdAt) : '',
        author: author
          ? `${author?.user?.firstName} ${author?.user?.lastName}`
          : '',
        updated: updatedAt ? DATE.toFriendlyDateTime(updatedAt) : '',
        avatar: author ? author?.user?.avatar : null
      })
    }
  }, [loading, data, error])

  useEffect(() => {
    console.log(recordData)
  }, [recordData])

  return (
    <>
      <div
        className="w-full flex flex-col p-0 m-0"
        style={{ margin: '0 !important', padding: '0 !important' }}
      >
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Unit" child={recordData.unit} />
          <RowStyle header="Host" child={recordData.host} />
        </div>
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Schedule" child={recordData.schedule} />
          <RowStyle header="Vistor" child={recordData.visitor} />
        </div>
        <div className="w-full grid grid-cols-2">
          <RowStyle header="Check In" child={recordData.checkedIn} />
          <RowStyle header="Check Out" child={recordData.checkedOut} />
        </div>

        <div className="w-full grid grid-cols-2">
          <RowStyle header="Attached Photo" child="None" />
        </div>

        <hr />

        <div className="w-full pt-5">
          <div className="p-0 mb-8 leading-5 text-neutral-dark font-body font-bold text-base">
            Notes
          </div>
          {/* {recordData.notes.map((note, index) => {
            return <RowStyle header="Note" key={index} child={note} />
          })} */}
          <RowStyle header="Note" child="notes" />
        </div>
        <hr />

        <div className="w-full pt-5">
          <div className="p-0 mb-8 leading-5 text-neutral-dark font-body font-bold text-base">
            Edit History
          </div>
          <div className="w-full grid grid-cols-2">
            <RowStyle header="Date Created" child={recordData.createAt} />
            <RowStyle
              header="Created By"
              child={recordData.author}
              avatarImg={recordData.avatar}
            />
          </div>
        </div>

        <hr />

        <div className="w-full m-0 pt-10">
          <div className="grid grid-cols-2 ">
            <p>Date</p>
            <p>Edited By</p>
          </div>
          <div className="w-full bg-gray-300 pt-4 border-gray-200">
            <div className="grid grid-cols-2 ">
              <p>{recordData.updated}</p>
              <p>{recordData.author}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

RowStyle.propTypes = {
  header: P.string.isRequired,
  child: P.string.isRequired,
  child2: P.string,
  avatarImg: P.string
}

ModalContent.propTypes = {
  recordId: P.string
}

export default ModalContent
