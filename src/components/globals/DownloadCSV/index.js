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
  ...rest
}) {
  return (
    <>
      <CSVLink data={data} filename={`${fileName}.csv`} headers={headers}>
        <Button icon={<FiDownload />} variant {...rest} label={label} />
      </CSVLink>
    </>
  )
}

DownloadCSV.propTypes = {
  fileName: P.string.isRequired,
  data: P.array.isRequired,
  headers: P.array,
  title: P.string,
  label: P.string,
  variant: P.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'link'])
}

export default DownloadCSV
