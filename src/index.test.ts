import * as tape from "tape";
import { transformKeysJSON, isJSON, IAsJSON } from ".";

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

tape("as json", (assert: tape.Test) => {
  class Entity {
    id: number;
    name: string;
    children: Entity[];
    createdAt: Date;
  }

  type IEntityJSON = IAsJSON<Entity>;

  function fromJSON(json: IEntityJSON): Entity {
    return {
      id: json.id,
      name: json.name,
      children: json.children.map(fromJSON),
      createdAt: new Date(json.createdAt),
    };
  }

  const json: IEntityJSON = {
    id: 1,
    name: "root",
    children: [
      {
        id: 2,
        name: "child",
        children: [],
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ],
    createdAt: "2020-01-01T00:00:00.000Z",
  };
  const entity = fromJSON(json);

  assert.deepEquals(entity, {
    id: 1,
    name: "root",
    children: [
      {
        id: 2,
        name: "child",
        children: [],
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      },
    ],
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
  });
  assert.end();
});
