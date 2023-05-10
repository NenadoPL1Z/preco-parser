import express from "express";
import cors from "cors";
import { PORT, SCHEDULE_UPDATE_INTERVAL } from "@/src/lib/constants/constants";
import bodyParser from "body-parser";
import { API_ERROR_USER_AUTH } from "@/src/lib/constants/api/API_ERROR_NAMESPACES";
import {
  getStaticFolderPath,
  sendErrorResponse,
  sendSuccessResponse,
} from "@/src/lib/services/services";
import { parseUser } from "@/src/lib/services/parser/parseUser";
import { parseSchedule } from "@/src/lib/services/parser/parseSchedule";
import path from "path";

const app = express();

app.use(cors({ origin: "*" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());
app.use(express.static(path.join(getStaticFolderPath(), "static")));

app.get("/", async (req: express.Request, res: express.Response) => {
  res.json("Preco parser");
});

app.post("/auth/login", async (req: express.Request, res: express.Response) => {
  const sendSuccess = sendSuccessResponse(res);
  const sendError = sendErrorResponse(res);

  try {
    const { login, password } = req.body;

    if (login && password) {
      return await parseUser(login, password)
        .then((response) => {
          if (typeof response === "string") {
            return sendSuccess({
              data: {
                userName: response,
                updatedAt: SCHEDULE_UPDATE_INTERVAL,
              },
            });
          }
          sendError(400, API_ERROR_USER_AUTH.INVALID_REQUEST);
        })
        .catch(() => {
          sendError(400, API_ERROR_USER_AUTH.INVALID_REQUEST);
        });
    }
    sendError(400, API_ERROR_USER_AUTH.INVALID_DATA);
  } catch (e) {
    sendError(400, API_ERROR_USER_AUTH.INVALID_REQUEST);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);

  parseSchedule();
  setInterval(parseSchedule, SCHEDULE_UPDATE_INTERVAL);
});
