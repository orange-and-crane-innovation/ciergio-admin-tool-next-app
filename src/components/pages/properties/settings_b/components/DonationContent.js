import Toggle from '@app/components/toggle'
import Input from '@app/components/forms/form-input'
import Props from 'prop-types'

const DonationsContent = ({ inputProps }) => {
  return (
    <div className="flex flex-col">
      <b>Online Payment</b>
      <div className="flex flex-row justify-between">
        <p>
          By Enabling this, you are turning on this property's ability to
          collect payment through online methods for Donations.
        </p>
        <Toggle />
      </div>
      <div className="w-1/4 mt-5">
        <Input label="Active Donations Limit" {...inputProps} />
      </div>
    </div>
  )
}

DonationsContent.propTypes = {
  inputProps: Props.object
}

export { DonationsContent }
