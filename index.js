import { statement } from "./src/main.js";
import invoices from "./src/invoices.js";
import plays from "./src/plays.js";

const result = statement(invoices[0], plays);
console.log(result, "result");
