import camelCase = require("camel-case");
import snakeCase = require("snake-case");
import { isArray, isNull, isNumber, isString } from "util";

export type IJSON = null | number | string | IJSONArray | IJSONObject;
export interface IJSONArray extends Array<IJSON> {}
export interface IJSONObject extends Record<string, IJSON> {}

export function isJSON(value: any): value is IJSON {
  return (
    isNull(value) ||
    isString(value) ||
    isNumber(value) ||
    isJSONArray(value) ||
    isJSONObject(value)
  );
}

export function isJSONArray(value: any): value is IJSONArray {
  return isArray(value);
}

export function isJSONObject(value: any): value is IJSONObject {
  return value !== null && typeof value === "object";
}

export const camelCaseJSON = (json: IJSON): IJSON => {
  if (isJSONArray(json)) {
    return json.map(camelCaseJSON);
  } else if (isJSONObject(json)) {
    return Object.keys(json).reduce(
      (acc, key) => {
        acc[camelCase(key)] = camelCaseJSON(json[key]);
        return acc;
      },
      {} as IJSONObject
    );
  } else {
    return json;
  }
};

export const snakeCaseJSON = (json: IJSON): IJSON => {
  if (isJSONArray(json)) {
    return json.map(snakeCaseJSON);
  } else if (isJSONObject(json)) {
    return Object.keys(json).reduce(
      (acc, key) => {
        acc[snakeCase(key)] = snakeCaseJSON(json[key]);
        return acc;
      },
      {} as IJSONObject
    );
  } else {
    return json;
  }
};

export const underscoreJSON = snakeCaseJSON;
