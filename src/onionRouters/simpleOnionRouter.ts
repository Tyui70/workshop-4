import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT,REGISTRY_PORT  } from "../config";
import { generateRsaKeyPair, exportPrvKey, exportPubKey } from "../crypto"; 
import { Node, RegisterNodeBody } from  "../registry/registry";

export async function simpleOnionRouter(nodeId: number) {
  
   
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  // TODO implement the status route
  onionRouter.get("/status", (req, res) => {
    res.send('live');
  });

  let lastReceivedEncryptedMessage: string | null = null;
  let lastReceivedDecryptedMessage: string | null = null;
  let lastMessageDestination: number | null = null;


// routes step 2.1
  onionRouter.get("/getLastReceivedEncryptedMessage", (_, res) => {
    res.json({ result: lastReceivedEncryptedMessage });
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (_, res) => {
    res.json({ result: lastReceivedDecryptedMessage });
  });

  onionRouter.get("/getLastMessageDestination", (_, res) => {
    res.json({ result: lastMessageDestination });
  });


  // step3
  const { privateKey, publicKey } = await generateRsaKeyPair();

  const publicKeyStr = await exportPubKey(publicKey);

  onionRouter.get("/getPrivateKey", async (req, res) => {
    try {
      const privateKeyStr = await exportPrvKey(privateKey);
      res.json({ result: privateKeyStr });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve private key" });
    }
  });

  const registerNode: RegisterNodeBody = {
    nodeId: nodeId,
    pubKey: publicKeyStr
  };

  const registryUrl = http://localhost:${REGISTRY_PORT}/registerNode;
  try {
    await fetch(registryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerNode),
    });
    console.log(Node ${nodeId} successfully registered.);
  } catch (error) {
    console.error(`Failed to register Node ${nodeId}: `);
  }

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${
        BASE_ONION_ROUTER_PORT + nodeId
      }`
    );
  });

  return server;
}
