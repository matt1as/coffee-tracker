import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { CoffeeIntake } from '@/types/coffee';

const dynamoDb = DynamoDBDocument.from(new DynamoDB({}));
const TABLE_NAME = process.env.COFFEE_INTAKE_TABLE || 'CoffeeIntake';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CoffeeIntake;
    
    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding coffee entry:', error);
    return NextResponse.json(
      { error: 'Failed to add coffee entry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': 'default-user', // TODO: Implement user management
      },
      ScanIndexForward: false, // Sort in descending order (newest first)
      Limit: 10, // Get last 10 entries
    });

    return NextResponse.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching coffee entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee entries' },
      { status: 500 }
    );
  }
}