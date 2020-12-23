import React from 'react'
import P from 'prop-types'
import { Draggable } from '@app/components/globals'

function DummyDirectoryTable() {
  return (
    <div className="table-container">
      <div className="table-container__outer ">
        <div className="table-container__inner ">
          <div className="table-container__inner-two">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Building</th>
                  <th scope="col">Address</th>
                  <th scope="col" className="action">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2F-yGMDRD8x85s%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2FDIbYZ8BUZGM%2Fs900-c-k-no-mo-rj-c0xffffff%2Fphoto.jpg&f=1&nofb=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className=" text-sm font-medium text-gray-900">
                          Red Cross
                        </div>
                        <div className="text-sm text-gray-500">451-1235</div>
                      </div>
                    </div>
                  </td>
                  <td>Emergency</td>
                  <td>Lemon Residences</td>
                  <td>96 Novella Knolls</td>
                  <td className="text-right text-sm font-medium">...</td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2F-yGMDRD8x85s%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2FDIbYZ8BUZGM%2Fs900-c-k-no-mo-rj-c0xffffff%2Fphoto.jpg&f=1&nofb=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className=" text-sm font-medium text-gray-900">
                          Red Cross
                        </div>
                        <div className="text-sm text-gray-500">451-1235</div>
                      </div>
                    </div>
                  </td>
                  <td>Emergency</td>
                  <td>Lemon Residences</td>
                  <td>96 Novella Knolls</td>
                  <td className="text-right text-sm font-medium">...</td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2F-yGMDRD8x85s%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2FDIbYZ8BUZGM%2Fs900-c-k-no-mo-rj-c0xffffff%2Fphoto.jpg&f=1&nofb=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className=" text-sm font-medium text-gray-900">
                          Red Cross
                        </div>
                        <div className="text-sm text-gray-500">451-1235</div>
                      </div>
                    </div>
                  </td>
                  <td>Emergency</td>
                  <td>Lemon Residences</td>
                  <td>96 Novella Knolls</td>
                  <td className="text-right text-sm font-medium">...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const directoryList = [
  {
    id: 0,
    name: 'Red Cross'
  },
  {
    id: 1,
    name: 'PHRC Headquarters'
  },
  {
    id: 2,
    name: 'McDonalds'
  },
  {
    id: 3,
    name: 'Suds Laundry Services'
  }
]

function DummyManageDirectoryList() {
  const [list, setList] = React.useState(directoryList)

  return <Draggable list={list} onListChange={setList} />
}

function ActiveTable({ active }) {
  return active === 1 ? <DummyDirectoryTable /> : <DummyManageDirectoryList />
}

ActiveTable.propTypes = {
  active: P.number
}

export default ActiveTable
