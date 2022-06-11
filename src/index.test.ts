import * as tape from "tape";
import { transformKeysJSON, isJSON } from ".";

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

tape("transformKeysJSON", (assert: tape.Test) => {
  assert.deepEquals(
    transformKeysJSON(
      {
        snakeCase: "value",
        snakeCaseArray: [
          {
            snakeCase: "value",
          },
        ],
        snakeCaseObject: {
          snakeCase: "value",
        },
      },
      (key: string) =>
        (
          key.match(
            /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
          ) || []
        )
          .join("_")
          .toLowerCase()
    ),
    {
      snake_case: "value",
      snake_case_array: [
        {
          snake_case: "value",
        },
      ],
      snake_case_object: {
        snake_case: "value",
      },
    }
  );
  assert.end();
});
