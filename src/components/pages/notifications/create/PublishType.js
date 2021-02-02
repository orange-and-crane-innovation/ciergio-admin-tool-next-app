import P from 'prop-types'
import { friendlyDateTimeFormat } from '@app/utils/date'
import EditButton from './EditButton'

function PublishType({ publishType, publishDateTime, onShowPublishTypeModal }) {
  const PUBLISH_LATER = publishType === 'later'
  let publishTime = null

  if (publishDateTime) {
    publishTime = friendlyDateTimeFormat(
      publishDateTime,
      'MMM DD, YYYY - hh:mm A'
    )
  }

  return (
    <div className="flex">
      <span>Publish:</span>{' '}
      <div className="flex ml-5">
        <p className="font-bold mr-2">
          {PUBLISH_LATER ? ` Scheduled, ${publishTime}} ` : ' Immediately '}
        </p>
        <EditButton handleClick={onShowPublishTypeModal} />
      </div>
    </div>
  )
}

PublishType.propTypes = {
  publishType: P.string,
  publishDateTime: P.string,
  onShowPublishTypeModal: P.func
}

export default PublishType
