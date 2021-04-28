import * as yup from 'yup'

export default yup.object().shape({
  unitId: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  type: yup.string().required(),
  email: yup.string().email().required()
})
