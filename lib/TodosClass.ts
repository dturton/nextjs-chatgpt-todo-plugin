import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";

const redis = new KeyvRedis(process.env.KV_URL!);
interface Todo {
  [key: string]: string;
}
type TodosType = Todo[];

class TodosClass {
  todos: TodosType = [];
  keyv: Keyv<TodosType, Record<string, unknown>>;

  constructor() {
    this.keyv = new Keyv({ store: redis });
    this.keyv.on("error", (err) =>
      console.error("Keyv connection error:", err)
    );
    this.keyv.on("ready", () => console.log("Keyv is ready!"));
    this.keyv.on("connectionError", (err) =>
      console.error("Keyv connection error:", err)
    );
  }

  createTodo = (todo: Todo) => {
    this.keyv.set("todos", [...this.todos, todo]);
    this.todos = [...this.todos, todo];
  };
  async getTodos(): Promise<TodosType> {
    return (await this.keyv.get("todos")) || [];
  }
  deleteTodo(todo: Todo): void {
    //delete the todo
    this.todos = this.todos.filter((t) => t.id !== todo.id);
    this.keyv.set("todos", this.todos);
  }
}

const Todos = new TodosClass();

export { Todos };
