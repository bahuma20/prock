# Backend for the prock app.
Main purpose is converting submissions to PDF files and upload them via SFTP to an external storage.

## Authentication
All endpoints are saved via basic auth. The user and password can be
set via environment variables.

## Access
The server is running on `0.0.0.0:8080`.

## Viewer
Renders a submission as HTML that can then be converted to pdf

Accessible via `/viewer/index.html?submission={submissionId}&form={formId}`


## Webhook
Downloads the PDF from the pdf server, which displays the viewer, and uploads it via SFTP to a server.

POST to `/api/webhook` with a body that contains at minimal:
```json
{
  "submission": {
    "form": "asdfahskdfhaksdfjh",
    "_id": "asdhfsadkfjahsdkfj"
  }
}
```

## Environment variables
- DB_URL [mongodb://my-server.host.example.com:27017]: URL of the mongodb server
- DB_NAME [formio]: The name of the database
- BASIC_AUTH_USERNAME [admin]: Username that secures all urls
- BASIC_AUTH_PASSWORD [admin]: Password that secures all urls
- PDF_SERVER_URL [https://pdfserver.example.com]: The host of the server where url-to-pdf is running
- BACKEND_SERVER_URL [http://prock:8080]: The host at which this app is accessible from the PDF server. Authentication is automatically added.
- SFTP_HOST [my-server.example.com]
- SFTP_PORT [22]
- SFTP_USER [root]
- SFTP_PASSWORD [12345]
- SFTP_DIRECTORY [/var/www/vhosts/bahuma.io/httpdocs/dev/prockpdf/]: Absolute path to the folder on the server where the pdfs should be stored.


## Running the server
- `npm install`
- `docker build .`
- `docker run .` (don't forget to pass environment variables)
