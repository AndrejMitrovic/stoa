import express from "express";
import bodyParser from "body-parser";
import { LedgerStorage } from "./modules/storage/LedgerStorage";

class Stoa {
    public stoa: express.Application;

    public ledger_storage: LedgerStorage;

    constructor (file_name: string) {
        this.stoa = express();
        // parse application/x-www-form-urlencoded
        this.stoa.use(bodyParser.urlencoded({ extended: false }))
        // parse application/json
        this.stoa.use(bodyParser.json())
        // create blockStorage
        this.ledger_storage = new LedgerStorage(file_name, (err: Error | null) =>
        {
            if (err != null)
            {
                console.error(err);
                throw new Error(err.message);
            }
        });

        this.stoa.get("/validators",
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.send(req.query.height);
        });

        this.stoa.get("/validator/:address",
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.send(req.params.address + ':' + req.query.height);
        });

        /**
         * When a request is received through the `/push` handler
         * JSON block data is parsed and stored on each storage.
         */
        this.stoa.post("/push",
            (req: express.Request, res: express.Response, next: express.NextFunction) => {

            var block: any;
            if (req.body.block == undefined)
            {
                res.status(400).send("Missing 'block' object in body");
                return;
            }

            try {
                block = JSON.parse(req.body.block);
            } catch(e) {
                res.status(400).send("Not a valid JSON format");
                return;
            }

            console.log(block);

            this.ledger_storage.putBlocks(block, (err: any) =>
            {
                if (err != null)
                {
                    console.error("Failed to store the payload of a push to the DB: " + err);
                    res.status(500).send("An error occurred while saving");
                    return;
                }
                else
                {
                    res.status(200).send();
                    return;
                }
            });
        });
    }
}
export default Stoa;
