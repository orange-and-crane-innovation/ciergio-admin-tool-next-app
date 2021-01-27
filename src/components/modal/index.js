import P from 'prop-types'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition, animated } from 'react-spring'

import Button from '@app/components/button'

import '@reach/dialog/styles.css'
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
  width,
  loading
}) {
  const AnimatedDialogOverlay = animated(DialogOverlay)
  const AnimatedDialogContent = animated(DialogContent)
  const transitions = useTransition(visible, null, {
    from: { opacity: 1, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 }
  })

  return (
    <>
      {transitions.map(
        ({ item, key, props: styles }) =>
          item && (
            <AnimatedDialogOverlay
              key={key}
              style={{ zIndex: 100, opacity: 1, ...styles }}
            >
              <AnimatedDialogContent
                aria-label="modal"
                style={{
                  transform: styles.y.interpolate(
                    value => `translate3d(0px, ${value}px, 0px)`
                  )
                }}
              >
                <div
                  className="modal"
                  style={{
                    width
                  }}
                >
                  {title ? (
                    <div className="modal-header">
                      <div className="modal-title">
                        <span>{title}</span>
                      </div>
                      <div className="modal-close-icon">
                        <span
                          className="ciergio-close absolute p-4 hover:cursor-pointer relative top-0"
                          onClick={onClose}
                          onKeyDown={onClose}
                          role="button"
                          tabIndex={0}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="modal-content">
                    {loading ? <Spinner /> : children}
                  </div>
                  {footer !== null ? (
                    <div className="modal-footer">
                      <Button
                        default
                        label={cancelText}
                        onClick={onCancel}
                        className="mr-4 w-full"
                      />
                      <Button
                        primary
                        label={okText}
                        onClick={onOk}
                        className=" w-full"
                        {...okButtonProps}
                      />
                    </div>
                  ) : null}
                </div>
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          )
      )}
    </>
  )
}

Component.defaultProps = {
  cancelText: 'Cancel',
  okText: 'Ok',
  loading: false
}

Component.propTypes = {
  title: P.string,
  visible: P.bool.isRequired,
  onClose: P.func,
  children: P.any.isRequired,
  okText: P.string,
  cancelText: P.string,
  onOk: P.func,
  onCancel: P.func,
  footer: P.bool,
  okButtonProps: P.object,
  width: P.number || P.string,
  loading: P.bool
}

export default Component
