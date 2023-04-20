const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

// require('./patch.js');
require('aws-sdk/lib/node_loader');
const AWSL = require('aws-sdk/lib/core');

const { Service } = AWSL;
const { apiLoader } = AWSL;
apiLoader.services.apigatewaymanagementapi = {};
AWSL.ApiGatewayManagementApi = Service.defineService('apigatewaymanagementapi', ['2018-11-29']);
Object.defineProperty(apiLoader.services.apigatewaymanagementapi, '2018-11-29', {
  get: function get() {
    const model = {
      metadata: {
        apiVersion: '2018-11-29',
        endpointPrefix: 'execute-api',
        signingName: 'execute-api',
        serviceFullName: 'AmazonApiGatewayManagementApi',
        serviceId: 'ApiGatewayManagementApi',
        protocol: 'rest-json',
        jsonVersion: '1.1',
        uid: 'apigatewaymanagementapi-2018-11-29',
        signatureVersion: 'v4',
      },
      operations: {
        PostToConnection: {
          http: { requestUri: '/@connections/{connectionId}', responseCode: 200 },
          input: {
            type: 'structure', members: { Data: { type: 'blob' }, ConnectionId: { location: 'uri', locationName: 'connectionId' } }, required: ['ConnectionId', 'Data'], payload: 'Data',
          },
        },
      },
      shapes: {},
    };
    model.paginators = {
      pagination: {},
    };
    return model;
  },
  enumerable: true,
  configurable: true,
});

let send;
function init(event) {
  console.log(event);
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`,

  });

  send = async (connectionId, data) => {
    await apigwManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: `Echo: ${data}`,

    }).promise();
  };
}

function getConnections() {
  return ddb.scan({ TableName: 'chat' }).promise();
}

exports.handler = (event, context, callback) => {
  init(event);
  if (!event || !event.body) {
    throw new Error('No message available in the body');
  }
  const bodyContent = JSON.parse(event.body) || {};
  const { message } = bodyContent;
  console.info('Message was:', message);
  getConnections().then((data) => {
    console.log('data.Items was: ', data.Items);
    data.Items.forEach((connection) => {
      console.log(`Connection ${connection.connectionid}`);
      send(connection.connectionid, message);
    });
  });
  return {
  };
};
