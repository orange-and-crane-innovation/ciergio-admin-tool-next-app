import { useRouter } from 'next/router'
import Contacts from '@app/components/pages/complex'

function ContactList() {
  const router = useRouter()
  const { contact } = router.query
  const name = contact.replaceAll('-', ' ')

  return <Contacts name={name} />
}

export default ContactList
