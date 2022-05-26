import isEmpty from 'lodash/isEmpty'
import Props from 'prop-types'

import { useQuery } from '@apollo/client'
import PageLoader from '@app/components/page-loader'
import errorHandler from '@app/utils/errorHandler'

import CreateRole from './CreateRole'
import RoleNameList from './RoleNameList'
import RolesTable from './RolesTable'
import { GET_COMPANY_ROLES } from './api/_query'

const ManageRolesComponent = ({ companySettings }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const companyID = user?.accounts?.data[0]?.company?._id

  const { loading, data, error, refetch } = useQuery(GET_COMPANY_ROLES, {
    variables: {
      where: {
        companyId: companyID,
        status: 'active'
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
              {!isEmpty(data?.getCompanyRoles) ? (
                <>
                  <RoleNameList
                    refetch={refetch}
                    data={data}
                    loading={loading}
                  />
                  <RolesTable
                    data={data}
                    loading={loading}
                    modules={companySettings}
                  />
                </>
              ) : (
                <div className="w-full mt-4 text-center">
                  <b>No Roles and Permissions</b>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

ManageRolesComponent.propTypes = {
  companySettings: Props.object
}

export default ManageRolesComponent
