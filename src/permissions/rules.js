const rules = {
  pray: {
    administrator: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/posts',
        '/daily-readings',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/offerings'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/properties/manage/categories',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/posts/create',
        '/posts',
        '/daily-readings/create',
        '/daily-readings',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'staff:resend::cancel',
        'messages:view',
        'messages:create',
        'bulletin:create',
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
        'forms:restore::delete',
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'directory:categories:create',
        'directory:categories:update',
        'directory:categories:delete',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:view::update',
        'notifications:trash',
        'notifications:draft',
        'offerings:view'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/messages',
        '/posts',
        '/daily-readings',
        '/prayer-requests',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/offerings'
      ],
      allowedNestedRoutes: [
        '/staff/all-staff',
        '/staff/pending-invites',
        '/posts/create',
        '/posts',
        '/daily-readings/create',
        '/daily-readings',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/all',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
        'forms:restore::delete',
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'directory:categories:create',
        'directory:categories:update',
        'directory:categories:delete',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:view::update',
        'notifications:trash',
        'notifications:draft',
        'prayerrequests:create',
        'prayerrequests:export',
        'prayerrequests:print',
        'prayerrequests:view',
        'offerings:view',
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'staff:resend::cancel',
        'messages:view',
        'messages:create'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/messages',
        '/posts',
        '/daily-readings',
        '/prayer-requests',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/offerings'
      ],
      allowedNestedRoutes: [
        '/posts/create',
        '/posts',
        '/daily-readings/create',
        '/daily-readings',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/all',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'bulletin:create',
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'bulletin:reorder',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
        'forms:restore::delete',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:view::update',
        'notifications:trash',
        'notifications:draft',
        'prayerrequests:create',
        'prayerrequests:export',
        'prayerrequests:print',
        'prayerrequests:view',
        'offerings:view',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view'
      ]
    },
    member: {
      allowedRoutes: [
        '/posts',
        '/daily-readings',
        '/maintenance',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/dues',
        '/prayer-requests'
      ],
      allowedNestedRoutes: [
        '/posts/create',
        '/posts',
        '/daily-readings',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create',
        '/dues/billing'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
        'forms:restore::delete',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:view::update',
        'notifications:trash',
        'notifications:draft',
        'prayerrequests:create',
        'prayerrequests:view'
      ]
    }
  },
  home: {
    administrator: {
      allowedRoutes: [
        '/properties',
        '/guest-and-deliveries',
        '/maintenance',
        '/maintenance/complexes',
        '/maintenance/buildings',
        '/staff',
        '/messages',
        '/residents',
        '/posts',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/properties/manage/unit-types',
        '/properties/manage/categories',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests/complexes',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create',
        '/guest-and-deliveries'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'residents:view',
        'residents:create',
        'residents:update',
        'residents:resend::cancel',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:view::update',
        'notifications:trash',
        'notifications:draft'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/messages',
        '/residents',
        '/posts',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/maintenance',
        '/maintenance/complexes',
        '/maintenance/buildings'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests/complexes',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'residents:view',
        'residents:create',
        'residents:update',
        'residents:resend::cancel',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:update',
        'notifications:draft',
        'maintenance:view',
        'maintenance:create',
        'maintenance:assign',
        'maintenance:comment',
        'maintenance:follow',
        'maintenance:update',
        'maintenance:reopen',
        'maintenance:resolve'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/messages',
        '/residents',
        '/posts',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/maintenance',
        '/maintenance/complexes',
        '/maintenance/buildings',
        '/dues'
      ],
      allowedNestedRoutes: [
        '/properties/complex',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests/complexes',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms',
        '/dues/billing/:id',
        '/notifications/list',
        '/notifications/create',
        '/dues/overview',
        '/dues/manage-categories'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'residents:view',
        'residents:create',
        'residents:update',
        'residents:resend::cancel',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'bulletin:reorder',
        'forms:view',
        'forms:create',
        'forms:draft',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:update',
        'notifications:draft',
        'maintenance:view',
        'maintenance:create',
        'maintenance:assign',
        'maintenance:comment',
        'maintenance:follow',
        'maintenance:update',
        'maintenance:reopen',
        'maintenance:resolve',
        'dues:create',
        'dues:update',
        'dues:send'
      ]
    },
    building_admin: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/messages',
        '/residents',
        '/posts',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/maintenance',
        '/maintenance/complexes',
        '/maintenance/buildings',
        '/dues',
        '/guest-and-deliveries',
        '/receptionist',
        '/posts/create',
        '/dues'
      ],
      allowedNestedRoutes: [
        '/properties/building',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests',
        '/residents/invites-requests/complexes',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms/building',
        '/dues/billing',
        '/notifications/list',
        '/notifications/create',
        '/receptionist/visitors',
        '/receptionist/deliveries',
        '/receptionist/pick-ups',
        '/receptionist/services',
        '/dues/billing'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'residents:view',
        'residents:create',
        'residents:update',
        'residents:resend::cancel',
        'bulletin:create',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:view',
        'forms:create',
        'forms:draft',
        'directory:create',
        'directory:view',
        'directory:update',
        'contactus:create',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:update',
        'notifications:draft',
        'maintenance:view',
        'maintenance:create',
        'maintenance:assign',
        'maintenance:comment',
        'maintenance:follow',
        'maintenance:update',
        'maintenance:reopen',
        'maintenance:resolve',
        'dues:view',
        'dues:create',
        'dues:update',
        'dues:send',
        'guestanddeliveries:view',
        'guestanddeliveries:createvisitor',
        'guestanddeliveries:updatevisitor',
        'guestanddeliveries:cancelvisitor',
        'guestanddeliveries:checkinvisitor',
        'guestanddeliveries:checkoutvisitor',
        'guestanddeliveries:addnote',
        'guestanddeliveries:addimages'
      ]
    }
  },
  circle: {
    administrator: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/messages',
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/properties/manage/unit-types',
        '/properties/manage/categories',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/attractions-events',
        '/attractions-events/create',
        '/attractions-events/posts',
        '/qr-code',
        '/qr-code/create',
        '/qr-code/posts',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'messages:create',
        'messages:view',
        'attractions:create',
        'attractions:view',
        'attractions:update',
        'attractions:embed',
        'attractions:draft',
        'attractions:movetotrash',
        'attractions:delete',
        'attractions:restore',
        'attractions:resend::cancel',
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
        'bulletin:create',
        'bulletin:view',
        'bulletin:update',
        'bulletin:embed',
        'bulletin:draft',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:createattachments',
        'forms:view',
        'forms:upload',
        'forms:publish',
        'directory:create',
        'directory:update',
        'directory:delete',
        'directory:view',
        'contactus:create',
        'contactus:update',
        'contactus:delete',
        'contactus:view',
        'notifications:create',
        'notifications:view',
        'notifications:update',
        'notifications:embed',
        'notifications:draft',
        'notifications:movetotrash',
        'notifications:delete',
        'notifications:restore'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/messages',
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events/create',
        '/attractions-events/posts',
        '/qr-code/create',
        '/qr-code/posts',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'messages:create',
        'messages:view',
        'attractions:create',
        'attractions:view',
        'attractions:update',
        'attractions:embed',
        'attractions:draft',
        'attractions:movetotrash',
        'attractions:delete',
        'attractions:restore',
        'attractions:resend::cancel',
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
        'bulletin:create',
        'bulletin:view',
        'bulletin:update',
        'bulletin:embed',
        'bulletin:draft',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:createattachments',
        'forms:view',
        'forms:upload',
        'forms:publish',
        'directory:create',
        'directory:update',
        'directory:delete',
        'directory:view',
        'contactus:create',
        'contactus:update',
        'contactus:delete',
        'contactus:view',
        'notifications:create',
        'notifications:view',
        'notifications:update',
        'notifications:embed',
        'notifications:draft',
        'notifications:movetotrash',
        'notifications:delete',
        'notifications:restore'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/messages',
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events/create',
        '/attractions-events/posts',
        '/qr-code/create',
        '/qr-code/posts',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:create',
        'messages:view',
        'attractions:create',
        'attractions:view',
        'attractions:update',
        'attractions:embed',
        'attractions:draft',
        'attractions:movetotrash',
        'attractions:delete',
        'attractions:restore',
        'attractions:resend::cancel',
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
        'bulletin:create',
        'bulletin:view',
        'bulletin:update',
        'bulletin:embed',
        'bulletin:draft',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:reorder',
        'bulletin:unpublish',
        'forms:createattachments',
        'forms:view',
        'forms:upload',
        'forms:publish',
        'directory:create',
        'directory:update',
        'directory:delete',
        'directory:view',
        'contactus:create',
        'contactus:update',
        'contactus:delete',
        'contactus:view',
        'notifications:create',
        'notifications:view',
        'notifications:update',
        'notifications:embed',
        'notifications:draft',
        'notifications:movetotrash',
        'notifications:delete',
        'notifications:restore'
      ]
    },
    member: {
      allowedRoutes: [
        '/messages',
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events/create',
        '/attractions-events/posts',
        '/qr-code/create',
        '/qr-code/posts',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:create',
        'messages:view',
        'bulletin:create',
        'bulletin:view',
        'bulletin:update',
        'bulletin:embed',
        'bulletin:draft',
        'bulletin:movetotrash',
        'bulletin:delete',
        'bulletin:restore',
        'bulletin:unpublish',
        'forms:createattachments',
        'forms:view',
        'forms:upload',
        'forms:publish',
        'directory:create',
        'directory:update',
        'directory:delete',
        'directory:view',
        'contactus:create',
        'contactus:update',
        'contactus:delete',
        'contactus:view',
        'notifications:create',
        'notifications:view',
        'notifications:update',
        'notifications:embed',
        'notifications:draft',
        'notifications:movetotrash',
        'notifications:delete',
        'notifications:restore'
      ]
    }
  }
}

export default rules
