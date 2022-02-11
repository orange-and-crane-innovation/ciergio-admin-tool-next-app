import Toggle from '@app/components/toggle'

const MyDuesExtraComponent = () => {
  return (
    <div className="flex flex-row justify-between">
      <p>
        By Enabling this, you are turning on this property's ability to collect
        payment through online methods for My Dues.
      </p>
      <Toggle />
    </div>
  )
}

export { MyDuesExtraComponent }
