import P from 'prop-types'
import Modal from '@app/components/modal'
import Button from '@app/components/button'

function PreviewModal({ showPreview, onClose, loading, previewData }) {
  return (
    <Modal
      title="Preview Notification"
      cancelText="Close Preview"
      visible={showPreview}
      onClose={onClose}
      okButtonProps={{
        className: 'hidden'
      }}
      footer={null}
      width={500}
      loading={loading}
    >
      <div>
        <div className="p-2">
          <p className="text-sm">
            <span className="font-bold">Note:</span>{' '}
            {`The actual appearance may
        vary based on a viewer's mobile device.`}
          </p>
        </div>
        <div className="px-16 py-8 bg-gray-500">
          <div className="rounded">
            <img
              src={previewData?.primaryMedia[0]?.url}
              alt="preview"
              className="rounded-t max-w-sm"
            />
            <div className="bg-white p-4">
              <div>
                <h4 className="font-bold text-base mb-2">
                  {previewData?.title}
                </h4>
                <p className="text-sm mb-1">{previewData?.content}</p>
              </div>
              <div>
                <button className="bg-blue-400 text-white px-4 py-2 border w-full rounded mb-1">
                  Okay
                </button>
                <button className="text-blue-400 px-4 py-2 border w-full rounded">
                  Read Later
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y" />
        <div className="pt-4 pl-4">
          <Button
            label="Close Preview"
            className="text-gray-400"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}

PreviewModal.propTypes = {
  showPreview: P.bool.isRequired,
  onClose: P.func.isRequired,
  loading: P.bool,
  previewData: P.object.isRequired
}

export default PreviewModal
