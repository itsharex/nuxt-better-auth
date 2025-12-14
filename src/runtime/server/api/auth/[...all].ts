import type { H3Event } from 'h3'
import { defineEventHandler, toWebRequest } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const auth = await serverAuth()
  return auth.handler(toWebRequest(event))
})
