const rules = {
  pray: {
    administrator: {
      allowedRoutes: [
        '/messages',
        '/residents',
        '/posts',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts/create',
        '/posts/all',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'residents:view',
        'residents:create',
        'residents:update',
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
        'notifications:draft'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/messages',
        '/residents',
        '/posts',
        '/prayer-requests',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/donations'
      ],
      allowedNestedRoutes: [
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts/create',
        '/posts/all',
        '/forms/create',
        '/forms',
        '/notifications/all',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'residents:view',
        'residents:create',
        'residents:update',
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
        'prayerrequests:create',
        'prayerrequests:view',
        'donations:view'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/messages',
        '/residents',
        '/posts',
        '/prayer-requests',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/donations'
      ],
      allowedNestedRoutes: [
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts/create',
        '/posts/all',
        '/forms/create',
        '/forms',
        '/notifications/all',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'residents:view',
        'residents:create',
        'residents:update',
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
        'prayerrequests:create',
        'prayerrequests:view',
        'donations:view'
      ]
    }
  },
  home: {
    administrator: {
      allowedRoutes: [
        '/properties',
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
        '/properties/complex',
        '/properties/building',
        '/properties/manage/unit-types',
        '/properties/manage/categories',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
        '/forms/create',
        '/forms',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:create',
        'staff:update',
        'staff:delete',
        'residents:view',
        'residents:create',
        'residents:update',
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
        '/dues'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
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
        'staff:create',
        'staff:update',
        'staff:delete',
        'residents:view',
        'residents:create',
        'residents:update',
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
        'staff:create',
        'staff:update',
        'staff:delete',
        'residents:view',
        'residents:create',
        'residents:update',
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
        '/posts/create'
      ],
      allowedNestedRoutes: [
        '/properties/building',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/invites-requests',
        '/posts/all',
        '/posts/create',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'staff:view',
        'staff:create',
        'staff:update',
        'staff:delete',
        'residents:view',
        'residents:create',
        'residents:update',
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
        '/messages',
        '/attractions',
        '/qr-codes',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions/create',
        '/attractions/posts',
        '/qr-codes/create',
        '/qr-codes/posts',
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
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
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
        '/attractions',
        '/qr-codes',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions/create',
        '/attractions/posts',
        '/qr-codes/create',
        '/qr-codes/posts',
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
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
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
        '/attractions',
        '/qr-codes',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions/create',
        '/attractions/posts',
        '/qr-codes/create',
        '/qr-codes/posts',
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
        'qrcodes:create',
        'qrcodes:view',
        'qrcodes:update',
        'qrcodes:embed',
        'qrcodes:draft',
        'qrcodes:movetotrash',
        'qrcodes:delete',
        'qrcodes:restore',
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
