import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { HashLinkers, Tables } from "src/common/constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./models/user.model";
import { FindOneParams } from "./dto/FindOneParams.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ddbDocClient } from "../core/db/db.dynamo";
import { generateUpdateQuery } from "../common/utils/dynamoHelpers";


export class UserRepository {


  async create(data: CreateUserDto): Promise<User> {

    const newUser = new User(data);


    const params = {
      TableName: Tables.TestUser,
      Item: newUser,
      ConditionExpression: "attribute_not_exists(email)",
      ReturnValues: "NONE"
    };

    await ddbDocClient.send(new PutCommand(params));


    return newUser;
  }

  async list(): Promise<User[]> {

    const startDate = new Date();
    startDate.setFullYear( startDate.getFullYear() - 10 );

    const test = {
      "email": "test1@test.com",
      "hashLinker": "USER",
      "createdAt": "2022-05-30T08:26:38.522Z"
    }

    const params = {
      TableName: Tables.TestUser,
      IndexName: 'gsi_0',
      KeyConditionExpression: "createdAt BETWEEN :start_date AND :end_date and hashLinker = :hashLinker",
      ExpressionAttributeValues: {
        ":start_date": startDate.toISOString(),
        ":end_date": new Date().toISOString(),
        ":hashLinker": HashLinkers.USER
      },
      Limit: 1,
      ExclusiveStartKey: test
    };

    const result = await ddbDocClient.send(new QueryCommand(params));

    return result.Items as User[];
  }

  async getOne(data: FindOneParams): Promise<User> {


    const { email } = data;

    const params = { TableName: Tables.TestUser, Key: { email } };

    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item as User;


  }

  async update(email, dto: UpdateUserDto): Promise<User> {


    const expression = generateUpdateQuery(dto);

    const params = {
      TableName: Tables.TestUser,
      Key: { email: email },
      ...expression,
      ReturnValues: "ALL_NEW"
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));

    return result.Attributes as User;


  }

  async delete(email: string): Promise<void> {

    const params = { TableName: Tables.TestUser, Key: { email } };
    await ddbDocClient.send(new DeleteCommand(params));


    return;
  }
}
