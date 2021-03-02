/* eslint-disable jsx-a11y/no-onchange */
import style from './Forms.module.css'
import P from 'prop-types'

function Component({
  onChange,
  label,
  type,
  classNames,
  placeholder,
  hint,
  options
}) {
  const _input = (
    <div className={`form-select ${classNames || ''}`}>
      <div className="main">
        <select
          type={type || 'text'}
          placeholder={placeholder || ''}
          className="input w-full"
          onChange={onChange}
        >
          {options.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {/* <div className="add-on">
          <i className={`ciergio-caret-down`} />
        </div> */}
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
