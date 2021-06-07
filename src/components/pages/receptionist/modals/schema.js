import * as yup from 'yup'

export default yup.object().shape({
  unit_number: yup.string().label('Unit No.').required(),
  host: yup.string().label("Resident's Name").required(),
  date_of_visit: yup.date().label('Date of Visit'),
  time_of_visit: yup.date().label('Time of Visit'),
  first_name: yup.string().label('First Name').required(),
  last_name: yup.string().label('Last Name').required(),
  company: yup.string().label('Company (Optionial)'),
  note: yup.string().label('Note (Optional)')
})
