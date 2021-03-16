import * as yup from 'yup'

export const createAttractionsCategoryValidation = yup.object().shape({
  name: yup.string().required(),
  company: yup.string().required()
})
