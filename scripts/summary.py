import boto3
import json
import psycopg2
import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain.document_loaders import UnstructuredFileLoader

tokenizer = AutoTokenizer.from_pretrained("pszemraj/pegasus-x-large-book-summary")
model = AutoModelForSeq2SeqLM.from_pretrained("pszemraj/pegasus-x-large-book-summary")
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)

s3_client = boto3.client('s3')

def update_project_summary(project_id, summary):
    conn = psycopg2.connect()

    try:
        with conn.cursor() as cur:
            # Prepare the SQL query to update the project summary
            update_query = "UPDATE project SET summary = %s WHERE id = %s"

            # Execute the query
            cur.execute(update_query, (summary, project_id))

            # Commit the transaction
            conn.commit()
    except Exception as e:
        print("Database error:", e)
        conn.rollback()
    finally:
        conn.close()
        
def lambda_handler(event, context):
    # Parse the event body
    body = json.loads(event['body'])
    project_id = body['projectId']
    key = body['filename']
    
    bucket = "Bucket"  # Replace with your S3 bucket name
    file_path = '/tmp/' + key

    # Download file from S3
    s3_client.download_file(bucket, key, file_path)

    # Load and summarize document
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load()
    result = summarizer(docs[0].page_content, **{
        "max_length": 256,
        "min_length": 8,
        "no_repeat_ngram_size": 3,
        "early_stopping": True,
        "repetition_penalty": 3.5,
        "length_penalty": 0.2,
        "encoder_no_repeat_ngram_size": 3,
        "num_beams": 4,
    })

    summary = result[0]['summary_text']
    print(f"Summarized input: {summary}")

    # Update project summary in the database
    update_project_summary(project_id, summary)

    return {
        'statusCode': 200,
        'body': json.dumps('Summary generated successfully')
    }
