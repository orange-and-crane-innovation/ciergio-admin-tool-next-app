import P from 'prop-types'

function Component({ primary, full, label, onClick, rightIcon, leftIcon }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`btn inline-flex ${primary ? 'btn-primary' : ''} ${
        full ? 'btn-fluid' : ''
      }`}
    >
      {leftIcon && (
        <div className="add-on inline-block mr-2">
          <i className={`${leftIcon} text-xl`} />
        </div>
      )}
      <div className="main inline-block">
        <span>{label || 'Submit'}</span>
      </div>
      {rightIcon && (
        <div className="add-on inline-block ml-2">
          <i className={`${rightIcon} text-xl`} />
        </div>
      )}
    </button>
  )
}
Component.propTypes = {
  onClick: P.func,
  full: P.bool,
  primary: P.bool,
  label: P.string,
  rightIcon: P.string,
  leftIcon: P.string
}

export default Component
