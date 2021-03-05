import ManageCategories from '@app/components/pages/dues/Overview'
import Page from '@app/permissions/page'

export default function Categories() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  const complexName = user?.accounts?.data[0]?.complex?.name

  return (
    <Page
      route="/dues"
      page={
        <ManageCategories
          complexID={complexID}
          accountType="complex"
          complexName={complexName}
        />
      }
    />
  )
}
