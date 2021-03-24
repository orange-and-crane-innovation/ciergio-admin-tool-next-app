import * as yup from 'yup'

export default yup.object().shape({
  unit_number: yup.string().label('Unit #').required,
  first_name: yup.string().label('First Name').required(),
  last_name: yup.string().label('Last Name').required(),
  resident_type: yup.string().label('Resident Type').required,
  resident_email: yup.string().email().label('Resident Email')
})
