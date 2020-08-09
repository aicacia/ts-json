import { camelCase } from "camel-case";
import { snakeCase } from "snake-case";

export type IJSON = null | number | string | boolean | IJSONArray | IJSONObject;
export interface IJSONArray extends Array<IJSON> {}
export interface IJSONObject extends Record<string, IJSON> {}

export function isJSON(value: any): value is IJSON {
  const type = typeof value;
  return (
    value === null ||
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    isJSONArray(value) ||
    isJSONObject(value)
  );
}

export function isJSONArray(value: any): value is IJSONArray {
  return Array.isArray(value);
}

export function isJSONObject(value: any): value is IJSONObject {
  return value != null && typeof value === "object";
}

export const transformKeysJSON = (
  transformKey: (key: string) => string,
  json: IJSON
): IJSON => {
  if (isJSONArray(json)) {
    return json.map((value) => transformKeysJSON(transformKey, value));
  } else if (isJSONObject(json)) {
    return Object.keys(json).reduce((acc, key) => {
      acc[transformKey(key)] = transformKeysJSON(transformKey, json[key]);
      return acc;
    }, {} as IJSONObject);
  } else {
    return json;
  }
};

export const camelCaseJSON = (json: IJSON): IJSON =>
  transformKeysJSON(camelCase, json);

export const snakeCaseJSON = (json: IJSON): IJSON =>
  transformKeysJSON(snakeCase, json);

export const underscoreJSON = snakeCaseJSON;
