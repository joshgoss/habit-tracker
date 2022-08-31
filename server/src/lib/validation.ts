import Ajv from "ajv";
import { habit } from "../habits/schemas";

export const ajv = new Ajv();

ajv.addSchema(habit, "habit");
