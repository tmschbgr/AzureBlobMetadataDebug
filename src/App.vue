<template>
  <v-app>
    Hello,

    <v-text-field
      v-model="storageAccount"
      label="Storage Account"
    ></v-text-field>
    <v-text-field v-model="containerName" label="Container"></v-text-field>
    <v-text-field v-model="sas" label="SAS token"></v-text-field>

    <file-upload
      accept=".csv"
      :size="1024 * 1024 * 10"
      drop="#app"
      @input="inputUpdate"
      :drop-directory="true"
      ref="upload"
      class="pointer"
    >
      <v-btn color="primary" depressed>Upload Test File</v-btn>
    </file-upload>

    Result: {{result}}
  </v-app>
</template>

<script>
import FileUpload from "vue-upload-component";
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";

export default {
  name: "App",
  components: {
    FileUpload,
  },
  data: () => ({
    newFiles: [],
    storageAccount: "",
    containerName: "",
    sas:
      "",
      result: {}
  }),
  methods: {
    async inputUpdate(files) {
      const file = files[0];

      const ONE_MEGABYTE = 1024 * 1024;
      const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;

      const storageAccountURL = `https://${this.storageAccount}.blob.core.windows.net?${this.sas}`;

      const landingFile = "test/test.csv";

      const credentials = new AnonymousCredential();

      const blobServiceClient = new BlobServiceClient(
        storageAccountURL,
        credentials
      );
      const containerClient = blobServiceClient.getContainerClient(
        this.containerName
      );
      const blockBlobClient = containerClient.getBlockBlobClient(landingFile);

      const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
        metadata: {
          test: "test1",
          step: "lest",
          autoupload: "true",
        },
      };

      console.log(file)

      await blockBlobClient.uploadData(file.file, uploadOptions);

      const props = await blockBlobClient.getProperties();

      console.log(props);

      let blobItem;

      for await (const blob of containerClient.listBlobsFlat({
        includeMetadata: true,
        includeSnapshots: true,
      })) {
        if(blob.name === landingFile)
        blobItem = blob;
      }

      this.result = blobItem.metadata
    },
  },
  computed: {},
  mounted() {},
  created() {},
};
</script>