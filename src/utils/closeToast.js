import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'

const closeToast = () => {
  return toast.closeAll()
}

export default closeToast
