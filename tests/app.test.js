import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage } from "../src/services/chatService.js";
import { getLastTenMessages, resetHistory } from "../src/utils.js";

describe("Test de la función fetch completo", () => {
  const hermione = { key: "Hermione" };

  beforeEach(() => {
    resetHistory();
  });

  it("Devuelve la respuesta de la IA al mensaje recibido", async () => {
    // Mock de fetch para simular la respuesta de la API
    global.fetch = vi.fn((async) => ({
      ok: true,
      json: (await) => ({
        reply: "Hola, en qué puedo ayudarte?",
      }),
    }));

    const reply = await sendMessage("Hola", hermione); // Ejecuto sendMessage con el mensaje 'Hola' y obtengo la respuesta
    expect(reply).toBe("Hola, en qué puedo ayudarte?");

    await sendMessage("Hola", hermione); // Llamo a la función, de esta forma uso el fetch
  });

  it("Chequeo que el método es POST", async () => {
    global.fetch = vi.fn((async) => ({
      ok: true,
      json: (await) => ({
        reply: "Respuesta de la IA",
      }),
    }));

    // Llamo a la función para que utilice el fetch, así ver si es correcta
    await sendMessage("Hola", hermione);

    // toHaveBeenCalledWhit verifica que fetch fue llamado con la URL correcta y objectContaining con el método correcto
    expect(fetch).toHaveBeenCalledWith(
      "/api/functions",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});

describe("Inicialización de la app", () => {
  it("debería cargar app sin errores", () => {
    expect(true).toBe(true);
  });
});
