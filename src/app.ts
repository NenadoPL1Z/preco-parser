import express from "express";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { IS_SKIP_PARSE, PORT } from "./lib/constants/constants";
import { parseSchedule } from "./lib/services/parser/parseSchedule";
import { DataTypes, Sequelize } from "sequelize";
import { getSchedule } from "./lib/services/api/getSchedule";
import { getUser } from "./lib/services/api/getUser";
import { getScheduleTeachers } from "./lib/services/api/getScheduleTeachers";
import { parseTeacher } from "./lib/services/parser/parseTeacher";

const app = express();

export const sequelize = new Sequelize(
  "postgres://admin:omibTSgMhq7VG92uozcDXOsud7UMrg4J@dpg-chgb95u7avjbbju9hui0-a.oregon-postgres.render.com/preco",
  {
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: true,
    },
  },
);
export const ScheduleModel = sequelize.define(
  "Schedule",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    ruUpdateTime: { type: DataTypes.STRING },
    result: { type: DataTypes.STRING(300000) },
  },
  { tableName: "Schedule", freezeTableName: true },
);

export const TeacherModel = sequelize.define(
  "Teacher",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    ruUpdateTime: { type: DataTypes.STRING },
    result: { type: DataTypes.STRING(300000) },
  },
  { tableName: "Teacher", freezeTableName: true },
);

app.use(cors({ origin: "*" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json("Preco parser");
});

app.get("/api/schedule", getSchedule);
app.get("/api/schedule/teacher", getScheduleTeachers);
app.post("/api/auth/login", getUser);

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  if (IS_SKIP_PARSE) {
    console.log("skip parse");
    return;
  } else {
    console.log("parse");

    parseSchedule().finally();
    parseTeacher().finally();
  }
});
