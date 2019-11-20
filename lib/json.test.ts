import tape = require("tape");
import { camelCaseJSON, snakeCaseJSON } from "../lib";
import { isJSON } from "./json";

tape("isJSON", (assert: tape.Test) => {
  assert.deepEquals(isJSON([]), true);
  assert.deepEquals(isJSON({}), true);
  assert.deepEquals(isJSON(0), true);
  assert.deepEquals(isJSON(""), true);
  assert.deepEquals(isJSON(null), true);
  assert.deepEquals(isJSON(true), true);
  assert.deepEquals(isJSON(undefined), false);
  assert.end();
});

tape("snakeCaseJSON", (assert: tape.Test) => {
  assert.deepEquals(
    snakeCaseJSON({
      snakeCase: "value",
      snakeCaseArray: [
        {
          snakeCase: "value"
        }
      ],
      snakeCaseObject: {
        snakeCase: "value"
      }
    }),
    {
      snake_case: "value",
      snake_case_array: [
        {
          snake_case: "value"
        }
      ],
      snake_case_object: {
        snake_case: "value"
      }
    }
  );
  assert.end();
});

tape("camelCaseJSON", (assert: tape.Test) => {
  assert.deepEquals(
    camelCaseJSON({
      camel_case: "value",
      camel_case_array: [
        {
          camel_case: "value"
        }
      ],
      camel_case_object: {
        camel_case: "value"
      }
    }),
    {
      camelCase: "value",
      camelCaseArray: [
        {
          camelCase: "value"
        }
      ],
      camelCaseObject: {
        camelCase: "value"
      }
    }
  );
  assert.end();
});
