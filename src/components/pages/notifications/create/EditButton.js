import P from 'prop-types'

function EditButton({ handleClick }) {
  return (
    <span
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      className="text-blue-700"
    >
      Edit
    </span>
  )
}

EditButton.propTypes = {
  handleClick: P.func
}

export default EditButton
