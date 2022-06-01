import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, cleanUpLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  const tmpDir = __dirname + '/tmp/';
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
      res.status(400).send({ message: "image url is missing!" });
    }

    try {
      const filteredPath = await filterImageFromURL(imageUrl, tmpDir);

      res.sendFile(filteredPath, error => {
        if (error) {
          res.status(500).send({ message: "Internal Server Error!", error })
        }

        cleanUpLocalFiles(tmpDir);
      });

    } catch (error) {
      res.status(500).send({ message: "Internal Server Error!", error })
    }
  })


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();