import * as yup from 'yup'

export default yup.object().shape({
  unitId: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string()
    })
    .required("This field shouldn't be empty"),
  firstName: yup.string().required("This field shouldn't be empty"),
  lastName: yup.string().required("This field shouldn't be empty"),
  relationship: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string()
    })
    .required("This field shouldn't be empty"),
  email: yup.string().email('Please input a valid email')
})
