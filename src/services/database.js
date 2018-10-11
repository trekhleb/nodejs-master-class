/**
 * Library for storing and editing data.
 */

// Dependencies.
const fs = require('fs');
const path = require('path');
const util = require('util');
const jsonStringToObject = require('./jsonStringToObject');

// Promisify file system functions to avoid to callback-inside-callback situation.
const fsOpen = util.promisify(fs.open);
const fsWrite = util.promisify(fs.write);
const fsClose = util.promisify(fs.close);
const fsRead = util.promisify(fs.readFile);
const fsFtruncate = util.promisify(fs.ftruncate);
const fsUnlink = util.promisify(fs.unlink);
const fsReaddir = util.promisify(fs.readdir);

// Container for the module (to be exported).
const database = {};

// Base directory of the data folder.
database.baseDirectory = path.join(__dirname, '/../../.data/');

/**
 * Write date to a file.
 * @param {string} directory
 * @param {string} file
 * @param {*} data
 * @return {Promise}
 */
database.create = async (directory, file, data) => {
  // Open the file for writing.
  const fileDescriptor = await fsOpen(`${database.baseDirectory}${directory}/${file}.json`, 'wx');

  // Convert data to string.
  const stringData = JSON.stringify(data);

  // Write to file and close it.
  await fsWrite(fileDescriptor, stringData);
  await fsClose(fileDescriptor);
};

/**
 * Read data from a file.
 * @param {string} directory
 * @param {string} file
 * @return {Promise}
 */
database.read = async (directory, file) => {
  let data;

  try {
    data = await fsRead(`${database.baseDirectory}${directory}/${file}.json`, 'utf-8');
    data = jsonStringToObject(data);
  } catch (error) {
    data = null;
  }

  return data;
};

/**
 * Update data inside the file.
 * @param {string} directory
 * @param {string} file
 * @param {*} data
 * @return {Promise}
 */
database.update = async (directory, file, data) => {
  // Open the file for writing.
  const fileDescriptor = await fsOpen(`${database.baseDirectory}${directory}/${file}.json`, 'r+');

  // Convert data to string.
  const stringData = JSON.stringify(data);

  // Truncate the file.
  await fsFtruncate(fileDescriptor);

  // Write to the file and close it.
  await fsWrite(fileDescriptor, stringData);

  // Close the file.
  await fsClose(fileDescriptor);
};

/**
 * Delete a file.
 * @param {string} directory
 * @param {string} file
 * @return {Promise}
 */
database.delete = async (directory, file) => {
  await fsUnlink(`${database.baseDirectory}${directory}/${file}.json`);
};

/**
 * List all the items in a directory.
 * @param {string} directory
 * @return {Promise<string[]>}
 */
database.list = async (directory) => {
  const fileNames = await fsReaddir(`${database.baseDirectory}${directory}/`);
  const trimmedFileNames = [];

  fileNames.forEach((fileName) => {
    // Only process *.json files and ignore other files like .gitkeep.
    if (fileName.includes('.json')) {
      trimmedFileNames.push(fileName.replace('.json', ''));
    }
  });

  return trimmedFileNames;
};

// Export the module.
module.exports = database;
