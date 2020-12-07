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
  hint
}) {
  return (
    <label className={style.Label}>
      {label && <span className="form-label">{label}</span>}<br/>
      {hint && <small className="w-full">{hint}</small>}
      <input
        type={type || 'text'}
        className={`form-input ${classNames || ''}`}
        placeholder={placeholder || ``}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
      />
    </label>
  )
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
