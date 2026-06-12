"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  computeStats,
  type BancaStats,
  type Bet,
  type BetInput,
  type BetStatus,
} from "./types";

const STORAGE_KEY = "bet-tracker:state:v3";

type State = {
  hydrated: boolean;
  bancaInicial: number;
  bets: Bet[];
};

const SERVER_STATE: State = { hydrated: false, bancaInicial: 0, bets: [] };

let state: State = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ bancaInicial: state.bancaInicial, bets: state.bets }),
  );
}

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
  persist();
}

// Descarta entradas malformadas (ex.: dados de um schema anterior).
function isValidBet(b: unknown): b is Bet {
  if (!b || typeof b !== "object") return false;
  const x = b as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.match === "string" &&
    typeof x.date === "string" &&
    typeof x.odds === "number" &&
    typeof x.stake === "number"
  );
}

function loadFromStorage() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<State>) : {};
    const bets = Array.isArray(parsed.bets)
      ? parsed.bets.filter(isValidBet)
      : [];
    state = {
      hydrated: true,
      bancaInicial: Number(parsed.bancaInicial) || 0,
      bets,
    };
  } catch {
    state = { hydrated: true, bancaInicial: 0, bets: [] };
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  loadFromStorage(); // hidrata na primeira inscrição (cliente)
  // Mantém abas em sincronia.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      hydrated = false;
      loadFromStorage();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return SERVER_STATE;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// --- API de mutação (funções estáveis a nível de módulo) ---
const actions = {
  setBancaInicial(value: number) {
    setState({ bancaInicial: Number.isFinite(value) ? value : 0 });
  },
  addBet(input: BetInput) {
    setState({ bets: [{ ...input, id: newId() }, ...state.bets] });
  },
  updateBet(id: string, input: BetInput) {
    setState({
      bets: state.bets.map((b) => (b.id === id ? { ...input, id } : b)),
    });
  },
  removeBet(id: string) {
    setState({ bets: state.bets.filter((b) => b.id !== id) });
  },
  setStatus(id: string, status: BetStatus) {
    setState({
      bets: state.bets.map((b) => (b.id === id ? { ...b, status } : b)),
    });
  },
  resetAll() {
    setState({ bancaInicial: 0, bets: [] });
  },
};

export type BetsApi = State & { stats: BancaStats } & typeof actions;

export function useBets(): BetsApi {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const stats = useMemo(
    () => computeStats(snapshot.bets, snapshot.bancaInicial),
    [snapshot.bets, snapshot.bancaInicial],
  );
  return { ...snapshot, stats, ...actions };
}
