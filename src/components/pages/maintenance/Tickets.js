import P from 'prop-types'

import { BsEnvelopeFill, BsEnvelopeOpenFill } from 'react-icons/bs'
import { AiOutlineFileText, AiOutlineFileSync } from 'react-icons/ai'

function Tickets() {
  return (
    <div className="flex w-full justify-between mb-8">
      <Ticket
        text="New"
        count="3"
        icon={<BsEnvelopeFill className="text-3xl text-white" />}
        iconBackgroundClassname="bg-yellow-500"
      />
      <Ticket
        text="Unassigned"
        count="23"
        icon={<BsEnvelopeOpenFill className="text-3xl text-white" />}
        iconBackgroundClassname="bg-blue-500"
      />
      <Ticket
        text="In Progress"
        count="39"
        icon={<AiOutlineFileText className="text-4xl text-white" />}
        iconBackgroundClassname="bg-green-500"
      />
      <Ticket
        text="On Hold"
        count="3"
        icon={<AiOutlineFileSync className="text-4xl text-white" />}
        iconBackgroundClassname="bg-gray-500"
      />
    </div>
  )
}

const Ticket = ({ text, count, icon, iconBackgroundClassname }) => (
  <div className="w-4/12 flex justify-start border mx-2">
    <div
      className={`w-1/2 flex justify-center items-center rounded-l ${iconBackgroundClassname}`}
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
  count: P.number,
  icon: P.node,
  iconBackgroundClassname: P.string
}

export default Tickets
