import P from 'prop-types'

function Component({ primary, full, label, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`btn ${primary && 'btn-primary'} ${full && 'btn-fluid'}`}
    >
      <span>{label || 'Submit'}</span>
    </button>
  )
}
Component.propTypes = {
  onClick: P.func,
  full: P.bool,
  primary: P.bool,
  label: P.string
}

export default Component
