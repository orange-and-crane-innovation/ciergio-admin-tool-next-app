import RolesTable from './RolesTable'
import RoleNameList from './RoleNameList'

const ManageRolesComponent = () => {
  return (
    <section className="content-wrap">
      <h1 className="content-title">Manage Roles</h1>
      <div className="mt-11">
        <div className="flex flex-row gap-5">
          <RoleNameList />
          <RolesTable />
        </div>
      </div>
    </section>
  )
}

export default ManageRolesComponent
