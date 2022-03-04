const navigation = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: 'ciergio-home',
        title: 'Dashboard',
        items: []
      },
      {
        url: '/properties',
        icon: 'ciergio-building',
        title: 'My Properties',
        items: [
          {
            url: '/properties/company',
            title: 'My Company',
            items: []
          },
          {
            url: '/properties/complex',
            title: 'My Complex',
            items: []
          },
          {
            url: '/properties/building',
            title: 'My Building',
            items: []
          },
          {
            url: '/properties/manage/unit-types',
            title: 'Manage Unit Types',
            items: []
          },
          {
            url: '/properties/manage/categories',
            title: 'Manage Global Categories',
            items: []
          }
        ]
      },
      {
        url: '/property',
        icon: 'ciergio-building',
        title: 'My Property',
        items: [
          {
            url: '/property/company',
            title: 'My Company',
            items: []
          },
          {
            url: '/property/complex',
            title: 'My Complex',
            items: []
          },
          {
            url: '/property/building',
            title: 'My Building',
            items: []
          }
        ]
      },
      {
        url: '/staff',
        icon: 'ciergio-user-group',
        title: 'My Staff',
        items: [
          {
            url: '/staff/all-staff',
            title: 'All Staff',
            items: []
          },
          {
            url: '/staff/manage-roles',
            title: 'Manage Roles',
            items: []
          },
          {
            url: '/staff/pending-invites',
            title: 'Pending Staff Invites',
            items: []
          }
        ]
      },
      {
        url: '/residents',
        icon: 'ciergio-user',
        title: 'My Residents',
        items: [
          {
            url: '/residents/all-residents',
            title: 'All Residents',
            items: []
          },
          {
            url: '/residents/invites-requests',
            title: 'Invites & Requests',
            items: []
          }
        ]
      },
      {
        url: '/posts',
        icon: 'ciergio-list',
        title: 'Bulletin Board',
        items: [
          {
            url: '/posts',
            title: 'View All Posts',
            items: []
          },
          {
            url: '/posts/create',
            title: 'Create Bulletin',
            items: []
          }
        ]
      },
      {
        url: '/daily-readings',
        icon: 'ciergio-list',
        title: 'Daily Readings',
        items: [
          {
            url: '/daily-readings',
            title: 'View All Posts',
            items: []
          },
          {
            url: '/daily-readings/create',
            title: 'Create Daily Reading',
            items: []
          }
        ]
      },
      {
        url: '/attractions-events',
        icon: 'ciergio-list',
        title: 'Attractions and Events',
        items: [
          {
            url: '/attractions-events',
            title: 'View All Posts',
            items: []
          },
          {
            url: '/attractions-events/create',
            title: 'Create Bulletin',
            items: []
          }
        ]
      },
      {
        url: '/qr-code',
        icon: 'ciergio-qr',
        title: 'QR Code',
        items: [
          {
            url: '/qr-code',
            title: 'View All Posts',
            items: []
          },
          {
            url: '/qr-code/create',
            title: 'Create QR Code',
            items: []
          }
        ]
      },
      {
        url: '/maintenance',
        icon: 'ciergio-wrench',
        title: 'Maintenance & Repairs',
        items: []
      },
      {
        url: '/pastoral-works',
        icon: 'ciergio-list',
        title: 'Pastoral Works',
        items: [
          {
            url: '/pastoral-works',
            title: 'View All Posts',
            items: []
          },
          {
            url: '/pastoral-works/create',
            title: 'Create Pastoral Works',
            items: []
          }
        ]
      },
      {
        url: '/prayer-requests',
        icon: 'ciergio-prayer',
        title: 'Prayer Requests',
        items: []
      },
      {
        url: '/dues',
        icon: 'ciergio-bill',
        title: 'My Dues',
        items: [
          {
            url: '/dues/billing',
            title: 'Billing',
            items: []
          },
          {
            url: '/dues/overview',
            title: 'Overview',
            items: []
          },
          {
            url: '/dues/manage-categories',
            title: 'Manage Categories',
            items: []
          }
        ]
      },
      {
        url: '/offerings',
        icon: 'ciergio-donate-2',
        title: 'Offerings',
        items: []
      },
      {
        url: '/messages',
        icon: 'ciergio-mail',
        title: 'Messages',
        items: [],
        badge: 'unreadMsg'
      },
      {
        url: '/forms',
        icon: 'ciergio-file',
        title: 'Downloadable Forms',
        items: [
          {
            url: '/forms/create',
            title: 'Upload Form',
            items: []
          },
          {
            url: '/forms',
            title: 'View Forms',
            items: []
          }
        ]
      },
      {
        url: '/directory',
        icon: 'ciergio-store',
        title: 'Directory',
        items: []
      },
      {
        url: '/contact-us',
        icon: 'ciergio-email-at',
        title: 'Contact Us',
        items: []
      },
      {
        url: '/notifications',
        icon: 'ciergio-mail',
        title: 'Notifications',
        items: [
          {
            url: '/notifications/list',
            title: 'View All Notifications',
            items: []
          },
          {
            url: '/notifications/create',
            title: 'Create Notification',
            items: []
          }
        ]
      },
      {
        url: '/receptionist',
        icon: 'ciergio-list',
        title: 'Guest and Delivery',
        items: [
          {
            url: '/receptionist/visitors',
            title: 'Visitors',
            items: []
          },
          {
            url: '/receptionist/deliveries',
            title: 'Deliveries',
            items: []
          },
          {
            url: '/receptionist/pick-ups',
            title: 'Pick-Ups',
            items: []
          },
          {
            url: '/receptionist/services',
            title: 'Services',
            items: []
          }
        ]
      },
      {
        url: '/my-members',
        icon: 'ciergio-user',
        title: 'My Members',
        items: []
      }
    ]
  }
]

export default navigation
