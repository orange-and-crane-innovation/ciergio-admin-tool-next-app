import { useRouter } from 'next/router'
import Contacts from '@app/components/pages/directory/complex'

function ContactList() {
  const router = useRouter()
  const { contact } = router.query

  return <Contacts name={contact} />
}

export default ContactList
