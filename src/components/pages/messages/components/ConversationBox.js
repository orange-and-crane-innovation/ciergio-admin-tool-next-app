import InfiniteScroll from 'react-infinite-scroll-component'
import MessagePreviewItem from './MessagePreviewItem'
import P from 'prop-types'
import React from 'react'
import Spinner from '@app/components/spinner'

const ConversationBox = ({
  conversations,
  loading,
  selectedConvo,
  newMessage,
  currentUserId,
  currentAccountId,
  onFetchMore,
  onConvoSelect,
  selectedConvoType
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
            {conversations.data
              // .filter(convoItem => convoItem.type === selectedConvoType)
              .map(convo => (
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
                  selectedConvoType={selectedConvoType}
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
  selectedConvoType: P.string,
  selectedConvo: P.string,
  newMessage: P.object,
  currentUserId: P.string,
  currentAccountId: P.string,
  onFetchMore: P.func,
  onConvoSelect: P.func
}

export default ConversationBox
