/* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function deployUploadFile(req, res) {
  try {
      const { stdout, stderr } = await exec('curl https://sdk.cloud.google.com');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  }catch (err){
     console.error(err);
  };
  try {
    const { stdout, stderr } = await exec('gcloud beta functions deploy NeMO-source-repositories-test --stage-bucket gs://nemo-tests/ --trigger-http');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }catch (err){
   console.error(err);
};
  res.send(`Deploying Cloud Function`);
};

exports.deployUploadFile = deployUploadFile;

const bucketName = 'gs://nemo-tests/';
const filename = 'NeMO-templates/template-workspaces.json';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function uploadFile(req, res) {
  console.log('Uploading File');
  try {
    const { stdout, stderr } = await exec('git clone https://github.com/broadinstitute/NeMO-templates.git');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }catch (err){
   console.error(err);
  };
  git-force-clone
  
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

  try {
    const { stdout, stderr } = await exec('rm -r NeMO-templates');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }catch (err){
   console.error(err);
  };
  
  res.send(`${filename} uploaded to ${bucketName}.`);
}

uploadFile().catch(console.error);

exports.uploadFile = uploadFile;