import style from './Forms.module.css'
import P from 'prop-types'

function Component({
  onChange,
  onKeyPress,
  onKeyUp,
  label,
  type,
  classNames,
  placeholder,
  hint,
  rightIcon,
  leftIcon
}) {
  const _input = (
    <div className={`form-input ${classNames || ''}`}>
      {leftIcon && (
        <div className="add-on">
          <i className={`${leftIcon}`} />
        </div>
      )}
      <div className="main">
        <input
          type={type || 'text'}
          className="input"
          placeholder={placeholder || ``}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
        />
      </div>
      {rightIcon && (
        <div className="add-on">
          <i className={`${rightIcon}`} />
        </div>
      )}
    </div>
  )

  if (label)
    return (
      <label className={style.Label}>
        <span className="form-label">{label}</span>
        <br />
        {hint && <small className="w-full">{hint}</small>}
        {_input}
      </label>
    )
  else return _input
}

Component.propTypes = {
  onChange: P.func,
  onKeyPress: P.func,
  onKeyUp: P.func,
  label: P.string,
  type: P.string,
  classNames: P.string,
  placeholder: P.string,
  hint: P.string,
  rightIcon: P.string,
  leftIcon: P.string
}

export default Component
