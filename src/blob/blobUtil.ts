const {
    BlobServiceClient,
    AnonymousCredential,
} = require('@azure/storage-blob');

const credentials = new AnonymousCredential();

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;

const getFiles = async (storageAccountURL, containerName) => {

    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // const response = await containerClient.listBlobFlatSegment(undefined, { include: ["metadata", "snapshots"] })

    const blobItems = [];

    for await (const blob of containerClient.listBlobsFlat({includeMetadata: true, includeSnapshots: true})) {
        blobItems.push(blob);
    }

    console.log(blobItems)

    return blobItems;
};

const uploadFile = async (storageAccountURL, containerName, file, callback) => {
    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);

    const step = (file.folder === 'config' && file.name !== 'config/DataDictionary.csv') ? '4' : '1';

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
        onProgress: callback,
        metadata: {
            ...file.metadata,
            step,
        }
    };

    console.log(uploadOptions.metadata)

    return blockBlobClient.uploadData(file.file, uploadOptions)
};

const deleteFile = async (storageAccountURL, containerName, fileName) => {

    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    return blobClient.delete({ deleteSnapshots: 'include' });
};


const downloadFile = async (storageAccountURL, containerName, fileName, snapshot) => {
    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    const response = (snapshot) ? await blobClient.withSnapshot(snapshot).download() : await blobClient.download();

    return response.blobBody;
};

const uploadMetadata = async (storageAccountURL, containerName, fileName, metadata) => {
    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    const response = await blobClient.getProperties();
    const md = response.metadata;

    for (const [key, value] of Object.entries(metadata)) {
        md[key] = value;
    }

    return await blobClient.setMetadata(md);
};

const createSnapshot = async (storageAccountURL, containerName, fileName) => {
    const blobServiceClient = new BlobServiceClient(storageAccountURL, credentials);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    return blobClient.createSnapshot();
};

export {
    getFiles,
    uploadFile,
    deleteFile,
    downloadFile,
    uploadMetadata,
    createSnapshot
};
