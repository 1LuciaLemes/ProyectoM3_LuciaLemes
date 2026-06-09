import { router } from "./router.js";
import { setupLinkInterception, setupPopstateListener } from "./navigation.js";

setupLinkInterception();
setupPopstateListener();
router();
console.log("APP JS CARGADO");