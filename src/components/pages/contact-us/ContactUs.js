import { Tabs, Card } from '@app/components/globals'

function ContactUs() {
  return (
    <section className={`content-wrap`}>
      <h1 className="content-title mb-5">Contact Page</h1>
      <div className="toolbar">
        <Tabs
          tabs={[
            {
              label: 'Contact',
              value: 1
            }
          ]}
          activeTab={1}
          handleTab={() => {}}
        />
      </div>
      <Card
        title={`Companies`}
        content={
          <table className={`min-w-full`}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mary The Queen Parish</td>
              </tr>
              <tr>
                <td>Mary The Queen Parish</td>
              </tr>
              <tr>
                <td>Mary The Queen Parish</td>
              </tr>
            </tbody>
          </table>
        }
      />
    </section>
  )
}

export default ContactUs
