import * as yup from 'yup'

export const createPaymentValidationSchema = yup.object().shape({
  amount: yup.string().required('This field is required'),
  firstName: yup.string().required('This field is required'),
  lastName: yup.string().required('This field is required'),
  email: yup.string().email().required('This field is required'),
  mobile: yup.string().required('This field is required')
})
