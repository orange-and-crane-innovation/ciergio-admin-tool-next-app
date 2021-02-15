import * as yup from 'yup'

export default yup.object().shape({
  attachment: yup
    .object()
    .shape({
      fileUrl: yup.string().required(),
      fileType: yup.string().required()
    })
    .required(),
  amount: yup.number().required(),
  due_date: yup.date().required()
})
