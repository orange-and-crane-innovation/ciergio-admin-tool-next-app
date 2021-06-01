import { useState, useEffect } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { BiLoaderAlt } from 'react-icons/bi'

import IconUnread from '@app/assets/svg/mnr-unread.svg'
import IconInProgress from '@app/assets/svg/mnr-in-progress.svg'
import IconUnassigned from '@app/assets/svg/mnr-unassigned.svg'
import IconOnHold from '@app/assets/svg/mnr-on-hold.svg'

import { GET_ISSUES_COUNT } from '../queries'

function Tickets({ buildingId }) {
  const [ticketCount, setTicketCount] = useState({
    unread: 0,
    unassigned: 0,
    ongoing: 0,
    onhold: 0
  })

  const { data, loading } = useQuery(GET_ISSUES_COUNT, {
    variables: {
      where: {
        buildingId
      }
    }
  })

  useEffect(() => {
    if (data) {
      const count = data?.getIssues?.countStatus

      if (count) {
        setTicketCount({
          unread: count?.unread,
          unassigned: count?.unassigned,
          ongoing: count?.ongoing,
          onhold: count?.onhold
        })
      }
    }
  }, [data])

  return (
    <div className="flex flex-col w-full mb-8 lg:flex-row">
      <div className="flex flex-col w-full sm:flex-row">
        <Ticket
          text="New"
          loading={loading}
          count={ticketCount?.unread}
          icon={<IconUnread />}
          bgClassName="bg-warning-500"
        />
        <Ticket
          text="Unassigned"
          loading={loading}
          count={ticketCount?.unassigned}
          icon={<IconUnassigned />}
          bgClassName="bg-secondary-900"
        />
      </div>
      <div className="flex flex-col w-full sm:flex-row">
        <Ticket
          text="In Progress"
          loading={loading}
          count={ticketCount?.ongoing}
          icon={<IconInProgress />}
          bgClassName="bg-success-500"
        />
        <Ticket
          text="On Hold"
          loading={loading}
          count={ticketCount?.onhold}
          icon={<IconOnHold className="text-4xl text-white" />}
          bgClassName="bg-neutral-400"
        />
      </div>
    </div>
  )
}

const Ticket = ({ text, loading, count, icon, bgClassName }) => (
  <div className="w-full h-32 flex justify-start border m-2">
    <div
      className={`w-32 flex justify-center items-center rounded-l ${bgClassName}`}
    >
      <div>{icon}</div>
    </div>
    <div className="p-4 bg-white w-full rounded-r">
      <h4 className="text-base leading-7 mb-2">{text}</h4>
      <p className="text-5xl leading-10 font-bold">
        {loading ? (
          <BiLoaderAlt className="icon-spin text-neutral-500" />
        ) : (
          count
        )}
      </p>
    </div>
  </div>
)

Ticket.propTypes = {
  text: P.string,
  loading: P.bool,
  count: P.number.isRequired,
  icon: P.element,
  bgClassName: P.string
}

Tickets.propTypes = {
  buildingId: P.string.isRequired
}

export default Tickets
