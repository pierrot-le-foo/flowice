import { create } from "zustand";

export interface BooleanStore {
  value: boolean;
  on(): void;
  off(): void;
  toggle(): void;
}

export const createBooleanStore = (defaultValue: boolean = false) =>
  create<BooleanStore>((set, get) => ({
    value: defaultValue,
    on() {
      set({ value: true });
    },
    off() {
      set({ value: false });
    },
    toggle() {
      set({ value: !get().value });
    },
  }));

export interface StringStore {
  value: string;
  replace(value: string): void;
  append(suffix: string): void;
  prepend(prefix: string): void;
  transform(transformer: (value: string) => string): void;
}

export const createStringStore = (defaultValue: string = "") =>
  create<StringStore>((set, get) => ({
    value: defaultValue,
    replace(value) {
      set({ value });
    },
    append(suffix) {
      set({ value: get().value + suffix });
    },
    prepend(prefix) {
      set({ value: prefix + get().value });
    },
    transform(transformer) {
      set({ value: transformer(get().value) });
    },
  }));

export interface ListStore<I> {
  list: I[];
  replace(list: I[]): void;
  filter(predicate: (i: I) => boolean): void;
  push(...i: I[]): void;
}

export const createListStore = <I>(defaultValue: I[] = []) =>
  create<ListStore<I>>((set, get) => ({
    list: defaultValue,
    replace(list) {
      set({ list });
    },
    filter(predicate) {
      set({ list: get().list.filter(predicate) });
    },
    push(...i) {
      set({ list: [...get().list, ...i] });
    },
  }));

export interface StringListStore {
  list: string[];
  replace(list: string[]): void;
  filter(predicate: (i: string) => boolean): void;
  push(...i: string[]): void;
  updateByIndex(index: number, item: string): void;
}

export const createStringListStore = (defaultValue: string[] = []) =>
  create<StringListStore>((set, get) => ({
    list: defaultValue,
    replace(list) {
      set({ list });
    },
    filter(predicate) {
      set({ list: get().list.filter(predicate) });
    },
    push(...i) {
      set({ list: [...get().list, ...i] });
    },
    updateByIndex(index, item) {
      const nextList = [...get().list];
      nextList[index] = item;
      set({ list: nextList });
    },
  }));
