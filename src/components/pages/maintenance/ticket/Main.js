import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import { Card } from '@app/components/globals'
import { GoKebabHorizontal } from 'react-icons/go'
import { AiOutlineUserAdd } from 'react-icons/ai'
import Comments from '../Comments'

function Ticket() {
  return (
    <section className="content-wrap">
      <div className="w-full">
        <div className="flex flex-col w-8/12 justify-center items-end">
          <div className="flex justify-end items-center">
            <Button primary label="Ticket Resolved" />{' '}
            <Button icon={<GoKebabHorizontal />} className="ml-2" />
          </div>

          <div className="w-full">
            <Card
              content={
                <div className="w-full py-8">
                  <div className="px-4 border-b pb-4">
                    <div>
                      <Button label="New" warning />
                    </div>

                    <h2 className="font-bold text-2xl">
                      Need help installing my TV
                    </h2>
                    <div className="text-blue-500 w-1/3 flex justify-start mb-4">
                      <span className="mr-2">Jan 3, 2020</span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span className="mr-2">Other</span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span>Ticket #90918</span>
                    </div>
                    <p className="text-black mb-4">
                      I just bought a new TV but I have no idea how to mount it
                      on the wall. I also don’t have a drill, if that’s needed?
                      Any help would be greatly appreciated. Thank you!
                    </p>

                    <div>
                      <h3 className="text-base font-medium mb-2">
                        Attached File
                      </h3>
                      <div className="flex">
                        <img
                          className="w-16 rounded mr-2"
                          src="https://media.gettyimages.com/photos/city-downtown-pittsburgh-pa-picture-id1183558783?k=6&m=1183558783&s=612x612&w=0&h=azISgu46l6tHsgX7sqti9W4Lxf3ElWivbROX_cjktbw="
                          alt="attached-1"
                        />
                        <img
                          className="w-16 rounded"
                          src="https://media.gettyimages.com/photos/city-downtown-pittsburgh-pa-picture-id1183558783?k=6&m=1183558783&s=612x612&w=0&h=azISgu46l6tHsgX7sqti9W4Lxf3ElWivbROX_cjktbw="
                          alt="attached-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex p-4">
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Submitted By
                      </h4>
                      <div>
                        <p className="font-medium text-black">
                          Unit 2020, Tower 1
                        </p>
                        <p>
                          <span className="text-blue-400">Ashley Pancake</span>{' '}
                          (Unit Owner)
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Staff in this Photo
                      </h4>
                      <div className="w-full flex justify-start items-center">
                        <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
                          <AiOutlineUserAdd className="text-blue-500" />
                        </div>
                        <p className="font-bold text-base text-blue-500">
                          Add Staff
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <Tabs defaultTab="1">
              <Tabs.TabLabels>
                <Tabs.TabLabel id="1">Comment</Tabs.TabLabel>
                <Tabs.TabLabel id="2">History</Tabs.TabLabel>
              </Tabs.TabLabels>
              <Tabs.TabPanels>
                <Tabs.TabPanel id="1">
                  <Comments />
                </Tabs.TabPanel>
                <Tabs.TabPanel id="2">
                  <p>Ticket History</p>
                </Tabs.TabPanel>
              </Tabs.TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ticket
