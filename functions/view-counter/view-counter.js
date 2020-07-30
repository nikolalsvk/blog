const increment = require("./increment-views")

exports.handler = async (event, context) => {
  console.log(event.body)
  const { slug } = JSON.parse(event.body)

  if (!slug) {
    return {
      statusCode: 500,
      body: "Error occured: Missing `slug` parameter",
    }
  }

  console.log(`Started incrementing view counter for ${slug}`)
  const { snapshot } = await increment(slug)
  console.log(`Finished incrementing view counter for ${slug}`)

  const responseObject = {
    statusCode: 200,
    body: JSON.stringify({
      total: snapshot.val(),
    }),
  }

  if (process.env.ENABLE_CORS)
    responseObject.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    }

  return responseObject
}
