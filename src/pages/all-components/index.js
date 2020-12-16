import FormsComponents from './Forms'
import CardsComponents from './Cards'

function ComponentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Form Components</h1>
      <FormsComponents />
      <hr className="py-6"/>
      <h1 className="text-2xl font-semibold mb-5">Card Component</h1>
      <CardsComponents />
    </div>
  )
}

export default ComponentsPage
