import Props from 'prop-types'
import CheckBox from '@app/components/forms/form-checkbox'

const LIST_OF_ROLES_HEADER = [
  {
    title: 'Messages',
    description: 'Communicate with app users, delete message threads.',
    icon: 'ciergio-new-message'
  },
  {
    title: 'Bulletin Board',
    description: 'Post, edit, and delete posts.',
    icon: 'ciergio-list'
  },
  {
    title: 'Daily Readings',
    description: 'Create and manage daily readings for past and future posts.',
    icon: 'ciergio-book'
  },
  {
    title: 'Offerings',
    description: 'View All Transactions made in offerings',
    icon: 'ciergio-donate-2'
  },
  {
    title: 'Directory',
    description: 'Manage directory listings that are visible in the app.',
    icon: 'ciergio-book'
  },
  {
    title: 'Forms',
    description: 'Create and manage downloadable forms.',
    icon: 'ciergio-file-text'
  }
]

const SingleHeader = ({ title, description, icon }) => {
  return (
    <div className="flex-1">
      <div className="flex flex-col gap-2 ">
        <span className={`${icon} text-primary-500 text-l`}></span>
        <span className="text-l font-bold">{title}</span>
        <p className="text-left">{description}</p>
      </div>
    </div>
  )
}

const Headers = () => {
  return (
    <div className="flex flex-row justify-between gap-5 border-2 p-4">
      {LIST_OF_ROLES_HEADER.map((header, idx) => (
        <SingleHeader key={idx} {...header} />
      ))}
    </div>
  )
}

const Row = () => {
  return (
    <div className="flex flex-row justify-start gap-2">
      <CheckBox value={true} onChange={() => null} />
    </div>
  )
}

const Rows = ({ roles }) => {
  return (
    <div className="flex flex-col p-2 border-b-2 border-l-2 border-r-2">
      {roles ? (
        roles.map((role, idx) => <Row {...role} key={idx} />)
      ) : (
        <div className="w-full text-center">
          <span>No Data</span>
        </div>
      )}
    </div>
  )
}

const RolesTable = () => {
  return (
    <>
      <Headers />
      <Rows />
    </>
  )
}

SingleHeader.propTypes = {
  title: Props.string.isRequired,
  description: Props.string.isRequired,
  icon: Props.string.isRequired
}

Rows.propTypes = {
  roles: Props.array.isRequired
}

export default RolesTable
