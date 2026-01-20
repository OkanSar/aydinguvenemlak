export default defineEventHandler(async (event) => {
  const { path } = getRouterParams(event)

  setHeader(event, 'Content-Security-Policy', 'default-src \'none\'; img-src \'self\' data: blob:;')

  return hubBlob().serve(event, path)
})
