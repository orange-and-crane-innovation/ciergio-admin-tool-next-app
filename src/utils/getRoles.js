import { Context } from '@app/lib/global/RolesAndPermissionsContext/store'
import { useContext } from 'react'

const useRoles = () => {
  const [permissions] = useContext(Context)
  return permissions
}

export { useRoles }
