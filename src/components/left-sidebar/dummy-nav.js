const navigation = [
  {
    title: 'Applications',
    items: [
      {
        url: '/dashboard',
        icon: 'ciergio-home',
        title: 'Dashboard',
        moduleName: 'homePage',

        items: []
      },
      {
        url: '/properties',
        icon: 'ciergio-building',
        title: 'My Properties',
        permissionGroup: 'accounts',
        moduleName: 'myProperties',
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
        url: '/members',
        icon: 'ciergio-user',
        title: 'My Members',
        moduleName: 'myMembers',
        permissionGroup: 'accounts',

        items: [
          {
            url: '/members/all-members',
            title: 'All Members',
            items: []
          },
          {
            url: '/members/groups',
            title: 'Groups',
            items: []
          },
          {
            url: '/members/pending-member-invites',
            title: 'Pending Member Invites',
            items: []
          }
        ]
      },
      {
        url: '/staff',
        icon: 'ciergio-user-group',
        title: 'My Staff',
        permissionGroup: 'accounts',
        moduleName: 'myStaff',
        items: [
          {
            url: '/staff/all-staff',
            title: 'Manage Staff',
            items: []
          },
          {
            url: '/staff/roles-&-permissions',
            title: 'Roles and Permissions',
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
        moduleName: 'myResidents',
        permissionGroup: 'accounts',
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
        permissionGroup: 'post',
        moduleName: 'bulletinBoard',
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
        moduleName: 'dailyReading',
        permissionGroup: 'post',
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
        moduleName: 'post',
        permissionGroup: 'attactionsAndEvents',
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
        permissionGroup: 'qrCode',
        moduleName: 'post',
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
        moduleName: 'maintenanceAndRepairs',
        permissionGroup: 'issues',
        items: []
      },
      {
        url: '/pastoral-works',
        icon: 'ciergio-list',
        title: 'Pastoral Works',
        permissionGroup: 'post',
        moduleName: 'pastoralWorks',
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
        permissionGroup: 'issues',
        moduleName: 'prayerRequests',
        items: []
      },
      {
        url: '/dues',
        icon: 'ciergio-bill',
        title: 'My Dues',
        permissionGroup: 'dues',
        moduleName: 'myDues',
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
      // {
      //   url: '/offerings',
      //   icon: 'ciergio-donate-2',
      //   title: 'Offerings',
      //   permissionGroup: 'payments',
      //   moduleName: 'donations',
      //   items: []
      // },
      {
        url: '/transactions',
        icon: 'ciergio-bill',
        title: 'Transactions',
        permissionGroup: 'payments',
        moduleName: 'donations',
        items: [
          {
            url: '/transactions/virtual-terminal',
            title: 'Virtual Terminal',
            items: []
          }
        ]
      },
      {
        url: '/messages',
        icon: 'ciergio-mail',
        title: 'Messages',
        permissionGroup: 'messaging',
        moduleName: 'messages',
        items: [],
        badge: 'unreadMsg'
      },
      {
        url: '/forms',
        icon: 'ciergio-file',
        title: 'Downloadable Forms',
        permissionGroup: 'post',
        moduleName: 'forms',
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
        moduleName: 'directory',
        permissionGroup: 'accounts',
        items: []
      },
      {
        url: '/contact-us',
        icon: 'ciergio-email-at',
        title: 'Contact Us',
        permissionGroup: 'contactPage',
        moduleName: 'contactPage',
        items: []
      },
      {
        url: '/notifications',
        icon: 'ciergio-mail',
        title: 'Notifications',
        permissionGroup: 'notifications',
        moduleName: 'notifications',
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
        moduleName: 'guestAndDelivery',
        permissionGroup: 'registry',
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
        url: '/settings',
        icon: 'ciergio-gear',
        title: 'Community Settings',
        permissionGroup: 'accounts',
        moduleName: 'settingsPage',
        items: [
          {
            url: '/settings/categories',
            title: 'Global Categories',
            items: []
          }
        ]
      }
    ]
  }
]

export default navigation
