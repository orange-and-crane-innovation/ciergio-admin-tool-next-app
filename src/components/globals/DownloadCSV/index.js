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
  noBottomMargin = true,
  ...rest
}) {
  return (
    <>
      {!disabled ? (
        <CSVLink data={data} filename={`${fileName}.csv`} headers={headers}>
          <Button
            icon={<FiDownload />}
            variant
            {...rest}
            label={label}
            noBottomMargin={noBottomMargin}
          />
        </CSVLink>
      ) : (
        <Button
          disabled={true}
          icon={<FiDownload />}
          variant
          {...rest}
          label={label}
          noBottomMargin={noBottomMargin}
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
  noBottomMargin: P.bool,
  variant: P.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'link'])
}

export default DownloadCSV
