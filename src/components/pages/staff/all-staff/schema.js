import * as yup from 'yup'

export const inviteStaffValidationSchema = yup.object().shape({
  staffType: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string()
    })
    .required(),
  email: yup.string().email().required(),
  jobTitle: yup.string().required(),
  company: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string()
    })
    .required(),
  complex: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }),
  building: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  })
})

export const editStaffValidationSchema = yup.object().shape({
  staffFirstName: yup.string().required(),
  staffLastName: yup.string().required()
})
