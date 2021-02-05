import * as yup from 'yup'

export default yup.object().shape({
  file_url: yup.string().required(),
  amount: yup.number().required(),
  due_date: yup.date().required()
})
