import { Router } from 'itty-router'
import { DefaultController, HomeController } from './app/Controllers'
import { Link as LinkApi, Metric as MetricApi } from './app/Api'
import {
  verifyReferer,
  verifyJsonContentType,
  withContent,
  setHeaders,
} from './app/Middlewares'

const router = Router()
const apiRouter = Router({
  base: '/api/v1',
})

apiRouter
  .get('/metrics', verifyReferer, MetricApi.getSummary)
  .post('/links', verifyReferer, verifyJsonContentType, LinkApi.check)

router
  .all('*', withContent)
  .all('/api/v1/*', apiRouter.handle)
  .get('/manifest.webmanifest', DefaultController.viewManifestWebmanifest)
  .get('/browserconfig.xml', DefaultController.viewBrowserConfigXml)
  .get('/', HomeController.index)
  .get('/about', DefaultController.about)
  .get('*', DefaultController.index)

export const handleEvent = (event: FetchEvent): Promise<Response> => {
  return router
    .handle(event.request, event)
    .catch(async (error: Error): Promise<Response> => {
      console.log(error.message || error.toString())
      const statusCode = error.status || 500

      let data = { message: error.message }
      if (statusCode === 422) {
        data = event.request.content
      }

      return new Response(
        JSON.stringify({
          success: false,
          status: statusCode,
          data,
        }),
        {
          status: statusCode,
          statusText: error.message,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
    })
    .then(setHeaders.bind(null, event))
}

export const handleScheduled = (event: ScheduledEvent): Promise<boolean> => {
  return new Promise((resolved) => {
    event.waitUntil(MetricApi.updateMeasures())
    resolved(true)
  })
}
