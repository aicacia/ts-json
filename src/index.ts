export type IJSON = null | number | string | boolean | IJSONArray | IJSONObject;
export type IJSONArray = IJSON[];
export type IJSONObject = { [key: string]: IJSON };

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
  return value !== null && typeof value === "object";
}

export function transformKeysJSON(
  json: IJSON,
  transformKey: (key: string) => string
): IJSON {
  if (isJSONArray(json)) {
    return json.map((value) => transformKeysJSON(value, transformKey));
  } else if (isJSONObject(json)) {
    return Object.entries(json).reduce<IJSONObject>(
      (jsonObject, [key, value]) => {
        jsonObject[transformKey(key)] = transformKeysJSON(value, transformKey);
        return jsonObject;
      },
      {}
    );
  } else {
    return json;
  }
}
