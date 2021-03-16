const rules = {
  pray: {
    administrator: {
      allowedRoutes: [
        '/dashboard',
        '/properties',
        '/staff',
        '/messages',
        '/posts',
        '/prayer-requests',
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
        'messages:view',
        'messages:create',
        'bulletin:create',
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
        'forms:update::trash',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:create',
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
        'offerings:view'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/dashboard',
        '/staff',
        '/messages',
        '/posts',
        '/prayer-requests',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/offerings'
      ],
      allowedNestedRoutes: [
        'staff:view',
        'staff:invite',
        'staff:update',
        'staff:delete',
        'staff:export',
        'staff:print',
        'staff:view::update::delete',
        'messages:view',
        'messages:create',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/posts/create',
        '/posts',
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
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
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
        'offerings:view'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/dashboard',
        '/messages',
        '/posts',
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
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
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
        'prayerrequests:view',
        'offerings:view'
      ]
    },
    member: {
      allowedRoutes: [
        '/dashboard',
        '/posts',
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
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
        'forms:draft',
        'forms:update::trash',
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
        '/dashboard',
        '/properties',
        '/guest-and-deliveries',
        '/maintenance',
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
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
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
        '/dashboard',
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
        '/dues'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms',
        '/dues/billing',
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
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
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
        '/dashboard',
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
        '/dues'
      ],
      allowedNestedRoutes: [
        '/properties/complex',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/create',
        '/forms',
        '/dues/billing',
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
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
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
        '/dashboard',
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
        '/dues',
        '/guest-and-deliveries',
        '/receptionist',
        '/posts/create'
      ],
      allowedNestedRoutes: [
        '/properties/building',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/forms/building',
        '/dues/billing',
        '/notifications/list',
        '/notifications/create',
        '/receptionist/visitors',
        '/receptionist/deliveries',
        '/receptionist/pick-ups',
        '/receptionist/services'
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
        'bulletin:update',
        'bulletin:view',
        'bulletin:delete',
        'bulletin:update',
        'bulletin:draft',
        'bulletin:embed',
        'forms:view',
        'forms:create',
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
        '/dashboard',
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
        '/dashboard',
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
        '/dashboard',
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
        '/dashboard',
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
