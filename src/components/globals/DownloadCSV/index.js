import P from 'prop-types'
import Button from '@app/components/button'
import { FiDownload } from 'react-icons/fi'
import { CSVLink } from 'react-csv'

function DownloadCSV({
  fileName,
  data,
  title,
  headers,
  label,
  variant,
  disabled,
  ...rest
}) {
  return (
    <>
      {!disabled ? (
        <CSVLink data={data} filename={`${fileName}.csv`} headers={headers}>
          <Button icon={<FiDownload />} variant {...rest} label={label} />
        </CSVLink>
      ) : (
        <Button
          disabled={disabled}
          icon={<FiDownload />}
          variant
          {...rest}
          label={label}
        />
      )}
    </>
  )
}

DownloadCSV.propTypes = {
  fileName: P.string.isRequired,
  data: P.array.isRequired,
  headers: P.array,
  title: P.string,
  label: P.string,
  disabled: P.bool,
  variant: P.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'link'])
}

export default DownloadCSV
