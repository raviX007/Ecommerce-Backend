// export interface JwtPayload {
//     userId: string;
//     email: string;
//     role: 'customer' | 'admin';
//     iat?: number;
//     exp?: number;
// }

// export interface LoginDto {
//     email: string;
//     password: string;
// }

// export interface AuthResponse {
//     token: string;
//     user: {
//         id: string;
//         email: string;
//         role: string;
//     }
// }

// src/types/auth.types.ts

// Define available user roles
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface RolePermissions {
  [UserRole.ADMIN]: {
    canManageProducts: true;
    canManageCategories: true;
    canViewAllOrders: true;
    canBrowseProducts: true;
  };
  [UserRole.CUSTOMER]: {
    canBrowseProducts: true;
    canManageCart: true;
    canPlaceOrders: true;
    canViewOwnOrders: true;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  userId: number;
  email: string;
  role: UserRole;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export type Permission = keyof RolePermissions[UserRole];

export const hasPermission = (
  role: UserRole,
  permission: Permission
): boolean => {
  const permissions: RolePermissions = {
    [UserRole.ADMIN]: {
      canManageProducts: true,
      canManageCategories: true,
      canViewAllOrders: true,
      canBrowseProducts: true,
    },
    [UserRole.CUSTOMER]: {
      canBrowseProducts: true,
      canManageCart: true,
      canPlaceOrders: true,
      canViewOwnOrders: true,
    },
  };

  return !!permissions[role][
    permission as keyof (typeof permissions)[typeof role]
  ];
};
