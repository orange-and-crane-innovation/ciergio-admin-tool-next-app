import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { BsEnvelopeFill, BsEnvelopeOpenFill } from 'react-icons/bs'
import { AiOutlineFileText, AiOutlineFileSync } from 'react-icons/ai'
import { GET_ISSUES_COUNT } from '../queries'

function Tickets({ buildingId }) {
  const { data: unassigned } = useQuery(GET_ISSUES_COUNT, {
    variables: {
      where: {
        status: ['unassigned'],
        buildingId
      }
    }
  })
  const { data: ongoing } = useQuery(GET_ISSUES_COUNT, {
    variables: {
      where: {
        status: ['ongoing'],
        buildingId
      }
    }
  })
  const { data: onhold } = useQuery(GET_ISSUES_COUNT, {
    variables: {
      where: {
        status: ['onhold'],
        buildingId
      }
    }
  })
  const { data: newIssues } = useQuery(GET_ISSUES_COUNT, {
    variables: {
      where: {
        status: ['unread'],
        buildingId
      }
    }
  })

  return (
    <div className="flex w-full justify-between mb-8">
      <Ticket
        text="New"
        count={newIssues?.getIssues?.count || 0}
        icon={<BsEnvelopeFill className="text-3xl text-white" />}
        bgClassName="bg-yellow-500"
      />
      <Ticket
        text="Unassigned"
        count={unassigned?.getIssues?.count || 0}
        icon={<BsEnvelopeOpenFill className="text-3xl text-white" />}
        bgClassName="bg-blue-500"
      />
      <Ticket
        text="In Progress"
        count={ongoing?.getIssues?.count || 0}
        icon={<AiOutlineFileText className="text-4xl text-white" />}
        bgClassName="bg-green-500"
      />
      <Ticket
        text="On Hold"
        count={onhold?.getIssues?.count || 0}
        icon={<AiOutlineFileSync className="text-4xl text-white" />}
        bgClassName="bg-gray-500"
      />
    </div>
  )
}

const Ticket = ({ text, count, icon, bgClassName }) => (
  <div className="w-4/12 flex justify-start border mx-2">
    <div
      className={`w-1/2 flex justify-center items-center rounded-l ${bgClassName}`}
    >
      <div>{icon}</div>
    </div>
    <div className="p-4 bg-white w-full rounded-r">
      <h4 className="text-base">{text}</h4>
      <p className="text-xl font-bold">{count}</p>
    </div>
  </div>
)

Ticket.propTypes = {
  text: P.string,
  count: P.number.isRequired,
  icon: P.element,
  bgClassName: P.string
}

Tickets.propTypes = {
  buildingId: P.string.isRequired
}

export default Tickets
