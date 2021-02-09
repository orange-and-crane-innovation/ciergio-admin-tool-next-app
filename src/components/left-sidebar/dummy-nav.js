const commonNavigation = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: 'ciergio-dashboard',
        title: 'Dashboard',
        items: []
      },
      {
        url: '/properties',
        icon: 'ciergio-organization',
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
        icon: 'ciergio-teams',
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
        icon: 'ciergio-employees',
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
        icon: 'ciergio-bulletin',
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
        icon: 'ciergio-bulletin',
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
      }
    ]
  }
]

const homeNavigation = [
  {
    title: 'Applications',
    items: [
      ...commonNavigation[0].items,
      ...[
        {
          url: '/maintenance',
          icon: 'ciergio-maintenance',
          title: 'Maintenance & Repairs',
          items: []
        },
        {
          url: '/dues',
          icon: 'ciergio-dues',
          title: 'My Dues',
          items: [
            {
              url: '/dues/billing',
              title: 'Billing',
              items: []
            }
          ]
        }
      ]
    ]
  }
]

const prayNavigation = [
  {
    title: 'Applications',
    items: [
      ...commonNavigation[0].items,
      ...[
        {
          url: '/prayer-requests',
          icon: 'ciergio-prayer',
          title: 'Prayer Requests',
          items: []
        },
        {
          url: '/donations',
          icon: 'ciergio-donate',
          title: 'Donations',
          items: []
        }
      ]
    ]
  }
]

const circleNavigation = [
  {
    title: 'Applications',
    items: [
      ...commonNavigation[0].items,
      {
        url: '/qr-codes',
        icon: 'fa fa-qrcode',
        title: 'QR Codes',
        items: []
      }
    ]
  }
]

export { homeNavigation, prayNavigation, circleNavigation }
