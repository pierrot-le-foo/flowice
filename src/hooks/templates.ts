import { useState } from "react";

export function useList<T>(defaultValue: T[] = []) {
  const [items, setItems] = useState(defaultValue);

  const push = (newItem: T) => {
    setItems((items) => [...items, newItem]);
  };

  const updateByIndex = (index: number, predicate: (item: T) => T) => {
    setItems((items) => {
      const nextList = [...items];
      nextList[index] = predicate(nextList[index]);
      return nextList;
    });
  };

  const removeByIndex = (index: number) => {
    setItems((items) => items.filter((i, ii) => ii !== index));
  };

  const moveUp = (index: number) => {
    setItems((items) => {
      const nextItems = [...items];
      let nextIndex = index - 1;
      if (nextIndex < 0) {
        return nextItems;
      }
      nextItems[index] = items[nextIndex];
      nextItems[nextIndex] = items[index];
      return nextItems;
    });
  };

  const moveDown = (index: number) => {
    setItems((items) => {
      const nextItems = [...items];
      let nextIndex = index + 1;
      if (nextIndex === items.length) {
        return nextItems;
      }
      nextItems[index] = items[nextIndex];
      nextItems[nextIndex] = items[index];
      return nextItems;
    });
  };

  return { items, push, updateByIndex, removeByIndex, moveUp, moveDown };
}

export function useStringList(defaultValue: string[] = []) {
  const [items, setItems] = useState(defaultValue);

  const push = (newItem: string) => {
    setItems((items) => [...items, newItem]);
  };

  const updateByIndex = (
    index: number,
    item: string | ((item: string) => string)
  ) => {
    if (typeof item === "string") {
      setItems((items) => {
        const nextList = [...items];
        nextList[index] = item;
        return nextList;
      });
    }
  };

  return { items, push, updateByIndex };
}
