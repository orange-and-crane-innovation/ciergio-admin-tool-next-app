import { useRouter } from 'next/router'
import Contacts from '@app/components/pages/contact-us/complex'
import Page from '@app/permissions/page'

function ContactList() {
  const router = useRouter()
  const { id } = router.query

  return <Page route="contact-us" page={<Contacts id={id} />} />
}

export default ContactList
