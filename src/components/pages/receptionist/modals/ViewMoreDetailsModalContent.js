/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState, useMemo } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { BsFillClockFill } from 'react-icons/bs'
import { FiFile } from 'react-icons/fi'
import { BiLoaderAlt } from 'react-icons/bi'

import Table from '@app/components/table'
import LightBox from '@app/components/lightbox'
import NotifCard from '@app/components/globals/NotifCard'

import { DATE } from '@app/utils'
import errorHandler from '@app/utils/errorHandler'

import { GET_REGISTRYRECORD } from '../query'

const historyHeader = [
  {
    name: 'Date',
    width: ''
  },
  {
    name: 'Edited By',
    width: ''
  }
]

function RowStyle({ header, child, child2, avatarImg }) {
  return (
    <>
      <div className="flex flex-col mb-4 text-base leading-7">
        <div className="font-semibold">{header}</div>
        <div className="flex flex-row">
          {avatarImg && (
            <div className="image-wrap mr-2">
              <img src={avatarImg} alt="avatar" width="20" height="20"></img>
            </div>
          )}
          {child}
        </div>
        {child2 && <p className="bg-black">{child2}</p>}
      </div>
    </>
  )
}

function ModalContent({ recordId, refetch }) {
  const [recordData, setRecordData] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [imageOpen, setImageOpen] = useState(false)

  const {
    loading,
    data,
    error,
    refetch: refetchData
  } = useQuery(GET_REGISTRYRECORD, {
    fetchPolicy: 'network-only',
    variables: { recordId }
  })

  useEffect(() => {
    setRecordData(null)
    refetchData()
  }, [refetch])

  const handleImageOpen = index => {
    setImageOpen(true)
    handleImageIndex(index)
  }

  const handleImageClose = () => {
    setImageOpen(false)
  }

  const handleImageIndex = index => {
    setImageIndex(index)
  }

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data && !error) {
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
          notes,
          history
        } = data?.getRegistryRecord
        const sched = new Date(+checkInSchedule)
        const checkedIn = new Date(+checkedInAt)
        const checkedO = new Date(+checkedOutAt)

        setRecordData({
          unit: forWho ? forWho?.unit?.name : '----',
          host:
            forWho && forWho?.user?.firstName && forWho?.user?.lastName
              ? `${forWho?.user?.firstName} ${forWho?.user?.lastName}`
              : '----',
          schedule: checkInSchedule
            ? DATE.toFriendlyShortDateTime(sched.toUTCString())
            : DATE.toFriendlyShortDateTime(checkedIn.toUTCString()),
          visitor: visitor
            ? `${visitor?.firstName} ${visitor?.lastName}`
            : '----',
          checkedIn: checkedInAt
            ? DATE.toFriendlyShortDateTime(checkedIn.toUTCString())
            : '----',
          checkedOut: checkedOutAt
            ? DATE.toFriendlyShortDateTime(checkedO.toUTCString())
            : '----',
          createAt: createdAt
            ? DATE.toFriendlyShortDateTime(createdAt)
            : '----',
          author: author
            ? `${author?.user?.firstName} ${author?.user?.lastName}`
            : '----',
          updated: updatedAt ? DATE.toFriendlyShortDateTime(updatedAt) : '----',
          avatar: author ? author?.user?.avatar : null,
          image: mediaAttachments
            ? mediaAttachments?.map(item => item.url)
            : [],
          notes: notes ? notes?.data : '',
          history: history
        })
      }
    }
  }, [loading, data, error])

  const historyData = useMemo(() => {
    const history = recordData?.history
    return {
      count: history?.count ?? 0,
      limit: history?.limit ?? 0,
      offset: history?.offset ?? 0,
      data:
        history?.data?.length > 0
          ? history?.data?.map(item => {
              return {
                date: DATE.toFriendlyShortDateTime(item?.createdAt),
                activity: item?.activity
              }
            })
          : []
    }
  }, [recordData])

  return (
    <div className="w-full flex flex-col text-base leading-7">
      {loading ? (
        <span className="p-16">
          <BiLoaderAlt className="m-auto icon-spin text-neutral-500 text-3xl" />
        </span>
      ) : recordData ? (
        <>
          <div className="m-4">
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
            <div className="w-full">
              {recordData.image?.length > 0 ? (
                <div>
                  <RowStyle header="Attached Photo" />
                  <div className="flex items-center">
                    {recordData.image.map((media, index) => (
                      <div
                        className="mr-1 w-16 h-16 rounded-md overflow-auto border border-neutral-300"
                        key={media._id}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                        onClick={() => handleImageOpen(index)}
                      >
                        <img
                          src={media}
                          alt={`image-${index}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <RowStyle
                  header={
                    <span className="text-neutral-500">Attached Photo</span>
                  }
                  child="None"
                />
              )}
            </div>
          </div>
          <div className="border-t border-neutral-300 -mx-4 p-6">
            <div className="font-semibold mb-2">Notes</div>
            {recordData.notes.length > 0
              ? recordData.notes.map(note => {
                  return (
                    <RowStyle
                      key={note._id}
                      header={`${note.content}`}
                      child={
                        <span className="text-neutral-600 text-md">{`Added by ${
                          note.author.user.firstName
                        } ${note.author.user.lastName} ${moment(
                          note.createdAt
                        ).fromNow()}`}</span>
                      }
                    />
                  )
                })
              : 'None'}
          </div>

          <div className="border-t border-neutral-300 -mx-4 p-6">
            <div className="mb-2 font-bold">Edit History</div>
            <div className="w-full grid grid-cols-2">
              <RowStyle header="Date Created" child={recordData.createAt} />
              <RowStyle
                header="Created By"
                child={recordData.author}
                avatarImg={recordData.avatar}
              />
            </div>
          </div>

          <div className="-mx-8 mb-4 px-4 border-t border-neutral-300">
            <Table
              rowNames={historyHeader}
              items={historyData}
              emptyText={
                <NotifCard
                  icon={<BsFillClockFill />}
                  header="No history yet."
                />
              }
            />
          </div>
        </>
      ) : (
        <NotifCard icon={<FiFile />} header="No details" />
      )}

      <LightBox
        isOpen={imageOpen}
        images={recordData?.image ?? []}
        imageIndex={imageIndex}
        onClick={handleImageIndex}
        onClose={handleImageClose}
      />
    </div>
  )
}

RowStyle.propTypes = {
  header: P.any.isRequired,
  child: P.any.isRequired,
  child2: P.any,
  avatarImg: P.string
}

ModalContent.propTypes = {
  recordId: P.string,
  refetch: P.any
}

export default ModalContent
