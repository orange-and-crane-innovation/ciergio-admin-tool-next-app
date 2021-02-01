import { forwardRef } from 'react'

const CustomDateInput = ({ onClick, value, onChange }, dateRef) => {
  return (
    <input onClick={onClick} value={value} onChange={onChange} ref={dateRef} />
  )
}

export default forwardRef(CustomDateInput)
