/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useLazyQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser'

import { FiFileText, FiXCircle } from 'react-icons/fi'

import PageLoader from '@app/components/page-loader'
import ImageSlider from '@app/components/globals/ImageSlider'
import VideoPlayer from '@app/components/globals/VideoPlayer'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'

import NotifCard from '../components/NotifCard'

import styles from './index.module.css'

const GET_POST_QUERY = gql`
  query getAllPost($where: AllPostInput) {
    getAllPost(where: $where) {
      count
      limit
      offset
      post {
        _id
        title
        content
        status
        createdAt
        updatedAt
        publishedAt
        author {
          user {
            firstName
            lastName
          }
        }
        category {
          name
        }
        primaryMedia {
          url
          type
        }
        embeddedMediaFiles {
          url
          type
        }
      }
    }
  }
`

const GET_POST_DAILY_READINGS_QUERY = gql`
  query getAllPost($where: AllPostInput) {
    getAllPost(where: $where) {
      count
      limit
      offset
      post {
        _id
        title
        content
        status
        createdAt
        updatedAt
        publishedAt
        author {
          user {
            firstName
            lastName
          }
        }
        category {
          name
        }
        primaryMedia {
          url
          type
        }
        embeddedMediaFiles {
          url
          type
        }
        dailyReadingDate
      }
    }
  }
`

export const GET_PUBLIC_POST_QUERY = gql`
  query getPostFromEmail($postID: String, $accountID: String) {
    getPostFromEmail(where: { _id: $postID, requesterAccountId: $accountID }) {
      content
      title
      createdAt
      primaryMedia {
        url
      }
      embeddedMediaFiles {
        url
        platform
      }
      category {
        name
      }
      author {
        user {
          firstName
          lastName
        }
      }
    }
  }
`

const Component = () => {
  const { query, pathname } = useRouter()
  const [post, setPost] = useState()
  const isDailyReadingsPage = pathname === '/daily-readings/view/[id]'
  const isPublicPostsPage = pathname === '/public-posts/view/[id]/[aid]'

  const [fetchPost, { loading, data, error }] = useLazyQuery(
    isDailyReadingsPage
      ? GET_POST_DAILY_READINGS_QUERY
      : isPublicPostsPage
      ? GET_PUBLIC_POST_QUERY
      : GET_POST_QUERY
  )

  useEffect(() => {
    let fetchData

    if (isPublicPostsPage) {
      fetchData = {
        postID: query.id,
        accountID: query.aid
      }
    } else {
      fetchData = {
        where: {
          _id: query.id
        }
      }
    }
    fetchPost({ variables: fetchData })
  }, [query.id, query.aid])

  useEffect(() => {
    if (error) {
      showToast('danger', `Sorry, there's an error occured on fetching.`)
    } else if (!loading && data) {
      const itemData = data?.getAllPost?.post[0] || data?.getPostFromEmail

      if (itemData) {
        setPost({
          category: itemData?.category?.name ?? '',
          title: itemData?.title ?? '',
          author:
            `${itemData?.author?.user?.firstName} ${itemData?.author?.user?.lastName}` ||
            '',
          date: DATE.displayDateCreated(itemData?.createdAt) ?? '',
          images:
            itemData?.primaryMedia?.map(item => {
              return {
                original: item.url
              }
            }) || [],
          videos:
            (itemData?.embeddedMediaFiles &&
              itemData?.embeddedMediaFiles[0]?.url) ||
            null,
          content: itemData?.content,
          dailyReadingDate: itemData?.dailyReadingDate ?? null
        })
      }
    }
  }, [loading, data, error])

  if (loading) {
    return <PageLoader />
  } else if (error) {
    return (
      <NotifCard
        icon={<FiXCircle />}
        header="Error"
        content="Sorry, there's an error occured on fetching."
      />
    )
  } else if (!loading && post) {
    return (
      <div className={styles.PageContainer}>
        <div className={styles.PageSubContainer}>
          <div className={styles.PageHeader}>
            <div className={styles.HeaderCategory}>
              {isDailyReadingsPage ? '' : post.category.toUpperCase()}
            </div>
            <div className={styles.HeaderTitle}>
              {isDailyReadingsPage ? '' : post.title}
            </div>
          </div>
          {post?.images && (
            <div className="mb-4">
              <ImageSlider images={post?.images} />
            </div>
          )}

          {!isDailyReadingsPage && (
            <div className="mb-12">
              <strong>By {post.author}</strong> / {post.date}
            </div>
          )}

          {isDailyReadingsPage && (
            <center>
              <div className="my-6 text-3xl leading-10">
                <strong>
                  {DATE.toFriendlyShortDate(post.dailyReadingDate)}
                </strong>
              </div>
            </center>
          )}

          {post.videos && !isDailyReadingsPage && (
            <div className="mb-6">
              <VideoPlayer url={post.videos} />
            </div>
          )}

          {isDailyReadingsPage && (
            <div className="mb-2">
              <strong>{post.title}</strong>
            </div>
          )}

          {post.videos && isDailyReadingsPage && (
            <div className="mb-6">
              <VideoPlayer url={post.videos} />
            </div>
          )}

          <div className={styles.PageContent}>
            {ReactHtmlParser(post.content)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <NotifCard
      icon={<FiFileText />}
      header="Post not found"
      content="Sorry, this post doesn't exists."
    />
  )
}

Component.propTypes = {
  icon: PropTypes.any,
  header: PropTypes.any,
  content: PropTypes.any
}

export default Component
