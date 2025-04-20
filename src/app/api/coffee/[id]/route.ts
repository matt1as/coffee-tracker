import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const dynamoDb = DynamoDBDocument.from(new DynamoDB({}));
const TABLE_NAME = process.env.COFFEE_INTAKE_TABLE || 'CoffeeIntake';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await dynamoDb.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId AND #ts = :timestamp',
      ExpressionAttributeNames: {
        '#ts': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':userId': 'default-user', // TODO: Implement user management
        ':timestamp': params.id,
      },
    });

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json(
        { error: 'Coffee entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.Items[0]);
  } catch (error) {
    console.error('Error fetching coffee entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Construct the update expression
    let updateExpression = 'SET ';
    const expressionAttributeValues: Record<string, string | number> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (body.rating !== undefined) {
      updateExpression += '#rating = :rating, ';
      expressionAttributeValues[':rating'] = body.rating;
      expressionAttributeNames['#rating'] = 'rating';
    }

    if (body.location !== undefined) {
      updateExpression += '#location = :location, ';
      expressionAttributeValues[':location'] = body.location;
      expressionAttributeNames['#location'] = 'location';
    }

    // Remove trailing comma and space
    updateExpression = updateExpression.slice(0, -2);

    // If there's nothing to update, return an error
    if (Object.keys(expressionAttributeValues).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const result = await dynamoDb.update({
      TableName: TABLE_NAME,
      Key: {
        userId: 'default-user', // TODO: Implement user management
        timestamp: params.id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    });

    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error('Error updating coffee entry:', error);
    return NextResponse.json(
      { error: 'Failed to update coffee entry' },
      { status: 500 }
    );
  }
}