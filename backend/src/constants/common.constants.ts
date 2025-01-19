
export const Roles = {
  DIRECTOR: "director",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
}

export type RoleType = typeof Roles[keyof typeof Roles];


export const RolesAccessibilityWithRoles: Record<RoleType, RoleType[]> = {
  [Roles.DIRECTOR]: [Roles.DIRECTOR, Roles.SUPER_ADMIN, Roles.ADMIN, Roles.AGENT, Roles.USER],
  [Roles.SUPER_ADMIN]: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.AGENT, Roles.USER],
  [Roles.ADMIN]: [Roles.ADMIN, Roles.AGENT, Roles.USER],
  [Roles.AGENT]: [Roles.AGENT],
  [Roles.USER]: [Roles.USER],
}

