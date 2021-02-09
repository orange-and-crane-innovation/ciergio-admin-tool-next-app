import P from 'prop-types'
import { friendlyDateTimeFormat } from '@app/utils/date'

export default function PrintData({ data }) {
  if (data?.length > 0) {
    return data.map(
      ({ _id, createdAt, category, reporter, prayer, content }, index) => {
        return (
          <tr key={_id}>
            <td>{index + 1}</td>
            <td className="text-center min-w-100">
              {createdAt
                ? friendlyDateTimeFormat(createdAt, 'MMM DD, YYYY')
                : null}
            </td>
            <td className="min-w-150">{category?.name || null}</td>
            <td className="min-w-150">
              {reporter?.user?.lastName
                ? `${reporter.user.firstName} ${reporter.user.lastName}`
                : null}
            </td>
            <td className="min-w-150">{prayer?.for || null}</td>
            <td className="min-w-150">{prayer?.from || null}</td>
            <td className="text-center min-w-100">
              {prayer.date
                ? friendlyDateTimeFormat(prayer.date, 'MMM DD, YYYY')
                : '---'}
            </td>
            <td className="min-w-200">{content || '---'}</td>
          </tr>
        )
      }
    )
  }

  return (
    <tr>
      <td colSpan={5}>No Data</td>
    </tr>
  )
}

PrintData.propTypes = {
  data: P.array.isRequired
}
