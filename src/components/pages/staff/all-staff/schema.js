import * as yup from 'yup'

export const inviteStaffValidationSchema = yup.object().shape({
  staffType: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
  }),
  email: yup.string().email().required('This field is required'),
  /* jobTitle: yup.string().nullable().required('This field is required'), */
  company: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
  })
  /*  complex: yup.string().nullable().required('This field is required'),
  building: yup.string().nullable().required('This field is required') */
})

export const editStaffValidationSchema = yup.object().shape({
  staffFirstName: yup.string().required('This field is required'),
  staffLastName: yup.string().required('This field is required')
})
