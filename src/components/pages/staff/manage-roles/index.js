import RolesTable from './RolesTable'
import RoleNameList from './RoleNameList'
import CreateRole from './CreateRole'

import { useQuery } from '@apollo/client'
import { GET_COMPANY_ROLES } from './api/_query'
import PageLoader from '@app/components/page-loader'
import errorHandler from '@app/utils/errorHandler'

const ManageRolesComponent = () => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const companyID = user?.accounts?.data[0]?.company?._id

  const { loading, data, error, refetch } = useQuery(GET_COMPANY_ROLES, {
    variables: {
      where: {
        companyId: companyID
      }
    }
  })

  if (error) {
    errorHandler(error)
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">Manage Roles</h1>
      <div className="mt-11">
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <div className="flex justify-end">
              <CreateRole companyID={companyID} refetch={refetch} />
            </div>
            <div className="flex flex-row gap-5">
              <RoleNameList refetch={refetch} data={data} loading={loading} />
              <RolesTable data={data} loading={loading} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ManageRolesComponent
