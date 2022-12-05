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
    age?: number;
    childMap: Map<number, Entity>;
    childSet: Set<Entity>;
    childArray: Array<Entity>;
    createdAt: Date;

    constructor(
      id: number,
      name: string,
      age: number | undefined,
      childMap: Map<number, Entity>,
      childSet: Set<Entity>,
      childArray: Array<Entity>,
      createdAt: Date
    ) {
      this.id = id;
      this.name = name;
      this.age = age;
      this.childMap = childMap;
      this.childSet = childSet;
      this.childArray = childArray;
      this.createdAt = createdAt;
    }
  }

  type IEntityJSON = IAsJSON<Entity>;

  function fromJSON(json: IEntityJSON): Entity {
    return new Entity(
      json.id,
      json.name,
      json.age,
      Object.entries(json.childMap).reduce((acc, [id, child]) => {
        acc.set(+id, fromJSON(child));
        return acc;
      }, new Map()),
      new Set(json.childSet.map((child) => fromJSON(child))),
      json.childArray.map((child) => fromJSON(child)),
      new Date(json.createdAt)
    );
  }

  const json: IEntityJSON = {
    id: 1,
    name: "root",
    childMap: {
      2: {
        id: 2,
        name: "child",
        age: 1,
        childMap: {},
        childSet: [],
        childArray: [],
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    },
    childArray: [
      {
        id: 2,
        name: "child",
        age: 1,
        childMap: {},
        childSet: [],
        childArray: [],
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ],
    childSet: [
      {
        id: 2,
        name: "child",
        age: 1,
        childMap: {},
        childSet: [],
        childArray: [],
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ],
    createdAt: "2020-01-01T00:00:00.000Z",
  };
  const entity = fromJSON(json);

  assert.deepEquals(
    entity,
    new Entity(
      1,
      "root",
      undefined,
      new Map([
        [
          2,
          new Entity(
            2,
            "child",
            1,
            new Map(),
            new Set(),
            [],
            new Date("2020-01-01T00:00:00.000Z")
          ),
        ],
      ]),
      new Set([
        new Entity(
          2,
          "child",
          1,
          new Map(),
          new Set(),
          [],
          new Date("2020-01-01T00:00:00.000Z")
        ),
      ]),
      [
        new Entity(
          2,
          "child",
          1,
          new Map(),
          new Set(),
          [],
          new Date("2020-01-01T00:00:00.000Z")
        ),
      ],
      new Date("2020-01-01T00:00:00.000Z")
    )
  );
  assert.end();
});
