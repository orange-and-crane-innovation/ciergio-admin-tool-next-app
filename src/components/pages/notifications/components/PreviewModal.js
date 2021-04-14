import P from 'prop-types'
import ReactHtmlParser from 'react-html-parser'

import Modal from '@app/components/modal'
import Button from '@app/components/button'

import { IMAGES } from '@app/constants'

function PreviewModal({ showPreview, onClose, loading, previewData }) {
  return (
    <Modal
      title="Preview Notification"
      cancelText="Close Preview"
      visible={showPreview}
      onClose={onClose}
      onCancel={onClose}
      okButtonProps={{
        style: { display: 'none' }
      }}
      width={500}
      loading={loading}
    >
      <div className="text-base leading-7">
        <div className="p-2">
          <p>
            <span className="font-bold">Note:</span>{' '}
            {`The actual appearance may
        vary based on a viewer's mobile device.`}
          </p>
        </div>
        <div className="-mx-4 -mb-4 px-16 py-8 bg-neutral-500">
          <div className="rounded bg-white">
            <img
              src={
                previewData?.primaryMedia?.length > 0
                  ? previewData?.primaryMedia[0]?.url
                  : IMAGES.DEFAULT_NOTIF_IMAGE
              }
              alt="preview"
              className="rounded-t w-full"
            />
            <div className="bg-white p-4">
              <div>
                <h4 className="font-bold text-base mb-2">
                  {previewData?.title !== ''
                    ? previewData?.title
                    : 'Preview Notification'}
                </h4>
                <p className="mb-1">
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
  onClose: P.func.isRequired,
  loading: P.bool,
  previewData: P.object
}

export default PreviewModal
