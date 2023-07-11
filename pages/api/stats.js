import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

import { verifyToken } from "../../lib/utils";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function stats(req, resp) {
  try {
    const token = req.cookies.token;
    if (!token) {
      resp.status(403).send({});
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;
      if (videoId) {
        const userId = await verifyToken(token);
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            resp.send({ data: response });
          } else {
            // add it
            console.log({ watched, userId, videoId, favourited });
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            resp.send({ data: response });
          }
        } else {
          if (doesStatsExist) {
            resp.send(findVideo);
          } else {
            resp.status(404);
            resp.send({ user: null, msg: "Video not found" });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error occurred /stats", error);
    resp.status(500).send({ done: false, error: error?.message });
  }
}

// export default async function stats(req, resp) {
//   if (req.method === "POST") {
//     try {
//       const token = req.cookies.token;
//       if (!token) {
//         resp.status(403).send({});
//       } else {
//         const { videoId } = req.body;
//         console.log(videoId);

//         if (videoId) {
//           const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//           const userId = decodedToken.issuer;
//           const findVideo = await findVideoIdByUser(token, userId, videoId);
//           const doesStatsExist = findVideo?.length > 0;

//           const { favourited, watched = true } = req.body;
//           if (doesStatsExist) {
//             // update it
//             const response = await updateStats(token, {
//               watched,
//               userId,
//               videoId,
//               favourited,
//             });
//             resp.send({ data: response });
//           } else {
//             // add it
//             const response = await insertStats(token, {
//               watched,
//               userId,
//               videoId,
//               favourited,
//             });
//             resp.send({ data: response });
//             resp.end();
//           }
//         } else {
//           resp.status(500).send({ msg: "videoId is required" });
//           resp.end();
//         }
//       }
//     } catch (error) {
//       console.error("Error occurred /stats", error);
//       resp.status(500).send({ done: false, error: error?.message });
//     }
//   } else {
//     const token = req.cookies.token;
//     if (!token) {
//       resp.status(403).send({});
//     } else {
//       const { videoId } = req.query;
//       if (videoId) {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//         const userId = decodedToken.issuer;
//         const findVideo = await findVideoIdByUser(token, userId, videoId);
//         const doesStatsExist = findVideo?.length > 0;
//         console.log(findVideo);

//         if (doesStatsExist) {
//           resp.status(200).json({ findVideo });
//         } else {
//           resp.status(404).json({ user: null, msg: "Video not found" });
//           resp.end();
//         }
//       }
//     }
//   }
// }
