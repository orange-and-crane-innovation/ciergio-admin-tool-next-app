import Props from 'prop-types'
import { useQuery } from '@apollo/client'
import { GET_ROLES } from './api/_query'
import Loading from '@app/components/page-loader'

const RoleName = ({ name, key }) => {
  return (
    <li className="font-bold mb-2" key={key} style={{ minHeight: '20px' }}>
      {name}
    </li>
  )
}

const RoleNames = () => {
  const { data, loading, error } = useQuery(GET_ROLES)

  if (loading) {
    return <Loading />
  }

  return (
    <ul className="mt-10">
      {!loading && !error
        ? data?.getRoles.map((role, idx) => (
            <RoleName key={idx} name={role.name} />
          ))
        : null}
    </ul>
  )
}
const RoleNameList = () => {
  return (
    <div style={{ marginTop: '150px' }}>
      <span className="font-bold text-neutral-500">Roles</span>
      <RoleNames />
    </div>
  )
}

RoleName.propTypes = {
  name: Props.oneOfType([Props.string, Props.node]),
  key: Props.string
}

export default RoleNameList
