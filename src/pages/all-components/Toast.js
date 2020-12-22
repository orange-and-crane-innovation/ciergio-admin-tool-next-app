import Button from '@app/components/button'
import showToast from '@app/utils/toast'
import Highlight from '@app/pages/all-components/highlight'

const ToastPage = () => {
  return (
    <div className="flex">
      <div className="w-full p-8">
        <h1 className="text-xl font-semibold mb-4">Toast</h1>
        <Button
          success
          label="Show Success toast"
          onClick={() => showToast('success', 'Successfully Saved!')}
        />

        {`${' '}`}

        <Button
          danger
          label="Show Danger toast"
          onClick={() => showToast('danger', 'An error has occured!')}
        />

        <br />
        <br />

        <Button
          warning
          label="Show Warning toast"
          onClick={() =>
            showToast('warning', 'Warning, you are about to delete the file!')
          }
        />

        {`${' '}`}

        <Button
          info
          label="Show Info toast"
          onClick={() =>
            showToast('info', 'Our privacy policy has been updated!')
          }
        />

        <br />
        <br />

        <Highlight
          code={`
            // Import toast utils
            import showToast from '@app/utils/toast'

            // showToast(type, message)
            // type: success, danger, warning, info
            showToast('danger', 'An error has occured!')

            // Sample
            <Button
              primary
              label="Show Success toast"
              onClick={() => showToast('success', 'Successfully Updated!')}
            />
          `}
        />
      </div>
    </div>
  )
}

export default ToastPage
