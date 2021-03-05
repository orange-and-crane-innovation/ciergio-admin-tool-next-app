import axios from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_UPLOAD_API
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'

export default axios
