import { useRouter } from 'next/router'
import Contacts from '@app/components/pages/contact-us/complex'

function ContactList() {
  const router = useRouter()
  const { id } = router.query

  return <Contacts id={id} />
}

export default ContactList
