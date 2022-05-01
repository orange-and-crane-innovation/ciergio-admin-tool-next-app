import P from 'prop-types'
import React from 'react'

import { RolesPermissions } from '../rolespermissions'
import navigation from './dummy-nav'
import Item from './item'
import Logo from './logo'
import Title from './title'

const LeftSidebar = ({ systemType, userRole, onToggle, isCollapsed }) => {
  // const rule = rules[systemType][userRole]
  // const allowedRoutes = rule?.allowedRoutes || []
  // const allowedNestedRoutes = rule?.allowedNestedRoutes || []
  console.log('SIDEBARRRR')

  return (
    <div className="left-sidebar left-sidebar-1 scrollableContainer">
      <Logo show={true} onToggle={onToggle} isCollapsed={isCollapsed} />
      {navigation.map((menu, i) => {
        return (
          <React.Fragment key={i}>
            <Title>{menu.title}</Title>
            <ul>
              {menu.items.map((l0, a) => {
                // const url = l0.url
                // old checking of the routes is allowed
                // if (allowedRoutes.indexOf(url) !== -1) {

                // }

                return (
                  <RolesPermissions
                    text={l0?.title}
                    no={null}
                    permission={l0?.permission}
                    roleName={l0?.roleName}
                    key={a}
                  >
                    <li className="l0">
                      <Item
                        icon={l0.icon}
                        items={l0.items}
                        url={l0.url}
                        title={l0.title}
                        badge={l0.badge}
                      />
                      <ul>
                        {l0.items.map((l1, b) => {
                          // old checking if the nested routes is allowed based on old constant rules
                          // if (allowedNestedRoutes.indexOf(l1.url) !== -1) {

                          // }

                          return (
                            <li key={b} className="l1">
                              <Item {...l1} />
                              <ul>
                                {l1.items.map((l2, c) => (
                                  <li key={c} className="l2">
                                    <Item {...l2} />
                                    <ul>
                                      {l2.items.map((l3, d) => (
                                        <li key={d} className="l3">
                                          <Item {...l3} />
                                          <ul>
                                            {l3.items.map((l4, e) => (
                                              <li key={e} className="l4">
                                                <Item {...l4} />
                                              </li>
                                            ))}
                                          </ul>
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </RolesPermissions>
                )
              })}
            </ul>
          </React.Fragment>
        )
      })}
    </div>
  )
}

LeftSidebar.defaultProps = {
  systemType: 'home'
}

LeftSidebar.propTypes = {
  systemType: P.string.isRequired,
  userRole: P.string,
  onToggle: P.func,
  isCollapsed: P.bool
}

export default LeftSidebar
