import P from 'prop-types'

function RemoveStaffContent({ user }) {
  const { firstName, lastName, jobTitle, companyName } = user
  return (
    <div className="w-full">
      <div className="mb-4">
        <p>
          {`Warning: You're about to remove `}
          <span className="font-bold">{`${firstName} ${lastName}`}</span>
          {` as ${jobTitle || 'admin'} of ${companyName}.`}
        </p>
      </div>
      <div className="mb-4 p-4 bg-blue-100">
        <ul className="list-disc">
          <li className="mb-2">{`${firstName}'s Profile will be removed from the unit.`}</li>
          <li className="mb-2">{`${firstName} won't be able to access this unit from their app.`}</li>
          <li className="mb-2">
            Messages, tickets, comments, and notes created by this user will
            still be viewable.
          </li>
        </ul>
      </div>
      <p>
        {`Are you sure you want to remove `}
        <span className="font-bold">{`${firstName} ${lastName}`}</span>{' '}
        {` from this unit?`}
      </p>
    </div>
  )
}

RemoveStaffContent.propTypes = {
  user: P.object
}

export default RemoveStaffContent
