import { describe, it, expect, beforeEach, expectTypeOf } from "vitest";
import {
    getLastTenMessages,
    getAllMessages,
    addIAMessage,
    addUserMessage,
    normalizePath,
    resetHistory
} from "../src/utils.js"

describe("Utils functions para test", () =>{
    // limpio el historial para cada test
    beforeEach(() => {
        resetHistory();
    });

    // Creo variables para cada personaje
    const hermione = {key: "Hermione"};

    it("addUserMessage agrega un mensaje del usuario", ()=>{
        addUserMessage("Hola", hermione);
        const messages = getLastTenMessages(hermione);
        expect(messages.length).toBe(1);
        expect(messages[0]).toEqual({ role: "user", content: "Hola" });
    });

    it("addUserMessage no agrega mensajes vacíos", () => {
        addUserMessage("   ", hermione);
        const messages = getLastTenMessages(hermione);
        expect(messages.length).toBe(0);
    })

    it("addIAMessage agrega una respuesta de la IA", () =>{
        addIAMessage("Hola, está respondiendo Hermione", hermione);
        const messages = getLastTenMessages(hermione);
        expect(messages.length).toBe(1);
        expect(messages[0]).toEqual({role: "model", content: "Hola, está respondiendo Hermione"});
    });

    it("Flujo completo (user + IA", () => {
        addUserMessage("Hola Hermione", hermione);
        addIAMessage("Hola, en qué puedo ayudarte?", hermione);
        const messages = getLastTenMessages(hermione);
        expect(messages.length).toBe(2);
        expect(messages[0]).toEqual({role: "user", content: "Hola Hermione"});
        expect(messages[1]).toEqual({role: "model", content: "Hola, en qué puedo ayudarte?"});
    })

    it("getAllMessages devuelve todos los mensajes", () => {
        addUserMessage("Hola 1", hermione);
        addIAMessage("Respuesta 1", hermione);
        addUserMessage("Hola 2", hermione);
        const all = getAllMessages(hermione);
        expect(all.length).toBe(3);
        expect(all).toEqual([
            {role: "user", content: "Hola 1"},
            {role: "model", content: "Respuesta 1"},
            {role: "user", content: "Hola 2"}
        ])
    })

    it("normalizePath devuelve la ruta correcta, corrige el último /", () => {
        const path = normalizePath("/home/");
        expect(path).toBe("/home");
    })
});