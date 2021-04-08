import P from 'prop-types'

function EditButton({ onClick }) {
  return (
    <span
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      className="text-blue-700 block ml-2"
    >
      Edit
    </span>
  )
}

EditButton.propTypes = {
  onClick: P.func
}

export default EditButton
