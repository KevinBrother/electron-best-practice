import type { BrowserWindowConstructorOptions } from "electron";

export type TOpenConfig = BrowserWindowConstructorOptions & { filePath: string, id: string };