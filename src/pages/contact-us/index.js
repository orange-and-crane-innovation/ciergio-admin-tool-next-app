import Companies from './companies/[id]'
import ContactUs from '@app/components/pages/contact-us'
import Contacts from './complex/[id]'
import { RolesPermissions } from '@app/components/rolespermissions'

function ContactUsPage() {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  if (accountType === 'administrator') {
    return (
      <RolesPermissions roleName="contactPage" permission="contactPage">
        <ContactUs />
      </RolesPermissions>
    )
  }
  if (accountType === 'complex_admin') {
    return (
      <RolesPermissions roleName="contactPage" permission="contactPage">
        <Contacts />
      </RolesPermissions>
    )
  }
  if (accountType === 'company_admin') {
    return (
      <RolesPermissions roleName="contactPage" permission="contactPage">
        <Companies />
      </RolesPermissions>
    )
  }
}

export default ContactUsPage
