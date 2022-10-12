import Ajv from "ajv";
import addFormats from "ajv-formats";
import { habit } from "../habits/schemas";
import { historyQueryParams, history } from "../history/schemas";
import { account } from "../auth/schemas";

export const ajv = new Ajv();

addFormats(ajv);
ajv.addSchema(habit, "habit");
ajv.addSchema(historyQueryParams, "historyQueryParams");
ajv.addSchema(history, "history");
ajv.addSchema(account, "account");
