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
        '/posts',
        '/posts/create',
        '/posts/edit',
        '/posts/view',
        '/daily-readings',
        '/daily-readings/create',
        '/daily-readings/edit',
        '/daily-readings/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
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
        'directory:categories:update::delete',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        '/posts',
        '/posts/create',
        '/posts/edit',
        '/posts/view',
        '/daily-readings',
        '/daily-readings/create',
        '/daily-readings/edit',
        '/daily-readings/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
        '/notifications/list',
        '/notifications/all',
        '/notifications/create',
        '/prayer-requests/list'
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
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        '/posts',
        '/posts/create',
        '/posts/edit',
        '/posts/view',
        '/daily-readings',
        '/daily-readings/create',
        '/daily-readings/edit',
        '/daily-readings/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
        '/notifications/list',
        '/notifications/all',
        '/notifications/create',
        '/prayer-requests/list'
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
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications',
        '/prayer-requests/list'
      ],
      allowedNestedRoutes: [
        '/posts',
        '/posts/view',
        '/daily-readings',
        '/daily-readings/view',
        '/forms',
        '/notifications/list',
        '/notifications/create',
        '/dues/billing'
      ],
      actions: [
        'messages:view',
        'messages:create',
        'bulletin:view',
        'forms:view',
        'directory:view',
        'contactus:view',
        'notifications:view',
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
        '/properties/unit',
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
        '/posts/edit',
        '/posts/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
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
        'staff:resend::cancel',
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
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'directory:categories:create',
        'directory:categories:update',
        'directory:categories:delete',
        'directory:categories:update::delete',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update'
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
        '/properties/unit',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests/complexes',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/posts/edit',
        '/posts/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
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
        'staff:resend::cancel',
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
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        '/properties/unit',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/residents/all-residents',
        '/residents/all-residents/complexes',
        '/residents/invites-requests/complexes',
        '/residents/invites-requests',
        '/posts',
        '/posts/create',
        '/posts/edit',
        '/posts/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
        '/notifications/list',
        '/notifications/create',
        '/dues/overview',
        '/dues/manage-categories',
        '/dues/billing/:id',
        '/dues/billing/:id/:categoryId'
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
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        'dues:categories:delete',
        'dues:view::update',
        'dues:payment'
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
        '/posts/edit',
        '/posts/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
        '/dues/billing',
        '/notifications/list',
        '/notifications/create',
        '/receptionist/visitors',
        '/receptionist/deliveries',
        '/receptionist/pick-ups',
        '/receptionist/services',
        '/dues/billing',
        '/dues/billing/:id',
        '/dues/billing/:id/:categoryId'
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
        'directory:contact:create',
        'directory:contact:update::delete',
        'directory:contact:view',
        'directory:contact:update',
        'directory:contact:delete',
        'directory:contact:view',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update',
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
        'dues:view::update',
        'dues:payment',
        'guestanddeliveries:view',
        'guestanddeliveries:addschedule',
        'guestanddeliveries:updateschedule',
        'guestanddeliveries:cancelschedule',
        'guestanddeliveries:checkinschedule',
        'guestanddeliveries:checkoutschedule',
        'guestanddeliveries:viewnote',
        'guestanddeliveries:addnote',
        'guestanddeliveries:addimages',
        'guestanddeliveries:print',
        'guestanddeliveries:download'
      ]
    },
    receptionist: {
      allowedRoutes: ['/properties', '/messages', '/receptionist'],
      allowedNestedRoutes: [
        '/properties/building',
        '/receptionist/visitors',
        '/receptionist/deliveries',
        '/receptionist/pick-ups',
        '/receptionist/services'
      ],
      actions: [
        'guestanddeliveries:view',
        'guestanddeliveries:view:cancel:message',
        'guestanddeliveries:addschedule',
        'guestanddeliveries:updateschedule',
        'guestanddeliveries:cancelschedule',
        'guestanddeliveries:checkinschedule',
        'guestanddeliveries:checkoutschedule',
        'guestanddeliveries:addnote',
        'guestanddeliveries:viewnote',
        'guestanddeliveries:addimages',
        'guestanddeliveries:print',
        'guestanddeliveries:download'
      ]
    }
  },
  circle: {
    administrator: {
      allowedRoutes: [
        '/properties',
        '/staff',
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/properties/company',
        '/properties/manage/categories',
        '/staff/all-staff',
        '/staff/pending-invites',
        '/attractions-events',
        '/attractions-events/create',
        '/attractions-events/edit',
        '/attractions-events/view',
        '/qr-code',
        '/qr-code/create',
        '/qr-code/edit',
        '/qr-code/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
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
        'directory:categories:update::delete',
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update'
      ]
    },
    company_admin: {
      allowedRoutes: [
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events',
        '/attractions-events/create',
        '/attractions-events/edit',
        '/attractions-events/view',
        '/qr-code',
        '/qr-code/create',
        '/qr-code/edit',
        '/qr-code/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
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
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update'
      ]
    },
    complex_admin: {
      allowedRoutes: [
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events',
        '/attractions-events/create',
        '/attractions-events/edit',
        '/attractions-events/view',
        '/qr-code',
        '/qr-code/create',
        '/qr-code/edit',
        '/qr-code/view',
        '/forms',
        '/forms/create',
        '/forms/edit',
        '/notifications/list',
        '/notifications/create'
      ],
      actions: [
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
        'contactus:create',
        'contactus:update::delete',
        'contactus:view',
        'contactus:update',
        'notifications:create',
        'notifications:update',
        'notifications:view',
        'notifications:delete',
        'notifications:trash',
        'notifications:draft',
        'notifications:restore',
        'notifications:view::update'
      ]
    },
    member: {
      allowedRoutes: [
        '/attractions-events',
        '/qr-code',
        '/forms',
        '/directory',
        '/contact-us',
        '/notifications'
      ],
      allowedNestedRoutes: [
        '/attractions-events/view',
        '/qr-code/view',
        '/forms',
        '/notifications/list'
      ],
      actions: [
        'bulletin:view',
        'forms:view',
        'directory:view',
        'contactus:view',
        'notifications:view'
      ]
    }
  }
}

export default rules
