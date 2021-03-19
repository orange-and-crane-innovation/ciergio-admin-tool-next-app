import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import dayjs from '@app/utils/date'
import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import { Card } from '@app/components/globals'
import { GoKebabHorizontal } from 'react-icons/go'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { GET_ISSUE_DETAILS } from '../../queries'
import Comments from '../Comments'

function Ticket() {
  const router = useRouter()
  const { data: issue } = useQuery(GET_ISSUE_DETAILS, {
    variables: {
      id: router?.query?.ticket
    }
  })

  const ticket = issue?.getIssue?.issue
  const buttonLabel = useMemo(() => {
    const status = ticket?.status
    return status === 'unassigned'
      ? 'Unassigned'
      : status === 'ongoing'
      ? 'In Progress'
      : status === 'onhold'
      ? 'On Hold'
      : status === 'resolved'
      ? 'Resolved'
      : 'Cancelled'
  }, [ticket?.status])

  return (
    <section className="content-wrap">
      <div className="w-full">
        <div className="flex flex-col w-8/12 justify-center items-end">
          <div className="flex justify-end items-center">
            <Button label="Follow Ticket" />{' '}
            {ticket?.status === 'ongoing' ? (
              <Button primary label="Resolve Ticket" />
            ) : null}
            <Button icon={<GoKebabHorizontal />} className="ml-2" />
          </div>

          <div className="w-full">
            <Card
              content={
                <div className="w-full py-8">
                  <div className="px-4 border-b pb-4">
                    <div>
                      <Button
                        label={buttonLabel}
                        success={ticket?.status === 'ongoing'}
                        info={ticket?.status === 'unassigned'}
                        danger={ticket?.status === 'onhold'}
                        primary={ticket?.status === 'new'}
                        default={ticket?.status === 'resolved'}
                      />
                    </div>

                    <h2 className="font-bold text-2xl">
                      {ticket?.title || ''}
                    </h2>
                    <div className="w-1/3 flex justify-start mb-4">
                      <span className="mr-2">
                        {dayjs(ticket?.createdAt).format('MMM DD, YYYY')}
                      </span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span className="mr-2 text-blue-500">
                        {ticket?.category?.name}
                      </span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span className="text-blue-500">{`Ticket ${ticket?.code}`}</span>
                    </div>
                    <p className="text-black mb-4">{ticket?.content}</p>

                    <div>
                      <div className="flex">
                        {ticket?.mediaAttachments?.length > 0 ? (
                          <div>
                            <h3 className="text-base font-medium mb-2">
                              Attached File
                            </h3>
                            {ticket.mediaAttachments.map((media, index) => (
                              <img
                                key={media._id}
                                src={media.url}
                                alt={`${ticket?.title}-${index}`}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex p-4">
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        {`Submitted By`}
                      </h4>
                      <div>
                        <p className="font-medium text-black">
                          {`Unit ${ticket?.unit?.name}, ${ticket?.building?.name}`}
                        </p>
                        <p>
                          <span className="text-blue-400">
                            {`${ticket?.reporter?.user?.firstName} ${ticket?.reporter?.user?.lastName}`}
                          </span>{' '}
                          <span className="capitalize">{`(${ticket?.reporter?.accountType?.replace(
                            '_',
                            ' '
                          )})`}</span>
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Staff in this ticket
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
