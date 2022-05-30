


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { ConfigService } from '@nestjs/config';


export const databaseProviders = [
  {
    provide: "DYNAMODB",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
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
        credentials: {accessKeyId: configService.get<string>('aws.accessKey'), secretAccessKey: configService.get<string>('aws.secretKey')},
        region: configService.get<string>('aws.region')});

      const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient, translateConfig);

      return ddbDocClient;
    }
  }
];