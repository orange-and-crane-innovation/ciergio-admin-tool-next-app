import clsx from 'clsx'
import P from 'prop-types'
import { useMemo } from 'react'
import { FaCircleNotch } from 'react-icons/fa'

import styles from './Button.module.css'

function Button({ type, label, fluid, primary, loading, ...props }) {
  const buttonClasses = useMemo(
    () =>
      clsx(styles.Button, {
        [styles.isPrimary]: primary,
        [styles.isFluid]: fluid
      }),
    [fluid, primary]
  )

  const renderLabel = useMemo(() => {
    return loading ? <FaCircleNotch className="icon-spin" /> : label
  }, [label, loading])

  return (
    <button type={type} className={buttonClasses} {...props}>
      {renderLabel}
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
  label: 'Button'
}

Button.propTypes = {
  type: P.oneOf(['button', 'submit']),
  label: P.string,
  fluid: P.bool,
  primary: P.bool,
  loading: P.bool
}

export default Button
