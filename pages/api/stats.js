import jwt from "jsonwebtoken";
import { findVideoIdByUser } from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    console.log({ cookies: req.cookies });

    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(403).send({});
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({ decoded });
        const userId = "did:ethr:0x7cb7dD72a5755E6073Da9c098F3796e14bde1941";
        const videoId = "ctlz0R1tSZE";
        const findVideoId = await findVideoIdByUser(token, userId, videoId);
        console.log({ findVideoId });

        res.send({ msg: "It works", decoded, findVideoId });
      }
    } catch (error) {
      console.error("Error occured in /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
