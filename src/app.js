import { router } from "./router.js";
import { setupLinkInterception, setupPopstateListener } from "./navigation.js";

router();
setupLinkInterception();
setupPopstateListener();
console.log("APP JS CARGADO");