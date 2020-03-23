const { parse } = require("url")
const increment = require("./increment-views")

exports.handler = async (event, context, callback) => {
  console.log(event.body)
  const { slug } = JSON.parse(event.body)

  if (!slug) callback(null, {
    statusCode: 500,
    body: "Error occured: Missing `slug` parameter"
  })

  console.log(`Started incrementing view counter for ${slug}`)
  const { snapshot } = await increment(slug)
  console.log(`Finished incrementing view counter for ${slug}`)

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      total: snapshot.val()
    })
  })
}
