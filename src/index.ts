import { handleEvent, handleScheduled } from './handler'

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleEvent(event))
})

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(handleScheduled(event))
})
