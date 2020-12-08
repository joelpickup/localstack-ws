const AWS = require("aws-sdk");

const endpoint =
  process.env.WEBSOCKETS_API_URL || process.env.LOCALSTACK_HOSTNAME;

const gateway = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint,
});

module.exports.handler = async function (event, context, callback) {
  console.log("lambda event:", event, callback, context);

  const response = {
    statusCode: 200,
    headers: {
      "Sec-WebSocket-Protocol": "graphql-ws",
    },
    body: "",
  };

  if (event.requestContext.routeKey === "$connect") {
    return response;
  }

  await gateway
    .postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: JSON.stringify({ type: "test" }),
    })
    .promise()
    .then(() => console.log("posted"))
    .catch((e) => console.log(e));

  return response;
};
