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
const filename = 'template-workspaces.json';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const downloadGitRepo = require('download-git-repo');

/**
 * Clone the github repository.
 *
 * @param {string} repository The repository to download.
 * @param {string} destination The location to write the repository.
 */
function downloadRepo (repository, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${repository} to ${destination}`);
    downloadGitRepo(repository, destination, (err) => {
      if (err) {
        console.error(`Error downloading the ${repository} repository`, err);
        reject(err);
      } else {
        console.log(`Successfully downloaded the ${repository} repository`);
        resolve(destination);
      }
    });
  });
}



async function uploadFile(req, res) {
  console.log('Uploading File');
  // Uploads a local file to the bucket

  const fetch = require('node-fetch');

  let url = "https://raw.githubusercontent.com/broadinstitute/NeMO-templates/master/template-workspaces.json"
  let settings = { method: "Get" };

  fetch(url, settings)
    .then(res => res.json())
      await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        writeFileSync: res.json(),
        metadata: {
          
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: 'no-cache'
        },
      });
    // .then((json) => {
    //   'use strict';
    //   const fs = require('fs');
    //   let data = JSON.stringify(json);
    //   fs.writeFileSync("filename.json", data);
    // });
  

  console.log(`${filename} uploaded to ${bucketName}.`);
  
  res.send('Uploaded File');
}

uploadFile().catch(console.error);

exports.uploadFile = uploadFile;