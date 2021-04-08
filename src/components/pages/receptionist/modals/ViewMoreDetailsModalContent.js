/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORD } from '../query'
import { DATE } from '@app/utils'
import moment from 'moment'

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
  const [recordData, setRecordData] = useState(null)

  const { loading, data, error, refetch } = useQuery(GET_REGISTRYRECORD, {
    variables: { recordId }
  })

  useEffect(() => {
    if (recordId) {
      refetch()
    }
  }, [recordId])

  useEffect(() => {
    if (!loading && data && !error) {
      const {
        createdAt,
        updatedAt,
        checkedInAt,
        checkInSchedule,
        checkedOutAt,
        visitor,
        author,
        forWho,
        mediaAttachments,
        notes
      } = data?.getRegistryRecord
      const sched = new Date(+checkInSchedule)
      const checkedIn = new Date(+checkedInAt)
      const checkedO = new Date(+checkedOutAt)

      setRecordData({
        unit: forWho ? forWho?.unit?.name : '',
        host: forWho
          ? `${forWho?.user?.firstName} ${forWho?.user?.lastName}`
          : '',
        schedule: checkInSchedule
          ? DATE.toFriendlyDateTime(sched.toUTCString())
          : DATE.toFriendlyDateTime(checkedIn.toUTCString()),
        visitor: visitor ? `${visitor?.firstName} ${visitor?.lastName}` : '',
        checkedIn: checkedInAt
          ? DATE.toFriendlyDateTime(checkedIn.toUTCString())
          : '----',
        checkedOut: checkedOutAt
          ? DATE.toFriendlyDateTime(checkedO.toUTCString())
          : '----',
        createAt: createdAt ? DATE.toFriendlyDateTime(createdAt) : '',
        author: author
          ? `${author?.user?.firstName} ${author?.user?.lastName}`
          : '',
        updated: updatedAt ? DATE.toFriendlyDateTime(updatedAt) : '',
        avatar: author ? author?.user?.avatar : null,
        image: mediaAttachments ? mediaAttachments[0] : {},
        notes: notes ? notes?.data : ''
      })
    }
  }, [loading, data, error])

  return (
    <>
      <div
        className="w-full flex flex-col p-0 m-0"
        style={{ margin: '0 !important', padding: '0 !important' }}
      >
        {recordData && (
          <>
            {' '}
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
              {recordData.image ? (
                <div>
                  <RowStyle header="Attached Photo" />

                  <img
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      marginRight: '8px',
                      marginVottom: '8px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: '1px solid rgb(221, 221, 221)'
                    }}
                    src={recordData.image.url}
                    alt="attached image"
                  />
                </div>
              ) : (
                <RowStyle header="Attached Photo" child="None" />
              )}
            </div>
            <br />
            <hr />
            <div className="w-full pt-5">
              <div className="p-0 mb-8 leading-5 text-neutral-dark font-body font-bold text-base">
                Notes
              </div>
              {/* {recordData.notes.map((note, index) => {
        return <RowStyle header="Note" key={index} child={note} />
      })} */}
              {recordData.notes.length > 0 &&
                recordData.notes.map(note => {
                  return (
                    <RowStyle
                      key={note._id}
                      header={`${note.content}`}
                      child={`Added by ${note.author.user.firstName} ${
                        note.author.user.lastName
                      } ${moment(note.createdAt).fromNow()}`}
                    />
                  )
                })}
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
            </div>{' '}
          </>
        )}
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
