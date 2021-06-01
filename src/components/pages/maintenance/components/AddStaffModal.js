import P from 'prop-types'
import Modal from '@app/components/modal'
import FormSelect from '@app/components/forms/form-select'

function AddStaffModal({
  open,
  onOk,
  onCancel,
  loading,
  onSelectStaff,
  selectedStaff,
  options
}) {
  return (
    <Modal
      title="Add staff to this ticket"
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
      okText="Confirm"
      okButtonProps={{
        loading
      }}
    >
      <div>
        <FormSelect
          label="Staff Name"
          name={name}
          placeholder="Choose staff name"
          valueholder="Staffs"
          options={options || []}
          value={selectedStaff}
          onChange={onSelectStaff}
          onClear={() => onSelectStaff(null)}
          isMulti
          isClearable
        />
      </div>
    </Modal>
  )
}

AddStaffModal.propTypes = {
  open: P.bool.isRequired,
  onOk: P.func.isRequired,
  onCancel: P.func.isRequired,
  loading: P.bool,
  onSelectStaff: P.func,
  selectedStaff: P.array,
  options: P.array.isRequired
}

export default AddStaffModal
