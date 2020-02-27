/* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.helloGET = (req, res) => {
    res.send('Hello from Cloud Functions and Cloud Source Repositories');
  };


const bucketName = 'gs://nemo-tests/';
const filename = 'template-workspaces.json';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function uploadFile(req, res) {
  console.log('Uploading File');
  
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'no-cache'
    },
  });

  console.log(`${filename} uploaded to ${bucketName}.`);
  
  res.send('Uploading Files');
}

uploadFile().catch(console.error);

exports.uploadFile = uploadFile;