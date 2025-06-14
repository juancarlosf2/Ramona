/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as LogoutImport } from './routes/logout'
import { Route as LoginImport } from './routes/login'
import { Route as AuthedImport } from './routes/_authed'
import { Route as AuthedIndexImport } from './routes/_authed/index'
import { Route as AuthForgotPasswordImport } from './routes/auth/forgot-password'
import { Route as AuthedSettingsImport } from './routes/_authed/settings'
import { Route as AuthedCalendarImport } from './routes/_authed/calendar'
import { Route as AuthedVehiclesIndexImport } from './routes/_authed/vehicles/index'
import { Route as AuthedInsuranceIndexImport } from './routes/_authed/insurance/index'
import { Route as AuthedContractsIndexImport } from './routes/_authed/contracts/index'
import { Route as AuthedConsignmentsIndexImport } from './routes/_authed/consignments/index'
import { Route as AuthedClientsIndexImport } from './routes/_authed/clients/index'
import { Route as AuthedVehiclesRegisterImport } from './routes/_authed/vehicles/register'
import { Route as AuthedInsuranceNewImport } from './routes/_authed/insurance/new'
import { Route as AuthedContractsNewImport } from './routes/_authed/contracts/new'
import { Route as AuthedConsignmentsNewImport } from './routes/_authed/consignments/new'
import { Route as AuthedConsignmentsConcesionarioIdImport } from './routes/_authed/consignments/$concesionarioId'
import { Route as AuthedClientsNewImport } from './routes/_authed/clients/new'
import { Route as AuthedClientsPurchasedByIdImport } from './routes/_authed/clients/$purchasedById'
import { Route as AuthedClientsClientIdImport } from './routes/_authed/clients/$clientId'
import { Route as AuthedVehiclesVehicleIdIndexImport } from './routes/_authed/vehicles/$vehicleId/index'
import { Route as AuthedInsuranceInsuranceIdIndexImport } from './routes/_authed/insurance/$insuranceId/index'
import { Route as AuthedContractsContractIdIndexImport } from './routes/_authed/contracts/$contractId/index'
import { Route as AuthedVehiclesVehicleIdEditImport } from './routes/_authed/vehicles/$vehicleId/edit'
import { Route as AuthedInsuranceInsuranceIdEditImport } from './routes/_authed/insurance/$insuranceId/edit'
import { Route as AuthedContractsContractIdEditImport } from './routes/_authed/contracts/$contractId/edit'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const LogoutRoute = LogoutImport.update({
  id: '/logout',
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRoute = AuthedImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const AuthedIndexRoute = AuthedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthForgotPasswordRoute = AuthForgotPasswordImport.update({
  id: '/auth/forgot-password',
  path: '/auth/forgot-password',
  getParentRoute: () => rootRoute,
} as any)

const AuthedSettingsRoute = AuthedSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedCalendarRoute = AuthedCalendarImport.update({
  id: '/calendar',
  path: '/calendar',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedVehiclesIndexRoute = AuthedVehiclesIndexImport.update({
  id: '/vehicles/',
  path: '/vehicles/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedInsuranceIndexRoute = AuthedInsuranceIndexImport.update({
  id: '/insurance/',
  path: '/insurance/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedContractsIndexRoute = AuthedContractsIndexImport.update({
  id: '/contracts/',
  path: '/contracts/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedConsignmentsIndexRoute = AuthedConsignmentsIndexImport.update({
  id: '/consignments/',
  path: '/consignments/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedClientsIndexRoute = AuthedClientsIndexImport.update({
  id: '/clients/',
  path: '/clients/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedVehiclesRegisterRoute = AuthedVehiclesRegisterImport.update({
  id: '/vehicles/register',
  path: '/vehicles/register',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedInsuranceNewRoute = AuthedInsuranceNewImport.update({
  id: '/insurance/new',
  path: '/insurance/new',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedContractsNewRoute = AuthedContractsNewImport.update({
  id: '/contracts/new',
  path: '/contracts/new',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedConsignmentsNewRoute = AuthedConsignmentsNewImport.update({
  id: '/consignments/new',
  path: '/consignments/new',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedConsignmentsConcesionarioIdRoute =
  AuthedConsignmentsConcesionarioIdImport.update({
    id: '/consignments/$concesionarioId',
    path: '/consignments/$concesionarioId',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedClientsNewRoute = AuthedClientsNewImport.update({
  id: '/clients/new',
  path: '/clients/new',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedClientsPurchasedByIdRoute = AuthedClientsPurchasedByIdImport.update(
  {
    id: '/clients/$purchasedById',
    path: '/clients/$purchasedById',
    getParentRoute: () => AuthedRoute,
  } as any,
)

const AuthedClientsClientIdRoute = AuthedClientsClientIdImport.update({
  id: '/clients/$clientId',
  path: '/clients/$clientId',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedVehiclesVehicleIdIndexRoute =
  AuthedVehiclesVehicleIdIndexImport.update({
    id: '/vehicles/$vehicleId/',
    path: '/vehicles/$vehicleId/',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedInsuranceInsuranceIdIndexRoute =
  AuthedInsuranceInsuranceIdIndexImport.update({
    id: '/insurance/$insuranceId/',
    path: '/insurance/$insuranceId/',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedContractsContractIdIndexRoute =
  AuthedContractsContractIdIndexImport.update({
    id: '/contracts/$contractId/',
    path: '/contracts/$contractId/',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedVehiclesVehicleIdEditRoute =
  AuthedVehiclesVehicleIdEditImport.update({
    id: '/vehicles/$vehicleId/edit',
    path: '/vehicles/$vehicleId/edit',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedInsuranceInsuranceIdEditRoute =
  AuthedInsuranceInsuranceIdEditImport.update({
    id: '/insurance/$insuranceId/edit',
    path: '/insurance/$insuranceId/edit',
    getParentRoute: () => AuthedRoute,
  } as any)

const AuthedContractsContractIdEditRoute =
  AuthedContractsContractIdEditImport.update({
    id: '/contracts/$contractId/edit',
    path: '/contracts/$contractId/edit',
    getParentRoute: () => AuthedRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authed': {
      id: '/_authed'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/logout': {
      id: '/logout'
      path: '/logout'
      fullPath: '/logout'
      preLoaderRoute: typeof LogoutImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/_authed/calendar': {
      id: '/_authed/calendar'
      path: '/calendar'
      fullPath: '/calendar'
      preLoaderRoute: typeof AuthedCalendarImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/settings': {
      id: '/_authed/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthedSettingsImport
      parentRoute: typeof AuthedImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/auth/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordImport
      parentRoute: typeof rootRoute
    }
    '/_authed/': {
      id: '/_authed/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthedIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/clients/$clientId': {
      id: '/_authed/clients/$clientId'
      path: '/clients/$clientId'
      fullPath: '/clients/$clientId'
      preLoaderRoute: typeof AuthedClientsClientIdImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/clients/$purchasedById': {
      id: '/_authed/clients/$purchasedById'
      path: '/clients/$purchasedById'
      fullPath: '/clients/$purchasedById'
      preLoaderRoute: typeof AuthedClientsPurchasedByIdImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/clients/new': {
      id: '/_authed/clients/new'
      path: '/clients/new'
      fullPath: '/clients/new'
      preLoaderRoute: typeof AuthedClientsNewImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/consignments/$concesionarioId': {
      id: '/_authed/consignments/$concesionarioId'
      path: '/consignments/$concesionarioId'
      fullPath: '/consignments/$concesionarioId'
      preLoaderRoute: typeof AuthedConsignmentsConcesionarioIdImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/consignments/new': {
      id: '/_authed/consignments/new'
      path: '/consignments/new'
      fullPath: '/consignments/new'
      preLoaderRoute: typeof AuthedConsignmentsNewImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/contracts/new': {
      id: '/_authed/contracts/new'
      path: '/contracts/new'
      fullPath: '/contracts/new'
      preLoaderRoute: typeof AuthedContractsNewImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/insurance/new': {
      id: '/_authed/insurance/new'
      path: '/insurance/new'
      fullPath: '/insurance/new'
      preLoaderRoute: typeof AuthedInsuranceNewImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/vehicles/register': {
      id: '/_authed/vehicles/register'
      path: '/vehicles/register'
      fullPath: '/vehicles/register'
      preLoaderRoute: typeof AuthedVehiclesRegisterImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/clients/': {
      id: '/_authed/clients/'
      path: '/clients'
      fullPath: '/clients'
      preLoaderRoute: typeof AuthedClientsIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/consignments/': {
      id: '/_authed/consignments/'
      path: '/consignments'
      fullPath: '/consignments'
      preLoaderRoute: typeof AuthedConsignmentsIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/contracts/': {
      id: '/_authed/contracts/'
      path: '/contracts'
      fullPath: '/contracts'
      preLoaderRoute: typeof AuthedContractsIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/insurance/': {
      id: '/_authed/insurance/'
      path: '/insurance'
      fullPath: '/insurance'
      preLoaderRoute: typeof AuthedInsuranceIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/vehicles/': {
      id: '/_authed/vehicles/'
      path: '/vehicles'
      fullPath: '/vehicles'
      preLoaderRoute: typeof AuthedVehiclesIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/contracts/$contractId/edit': {
      id: '/_authed/contracts/$contractId/edit'
      path: '/contracts/$contractId/edit'
      fullPath: '/contracts/$contractId/edit'
      preLoaderRoute: typeof AuthedContractsContractIdEditImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/insurance/$insuranceId/edit': {
      id: '/_authed/insurance/$insuranceId/edit'
      path: '/insurance/$insuranceId/edit'
      fullPath: '/insurance/$insuranceId/edit'
      preLoaderRoute: typeof AuthedInsuranceInsuranceIdEditImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/vehicles/$vehicleId/edit': {
      id: '/_authed/vehicles/$vehicleId/edit'
      path: '/vehicles/$vehicleId/edit'
      fullPath: '/vehicles/$vehicleId/edit'
      preLoaderRoute: typeof AuthedVehiclesVehicleIdEditImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/contracts/$contractId/': {
      id: '/_authed/contracts/$contractId/'
      path: '/contracts/$contractId'
      fullPath: '/contracts/$contractId'
      preLoaderRoute: typeof AuthedContractsContractIdIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/insurance/$insuranceId/': {
      id: '/_authed/insurance/$insuranceId/'
      path: '/insurance/$insuranceId'
      fullPath: '/insurance/$insuranceId'
      preLoaderRoute: typeof AuthedInsuranceInsuranceIdIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/vehicles/$vehicleId/': {
      id: '/_authed/vehicles/$vehicleId/'
      path: '/vehicles/$vehicleId'
      fullPath: '/vehicles/$vehicleId'
      preLoaderRoute: typeof AuthedVehiclesVehicleIdIndexImport
      parentRoute: typeof AuthedImport
    }
  }
}

// Create and export the route tree

interface AuthedRouteChildren {
  AuthedCalendarRoute: typeof AuthedCalendarRoute
  AuthedSettingsRoute: typeof AuthedSettingsRoute
  AuthedIndexRoute: typeof AuthedIndexRoute
  AuthedClientsClientIdRoute: typeof AuthedClientsClientIdRoute
  AuthedClientsPurchasedByIdRoute: typeof AuthedClientsPurchasedByIdRoute
  AuthedClientsNewRoute: typeof AuthedClientsNewRoute
  AuthedConsignmentsConcesionarioIdRoute: typeof AuthedConsignmentsConcesionarioIdRoute
  AuthedConsignmentsNewRoute: typeof AuthedConsignmentsNewRoute
  AuthedContractsNewRoute: typeof AuthedContractsNewRoute
  AuthedInsuranceNewRoute: typeof AuthedInsuranceNewRoute
  AuthedVehiclesRegisterRoute: typeof AuthedVehiclesRegisterRoute
  AuthedClientsIndexRoute: typeof AuthedClientsIndexRoute
  AuthedConsignmentsIndexRoute: typeof AuthedConsignmentsIndexRoute
  AuthedContractsIndexRoute: typeof AuthedContractsIndexRoute
  AuthedInsuranceIndexRoute: typeof AuthedInsuranceIndexRoute
  AuthedVehiclesIndexRoute: typeof AuthedVehiclesIndexRoute
  AuthedContractsContractIdEditRoute: typeof AuthedContractsContractIdEditRoute
  AuthedInsuranceInsuranceIdEditRoute: typeof AuthedInsuranceInsuranceIdEditRoute
  AuthedVehiclesVehicleIdEditRoute: typeof AuthedVehiclesVehicleIdEditRoute
  AuthedContractsContractIdIndexRoute: typeof AuthedContractsContractIdIndexRoute
  AuthedInsuranceInsuranceIdIndexRoute: typeof AuthedInsuranceInsuranceIdIndexRoute
  AuthedVehiclesVehicleIdIndexRoute: typeof AuthedVehiclesVehicleIdIndexRoute
}

const AuthedRouteChildren: AuthedRouteChildren = {
  AuthedCalendarRoute: AuthedCalendarRoute,
  AuthedSettingsRoute: AuthedSettingsRoute,
  AuthedIndexRoute: AuthedIndexRoute,
  AuthedClientsClientIdRoute: AuthedClientsClientIdRoute,
  AuthedClientsPurchasedByIdRoute: AuthedClientsPurchasedByIdRoute,
  AuthedClientsNewRoute: AuthedClientsNewRoute,
  AuthedConsignmentsConcesionarioIdRoute:
    AuthedConsignmentsConcesionarioIdRoute,
  AuthedConsignmentsNewRoute: AuthedConsignmentsNewRoute,
  AuthedContractsNewRoute: AuthedContractsNewRoute,
  AuthedInsuranceNewRoute: AuthedInsuranceNewRoute,
  AuthedVehiclesRegisterRoute: AuthedVehiclesRegisterRoute,
  AuthedClientsIndexRoute: AuthedClientsIndexRoute,
  AuthedConsignmentsIndexRoute: AuthedConsignmentsIndexRoute,
  AuthedContractsIndexRoute: AuthedContractsIndexRoute,
  AuthedInsuranceIndexRoute: AuthedInsuranceIndexRoute,
  AuthedVehiclesIndexRoute: AuthedVehiclesIndexRoute,
  AuthedContractsContractIdEditRoute: AuthedContractsContractIdEditRoute,
  AuthedInsuranceInsuranceIdEditRoute: AuthedInsuranceInsuranceIdEditRoute,
  AuthedVehiclesVehicleIdEditRoute: AuthedVehiclesVehicleIdEditRoute,
  AuthedContractsContractIdIndexRoute: AuthedContractsContractIdIndexRoute,
  AuthedInsuranceInsuranceIdIndexRoute: AuthedInsuranceInsuranceIdIndexRoute,
  AuthedVehiclesVehicleIdIndexRoute: AuthedVehiclesVehicleIdIndexRoute,
}

const AuthedRouteWithChildren =
  AuthedRoute._addFileChildren(AuthedRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthedRouteWithChildren
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/signup': typeof SignupRoute
  '/calendar': typeof AuthedCalendarRoute
  '/settings': typeof AuthedSettingsRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/': typeof AuthedIndexRoute
  '/clients/$clientId': typeof AuthedClientsClientIdRoute
  '/clients/$purchasedById': typeof AuthedClientsPurchasedByIdRoute
  '/clients/new': typeof AuthedClientsNewRoute
  '/consignments/$concesionarioId': typeof AuthedConsignmentsConcesionarioIdRoute
  '/consignments/new': typeof AuthedConsignmentsNewRoute
  '/contracts/new': typeof AuthedContractsNewRoute
  '/insurance/new': typeof AuthedInsuranceNewRoute
  '/vehicles/register': typeof AuthedVehiclesRegisterRoute
  '/clients': typeof AuthedClientsIndexRoute
  '/consignments': typeof AuthedConsignmentsIndexRoute
  '/contracts': typeof AuthedContractsIndexRoute
  '/insurance': typeof AuthedInsuranceIndexRoute
  '/vehicles': typeof AuthedVehiclesIndexRoute
  '/contracts/$contractId/edit': typeof AuthedContractsContractIdEditRoute
  '/insurance/$insuranceId/edit': typeof AuthedInsuranceInsuranceIdEditRoute
  '/vehicles/$vehicleId/edit': typeof AuthedVehiclesVehicleIdEditRoute
  '/contracts/$contractId': typeof AuthedContractsContractIdIndexRoute
  '/insurance/$insuranceId': typeof AuthedInsuranceInsuranceIdIndexRoute
  '/vehicles/$vehicleId': typeof AuthedVehiclesVehicleIdIndexRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/signup': typeof SignupRoute
  '/calendar': typeof AuthedCalendarRoute
  '/settings': typeof AuthedSettingsRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/': typeof AuthedIndexRoute
  '/clients/$clientId': typeof AuthedClientsClientIdRoute
  '/clients/$purchasedById': typeof AuthedClientsPurchasedByIdRoute
  '/clients/new': typeof AuthedClientsNewRoute
  '/consignments/$concesionarioId': typeof AuthedConsignmentsConcesionarioIdRoute
  '/consignments/new': typeof AuthedConsignmentsNewRoute
  '/contracts/new': typeof AuthedContractsNewRoute
  '/insurance/new': typeof AuthedInsuranceNewRoute
  '/vehicles/register': typeof AuthedVehiclesRegisterRoute
  '/clients': typeof AuthedClientsIndexRoute
  '/consignments': typeof AuthedConsignmentsIndexRoute
  '/contracts': typeof AuthedContractsIndexRoute
  '/insurance': typeof AuthedInsuranceIndexRoute
  '/vehicles': typeof AuthedVehiclesIndexRoute
  '/contracts/$contractId/edit': typeof AuthedContractsContractIdEditRoute
  '/insurance/$insuranceId/edit': typeof AuthedInsuranceInsuranceIdEditRoute
  '/vehicles/$vehicleId/edit': typeof AuthedVehiclesVehicleIdEditRoute
  '/contracts/$contractId': typeof AuthedContractsContractIdIndexRoute
  '/insurance/$insuranceId': typeof AuthedInsuranceInsuranceIdIndexRoute
  '/vehicles/$vehicleId': typeof AuthedVehiclesVehicleIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authed': typeof AuthedRouteWithChildren
  '/login': typeof LoginRoute
  '/logout': typeof LogoutRoute
  '/signup': typeof SignupRoute
  '/_authed/calendar': typeof AuthedCalendarRoute
  '/_authed/settings': typeof AuthedSettingsRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/_authed/': typeof AuthedIndexRoute
  '/_authed/clients/$clientId': typeof AuthedClientsClientIdRoute
  '/_authed/clients/$purchasedById': typeof AuthedClientsPurchasedByIdRoute
  '/_authed/clients/new': typeof AuthedClientsNewRoute
  '/_authed/consignments/$concesionarioId': typeof AuthedConsignmentsConcesionarioIdRoute
  '/_authed/consignments/new': typeof AuthedConsignmentsNewRoute
  '/_authed/contracts/new': typeof AuthedContractsNewRoute
  '/_authed/insurance/new': typeof AuthedInsuranceNewRoute
  '/_authed/vehicles/register': typeof AuthedVehiclesRegisterRoute
  '/_authed/clients/': typeof AuthedClientsIndexRoute
  '/_authed/consignments/': typeof AuthedConsignmentsIndexRoute
  '/_authed/contracts/': typeof AuthedContractsIndexRoute
  '/_authed/insurance/': typeof AuthedInsuranceIndexRoute
  '/_authed/vehicles/': typeof AuthedVehiclesIndexRoute
  '/_authed/contracts/$contractId/edit': typeof AuthedContractsContractIdEditRoute
  '/_authed/insurance/$insuranceId/edit': typeof AuthedInsuranceInsuranceIdEditRoute
  '/_authed/vehicles/$vehicleId/edit': typeof AuthedVehiclesVehicleIdEditRoute
  '/_authed/contracts/$contractId/': typeof AuthedContractsContractIdIndexRoute
  '/_authed/insurance/$insuranceId/': typeof AuthedInsuranceInsuranceIdIndexRoute
  '/_authed/vehicles/$vehicleId/': typeof AuthedVehiclesVehicleIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/logout'
    | '/signup'
    | '/calendar'
    | '/settings'
    | '/auth/forgot-password'
    | '/'
    | '/clients/$clientId'
    | '/clients/$purchasedById'
    | '/clients/new'
    | '/consignments/$concesionarioId'
    | '/consignments/new'
    | '/contracts/new'
    | '/insurance/new'
    | '/vehicles/register'
    | '/clients'
    | '/consignments'
    | '/contracts'
    | '/insurance'
    | '/vehicles'
    | '/contracts/$contractId/edit'
    | '/insurance/$insuranceId/edit'
    | '/vehicles/$vehicleId/edit'
    | '/contracts/$contractId'
    | '/insurance/$insuranceId'
    | '/vehicles/$vehicleId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/login'
    | '/logout'
    | '/signup'
    | '/calendar'
    | '/settings'
    | '/auth/forgot-password'
    | '/'
    | '/clients/$clientId'
    | '/clients/$purchasedById'
    | '/clients/new'
    | '/consignments/$concesionarioId'
    | '/consignments/new'
    | '/contracts/new'
    | '/insurance/new'
    | '/vehicles/register'
    | '/clients'
    | '/consignments'
    | '/contracts'
    | '/insurance'
    | '/vehicles'
    | '/contracts/$contractId/edit'
    | '/insurance/$insuranceId/edit'
    | '/vehicles/$vehicleId/edit'
    | '/contracts/$contractId'
    | '/insurance/$insuranceId'
    | '/vehicles/$vehicleId'
  id:
    | '__root__'
    | '/_authed'
    | '/login'
    | '/logout'
    | '/signup'
    | '/_authed/calendar'
    | '/_authed/settings'
    | '/auth/forgot-password'
    | '/_authed/'
    | '/_authed/clients/$clientId'
    | '/_authed/clients/$purchasedById'
    | '/_authed/clients/new'
    | '/_authed/consignments/$concesionarioId'
    | '/_authed/consignments/new'
    | '/_authed/contracts/new'
    | '/_authed/insurance/new'
    | '/_authed/vehicles/register'
    | '/_authed/clients/'
    | '/_authed/consignments/'
    | '/_authed/contracts/'
    | '/_authed/insurance/'
    | '/_authed/vehicles/'
    | '/_authed/contracts/$contractId/edit'
    | '/_authed/insurance/$insuranceId/edit'
    | '/_authed/vehicles/$vehicleId/edit'
    | '/_authed/contracts/$contractId/'
    | '/_authed/insurance/$insuranceId/'
    | '/_authed/vehicles/$vehicleId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthedRoute: typeof AuthedRouteWithChildren
  LoginRoute: typeof LoginRoute
  LogoutRoute: typeof LogoutRoute
  SignupRoute: typeof SignupRoute
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthedRoute: AuthedRouteWithChildren,
  LoginRoute: LoginRoute,
  LogoutRoute: LogoutRoute,
  SignupRoute: SignupRoute,
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authed",
        "/login",
        "/logout",
        "/signup",
        "/auth/forgot-password"
      ]
    },
    "/_authed": {
      "filePath": "_authed.tsx",
      "children": [
        "/_authed/calendar",
        "/_authed/settings",
        "/_authed/",
        "/_authed/clients/$clientId",
        "/_authed/clients/$purchasedById",
        "/_authed/clients/new",
        "/_authed/consignments/$concesionarioId",
        "/_authed/consignments/new",
        "/_authed/contracts/new",
        "/_authed/insurance/new",
        "/_authed/vehicles/register",
        "/_authed/clients/",
        "/_authed/consignments/",
        "/_authed/contracts/",
        "/_authed/insurance/",
        "/_authed/vehicles/",
        "/_authed/contracts/$contractId/edit",
        "/_authed/insurance/$insuranceId/edit",
        "/_authed/vehicles/$vehicleId/edit",
        "/_authed/contracts/$contractId/",
        "/_authed/insurance/$insuranceId/",
        "/_authed/vehicles/$vehicleId/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/logout": {
      "filePath": "logout.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/_authed/calendar": {
      "filePath": "_authed/calendar.tsx",
      "parent": "/_authed"
    },
    "/_authed/settings": {
      "filePath": "_authed/settings.tsx",
      "parent": "/_authed"
    },
    "/auth/forgot-password": {
      "filePath": "auth/forgot-password.tsx"
    },
    "/_authed/": {
      "filePath": "_authed/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/clients/$clientId": {
      "filePath": "_authed/clients/$clientId.tsx",
      "parent": "/_authed"
    },
    "/_authed/clients/$purchasedById": {
      "filePath": "_authed/clients/$purchasedById.tsx",
      "parent": "/_authed"
    },
    "/_authed/clients/new": {
      "filePath": "_authed/clients/new.tsx",
      "parent": "/_authed"
    },
    "/_authed/consignments/$concesionarioId": {
      "filePath": "_authed/consignments/$concesionarioId.tsx",
      "parent": "/_authed"
    },
    "/_authed/consignments/new": {
      "filePath": "_authed/consignments/new.tsx",
      "parent": "/_authed"
    },
    "/_authed/contracts/new": {
      "filePath": "_authed/contracts/new.tsx",
      "parent": "/_authed"
    },
    "/_authed/insurance/new": {
      "filePath": "_authed/insurance/new.tsx",
      "parent": "/_authed"
    },
    "/_authed/vehicles/register": {
      "filePath": "_authed/vehicles/register.tsx",
      "parent": "/_authed"
    },
    "/_authed/clients/": {
      "filePath": "_authed/clients/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/consignments/": {
      "filePath": "_authed/consignments/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/contracts/": {
      "filePath": "_authed/contracts/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/insurance/": {
      "filePath": "_authed/insurance/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/vehicles/": {
      "filePath": "_authed/vehicles/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/contracts/$contractId/edit": {
      "filePath": "_authed/contracts/$contractId/edit.tsx",
      "parent": "/_authed"
    },
    "/_authed/insurance/$insuranceId/edit": {
      "filePath": "_authed/insurance/$insuranceId/edit.tsx",
      "parent": "/_authed"
    },
    "/_authed/vehicles/$vehicleId/edit": {
      "filePath": "_authed/vehicles/$vehicleId/edit.tsx",
      "parent": "/_authed"
    },
    "/_authed/contracts/$contractId/": {
      "filePath": "_authed/contracts/$contractId/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/insurance/$insuranceId/": {
      "filePath": "_authed/insurance/$insuranceId/index.tsx",
      "parent": "/_authed"
    },
    "/_authed/vehicles/$vehicleId/": {
      "filePath": "_authed/vehicles/$vehicleId/index.tsx",
      "parent": "/_authed"
    }
  }
}
ROUTE_MANIFEST_END */
