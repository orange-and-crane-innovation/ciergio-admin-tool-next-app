import ContactUs from '@app/components/pages/contact-us'
import Page from '@app/permissions/page'

function ContactUsPage() {
  return <Page route="/contact-us" page={<ContactUs />} />
}

export default ContactUsPage
