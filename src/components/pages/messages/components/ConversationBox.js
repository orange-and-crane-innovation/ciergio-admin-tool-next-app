import React from 'react'
import P from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

import Spinner from '@app/components/spinner'

import MessagePreviewItem from './MessagePreviewItem'

const ConversationBox = ({
  conversations,
  loading,
  selectedConvo,
  newMessage,
  currentUserId,
  currentAccountId,
  onFetchMore,
  onConvoSelect
}) => {
  return (
    <>
      {conversations?.count > 0 ? (
        <div
          className="scrollableContainer"
          id="scrollableConvo"
          style={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <InfiniteScroll
            dataLength={conversations?.data?.length || 0}
            next={onFetchMore}
            hasMore={conversations?.data?.length < conversations?.count}
            loader={<Spinner />}
            scrollableTarget="scrollableConvo"
          >
            {conversations.data.map(convo => (
              <MessagePreviewItem
                key={convo._id}
                onClick={onConvoSelect}
                data={convo}
                isSelected={
                  selectedConvo ? selectedConvo === convo._id : convo.selected
                }
                convoId={convo._id}
                currentUserid={currentUserId}
                currentAccountId={currentAccountId}
                newMessage={newMessage}
              />
            ))}
          </InfiniteScroll>
        </div>
      ) : loading ? (
        <Spinner />
      ) : conversations?.count === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p>No conversations found.</p>
        </div>
      ) : null}
    </>
  )
}

ConversationBox.propTypes = {
  conversations: P.object,
  loading: P.bool,
  selectedConvo: P.string,
  newMessage: P.array,
  currentUserId: P.string,
  currentAccountId: P.string,
  onFetchMore: P.func,
  onConvoSelect: P.func
}

export default ConversationBox
