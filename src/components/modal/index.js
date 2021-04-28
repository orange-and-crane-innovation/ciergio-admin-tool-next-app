import P from 'prop-types'
import Rodal from 'rodal'

import Button from '@app/components/button'

import 'rodal/lib/rodal.css'
import Spinner from '../spinner'

function Component({
  title,
  visible,
  onClose,
  okText,
  cancelText,
  onOk,
  onCancel,
  footer,
  children,
  okButtonProps,
  loading,
  modalProps,
  width
}) {
  const customStyles = {
    height: 'auto',
    bottom: 'auto',
    top: '5%',
    padding: 0,
    background: 'transparent'
  }

  return (
    <Rodal
      visible={visible}
      onClose={onClose}
      customStyles={customStyles}
      closeMaskOnClick={false}
      width={width}
      {...modalProps}
    >
      <div className="modal">
        {title ? (
          <div className="modal-header">
            <div className="modal-title">
              <span>{title}</span>
            </div>
          </div>
        ) : null}
        <div className="modal-content">{loading ? <Spinner /> : children}</div>
        {footer !== null ? (
          <div className="modal-footer">
            <Button
              default
              label={cancelText}
              onClick={onCancel}
              className="mr-4"
            />
            <Button primary label={okText} onClick={onOk} {...okButtonProps} />
          </div>
        ) : null}
      </div>
    </Rodal>
  )
}

Component.defaultProps = {
  cancelText: 'Cancel',
  okText: 'Ok',
  height: 'auto',
  loading: false,
  width: 450
}

Component.propTypes = {
  title: P.string,
  visible: P.bool.isRequired,
  onClose: P.func.isRequired,
  children: P.any,
  okText: P.string,
  cancelText: P.string,
  onOk: P.func,
  onCancel: P.func,
  footer: P.bool,
  okButtonProps: P.object,
  loading: P.bool,
  modalProps: P.object,
  width: P.number
}

export default Component
