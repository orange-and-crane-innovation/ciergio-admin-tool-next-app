import showToast from '@app/utils/toast'

const errorHandler = data => {
  const errors = JSON.parse(JSON.stringify(data))

  if (errors) {
    const { graphQLErrors, networkError, message } = errors
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        showToast('danger', message)
      )

    if (networkError?.result?.errors) {
      showToast('danger', errors?.networkError?.result?.errors[0]?.message)
    }

    if (
      message &&
      graphQLErrors?.length === 0 &&
      !networkError?.result?.errors
    ) {
      showToast('danger', message)
    }
  }
}

export default errorHandler
