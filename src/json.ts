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

export function transformKeysJSON(
  json: IJSON,
  transformKey: (key: string) => string
): IJSON {
  if (isJSONArray(json)) {
    return json.map((value) => transformKeysJSON(value, transformKey));
  } else if (isJSONObject(json)) {
    return Object.keys(json).reduce<IJSONObject>((acc, key) => {
      acc[transformKey(key)] = transformKeysJSON(json[key], transformKey);
      return acc;
    }, {});
  } else {
    return json;
  }
}

export function camelCaseJSON(json: IJSON): IJSON {
  return transformKeysJSON(json, camelCase);
}

export function snakeCaseJSON(json: IJSON): IJSON {
  return transformKeysJSON(json, snakeCase);
}

export const underscoreJSON = snakeCaseJSON;
