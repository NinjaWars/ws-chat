const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

function removeConnectionId(connectionId) { return dynamo.delete({ TableName: 'chat', Key: { connectionid: connectionId } }).promise(); }

exports.handler = (event, context, callback) => { const { connectionId } = event.requestContext; removeConnectionId(connectionId).then(() => { callback(null, { statusCode: 200 }); }); };
