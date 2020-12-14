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
  rightIcon
}) {
  const _input = (
    <div className={`form-input w-full inline-flex ${classNames || ''}`}>
      <div className="main inline-block">
        <input
          type={type || 'text'}
          className="inline-block p-3"
          placeholder={placeholder || ``}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
        />
      </div>
      {rightIcon && <div className="add-on inline-block">{rightIcon}</div>}
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
  hint: P.string
}

export default Component
