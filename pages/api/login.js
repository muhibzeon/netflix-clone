import { isNewUser } from "../../lib/db/hasura";
import { magicAdmin } from "../../lib/magic";
import Jwt from "jsonwebtoken";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;

      const didToken = auth ? auth.substr(7) : "";
      //console.log(didToken);

      //get the metadata did, issuer and email from magic server side api
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log({ metadata });

      const token = Jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        "thisisasecretfrommagdeburgandaanewthesisofanewday1234"
      );

      console.log({ token });

      const isNewUserQuery = await isNewUser(token);
      res.send({ done: true, isNewUserQuery });
    } catch (error) {
      console.log("Something went wrong logging in!", error);
      res.status(500).send({ doneInCatch: false });
    }
  } else {
    res.send({ doneHere: false });
  }
}
