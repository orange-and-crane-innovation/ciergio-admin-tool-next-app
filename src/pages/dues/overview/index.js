import Overview from '@app/components/pages/dues/Overview'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function OverviewPage() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  const complexName = user?.accounts?.data[0]?.complex?.name

  return (
    <RolesPermissions roleName="dues" permission="myDues">
      <Overview
        complexID={complexID}
        accountType="complex"
        complexName={complexName}
      />
    </RolesPermissions>
  )
}
