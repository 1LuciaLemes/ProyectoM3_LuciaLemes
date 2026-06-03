import { router } from "./router.js";
import { setupLinkInterception, setupPopstateListener } from "./navigation.js";

setupLinkInterception();
setupPopstateListener();
console.log("APP JS CARGADO");
router();