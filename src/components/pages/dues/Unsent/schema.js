import * as yup from 'yup'

export default yup.object().shape({
  unitName: yup.string().required(),
  unitOwner: yup.object().shape({
    user: yup.object().shape({
      firstName: yup.string().required,
      lastName: yup.string().required
    })
  }),
  attachment: yup.object().shape({
    fileUrl: yup.string().required,
    fileType: yup.string().required
  }),
  amount: yup.number().required(),
  dueDate: yup.date().required
})
