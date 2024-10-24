import { S3CreateEvent, S3Handler } from "aws-lambda";
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler: S3Handler = async (event: S3CreateEvent): Promise<void> =>  {
    console.log('Received S3 event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;
  
      try {
        const s3Object = await s3.getObject({
          Bucket: bucketName,
          Key: objectKey,
        }).promise();
  
        console.log(`Successfully retrieved object: ${objectKey} from bucket: ${bucketName}`);
  
        // Process object here (e.g., log its content, process its data, etc.)
        const objectData = s3Object.Body?.toString('utf-8');
        console.log(`Object content: ${objectData}`);  
      }
      catch (error) {
        console.error(`Error retrieving or processing object ${objectKey} from bucket ${bucketName}`, error);
        throw error;
      }
    }
};
  