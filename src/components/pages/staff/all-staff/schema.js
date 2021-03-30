import * as yup from 'yup'

export const inviteStaffValidationSchema = yup.object().shape({
  staffType: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
  }),
  email: yup.string().email().required('This field is required'),
  jobTitle: yup.string().required('This field is required'),
  company: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
  }),
  complex: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
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
