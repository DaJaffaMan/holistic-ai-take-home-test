import boto3
import json
import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain.document_loaders import UnstructuredFileLoader

tokenizer = AutoTokenizer.from_pretrained("pszemraj/pegasus-x-large-book-summary")
model = AutoModelForSeq2SeqLM.from_pretrained("pszemraj/pegasus-x-large-book-summary")
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)

s3_client = boto3.client('s3')
        
def handler(event, context):
    # Parse the event body
    body = json.loads(event['body'])
    project_id = body['projectId']
    key = body['filename']
    
    bucket = "holisticaicodetestjj"  # Replace with your S3 bucket name
    file_path = '/tmp/' + key

    # Download file from S3
    s3_client.download_file(bucket, key)

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


    return {
        'statusCode': 200,
        'body': json.dumps(summary)
    }
