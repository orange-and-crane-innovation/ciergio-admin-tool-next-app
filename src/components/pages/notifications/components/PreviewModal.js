import P from 'prop-types'
import ReactHtmlParser from 'react-html-parser'

import Modal from '@app/components/modal'
import Button from '@app/components/button'

import { IMAGES } from '@app/constants'

import style from './Component.module.css'

function PreviewModal({
  showPreview,
  onOk,
  onClose,
  onOkMouseDown,
  loading,
  previewData,
  isCreate
}) {
  return (
    <Modal
      title="Preview Notification"
      cancelText={isCreate ? 'Continue Editing' : 'Cancel'}
      okText={isCreate ? 'Publish Now' : 'Okay'}
      visible={showPreview}
      onOk={isCreate ? onOk : onClose}
      onClose={onClose}
      onCancel={onClose}
      okButtonProps={{
        onMouseDown: onOkMouseDown
      }}
      width={500}
      loading={loading}
    >
      <div className={style.PreviewPageContainer}>
        <div className={style.PreviewPageText}>
          <span>Note: </span>
          {`The actual appearance may
        vary based on a viewer's mobile device.`}
        </div>

        <div className={style.PreviewPageContentContainer}>
          <div className={style.PreviewPageSubContentContainer}>
            <img
              src={
                previewData?.primaryMedia?.length > 0
                  ? previewData?.primaryMedia[0]?.url
                  : IMAGES.DEFAULT_NOTIF_IMAGE
              }
              alt="preview"
            />
            <div className={style.PreviewPageContent}>
              <div>
                <h4 className={style.PreviewPageContentTitle}>
                  {previewData?.title !== ''
                    ? previewData?.title
                    : 'Preview Notification'}
                </h4>
                <p className={style.PreviewPageContentMain}>
                  {previewData?.content
                    ? ReactHtmlParser(previewData?.content)
                    : 'Your content will show here.'}
                </p>
              </div>
              <div>
                <Button fluid primary label="Okay" />
                <Button fluid label="Read Later" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

PreviewModal.propTypes = {
  showPreview: P.bool.isRequired,
  onOk: P.func,
  onClose: P.func.isRequired,
  onOkMouseDown: P.func,
  loading: P.bool,
  previewData: P.object,
  isCreate: P.bool
}

export default PreviewModal
