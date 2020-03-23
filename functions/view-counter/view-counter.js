const { parse } = require("url")
const increment = require("./increment-views")

exports.handler = async (event, context, callback) => {
  console.log(event.body)
  const { slug } = JSON.parse(event.body)

  if (!slug) callback(null, {
    statusCode: 500,
    body: "Error occured: Missing `slug` parameter"
  })

  const { snapshot } = await increment(slug)

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      total: snapshot.val()
    })
  })
}
