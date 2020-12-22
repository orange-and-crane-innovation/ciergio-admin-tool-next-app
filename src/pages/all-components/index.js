import FormsComponents from './Forms'
import CardsComponents from './Cards'
import PaginationComponents from './Pagination'
import ToastComponents from './Toast'

function ComponentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-5">Form Components</h1>
      <FormsComponents />

      <hr className="py-6" />
      <h1 className="text-2xl font-semibold mb-5">Card Component</h1>
      <CardsComponents />

      <hr className="py-6" />
      <h1 className="text-2xl font-semibold mb-5">Pagination Component</h1>
      <PaginationComponents />

      <hr className="py-6" />
      <h1 className="text-2xl font-semibold mb-5">Toast Component</h1>
      <ToastComponents />
    </div>
  )
}

export default ComponentsPage
