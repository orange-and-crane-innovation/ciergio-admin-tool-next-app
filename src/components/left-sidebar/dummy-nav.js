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
        url: '/messages',
        icon: 'ciergio-mail',
        title: 'Messages',
        items: []
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
        url: '/guest-delivery',
        icon: 'ciergio-door',
        title: 'Guest & Delivery',
        items: []
      },
      {
        url: '/maintenance',
        icon: 'ciergio-wrench',
        title: 'Maintenance & Repairs',
        items: []
      },
      {
        url: '/prayer-requests',
        icon: 'ciergio-prayer',
        title: 'Prayer Requests',
        items: []
      },
      {
        url: '/forms',
        icon: 'ciergio-file',
        title: 'Forms',
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
        url: '/my-members',
        icon: 'ciergio-employees',
        title: 'My Members',
        items: []
      },
      {
        url: '/offerings',
        icon: 'ciergio-donate-2',
        title: 'Offerings',
        items: []
      }
    ]
  }
]

export default navigation
