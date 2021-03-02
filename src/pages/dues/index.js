import Overview from '@app/components/pages/dues/Overview'

export default function OverviewPage() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  const complexName = user?.accounts?.data[0]?.complex?.name

  return (
    <>
      {complexID && complexName && (
        <Overview
          complexID={complexID}
          accountType="complex"
          complexName={complexName}
        />
      )}
    </>
  )
}
