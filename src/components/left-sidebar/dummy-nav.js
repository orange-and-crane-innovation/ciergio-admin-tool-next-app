import React from 'react'
import { FiActivity, FiCompass } from 'react-icons/fi'

const navigation = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: <FiCompass size={20} />,
        title: 'Dashboard',
        items: []
      },
      {
        url: '/',
        icon: <FiActivity size={20} />,
        title: 'Group Menu 1',
        items: [
          {
            url: '/link-1',
            title: 'Link 1',
            items: []
          },
          {
            url: '/link-2',
            title: 'Link 2',
            items: []
          },
          {
            url: '/link-3',
            title: 'Link 3',
            items: []
          },
          {
            url: '/link-4',
            title: 'Link 4',
            items: []
          },
          {
            url: '/link-5',
            title: 'Link 5',
            items: []
          }
        ]
      },
      {
        url: '/',
        icon: <FiActivity size={20} />,
        title: 'Group Menu 2',
        items: [
          {
            url: '/link-2-1',
            title: 'Link 1',
            items: []
          },
          {
            url: '/link-2-2',
            title: 'Link 2',
            items: []
          },
          {
            url: '/link-2-3',
            title: 'Link 3',
            items: []
          },
          {
            url: '/link-2-4',
            title: 'Link 4',
            items: []
          },
          {
            url: '/link-2-5',
            title: 'Link 5',
            items: []
          }
        ]
      }
    ]
  }
]

export default navigation
