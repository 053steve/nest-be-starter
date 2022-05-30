


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

console.log('yo');
console.log(configService.get(configService.get('aws.secretKey')));

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: true, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const dynamoClient = new DynamoDBClient({
  credentials: {accessKeyId: 'AKIA4TE3UEKMNTJDHORG', secretAccessKey: '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'},
  region: 'ap-southeast-1'});

const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient, translateConfig);




export { ddbDocClient }