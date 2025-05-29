// src/ssr.tsx
/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/react-start/router-manifest'

import { createRouter } from './router'
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)
