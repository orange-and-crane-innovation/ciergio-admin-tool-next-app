/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
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

const Component = () => {
  const { query } = useRouter()
  const [post, setPost] = useState()

  const { loading, data, error, refetch } = useQuery(GET_POST_QUERY, {
    variables: {
      where: {
        _id: query.id
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (error) {
      showToast('danger', `Sorry, there's an error occured on fetching.`)
    } else if (!loading && data) {
      const itemData = data?.getAllPost?.post[0]

      if (itemData) {
        setPost({
          category: itemData?.category?.name || '',
          title: itemData?.title || '',
          author:
            `${itemData?.author?.user?.firstName} ${itemData?.author?.user?.lastName}` ||
            '',
          date: DATE.displayDateCreated(itemData?.createdAt) || '',
          images:
            itemData?.primaryMedia.map(item => {
              return {
                original: item.url
              }
            }) || [],
          videos:
            (itemData?.embeddedMediaFiles &&
              itemData?.embeddedMediaFiles[0]?.url) ||
            null,
          content: itemData?.content
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
      <div className="flex justify-center font-body font-normal text-base leading-6">
        <div className="p-4 w-full lg:max-w-screen-md">
          <div className="font-heading mb-4">
            <div className="font-black text-neutral-500">
              {post.category.toUpperCase()}
            </div>
            <div className="font-black text-4xl leading-10">{post.title}</div>
          </div>
          <div className="mb-4">
            <ImageSlider images={post.images} />
          </div>
          <div className="mb-12">
            <strong>By {post.author}</strong> / {post.date}
          </div>
          {post.videos && (
            <div className="mb-6">
              <VideoPlayer url={post.videos} />
            </div>
          )}

          <div className="mb-6">{ReactHtmlParser(post.content)}</div>
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
