import Overview from '@app/components/pages/dues/Overview'

import Page from '@app/permissions/page'

export default function OverviewPage() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  const complexName = user?.accounts?.data[0]?.complex?.name

  return (
    <Page
      route="/dues"
      page={
        <Overview
          complexID={complexID}
          accountType="complex"
          complexName={complexName}
        />
      }
    />
  )
}
