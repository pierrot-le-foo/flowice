import { Service, ServiceHandler } from "@/types";
import {
  createBooleanStore,
  createListStore,
  createStringStore,
} from "./templates";

export const useShowAddDialog = createBooleanStore();

export const useShowSearch = createBooleanStore();

export const useShowFilters = createBooleanStore();

export const useServices = createListStore<Service>();

export const useSelectedServiceId = createStringStore();

export const useSelectedLogServiceId = createStringStore();

export const useSearch = createStringStore();

export const useFilterByStatus = createListStore<"Down" | "Up" | "Paused">([
  "Down",
  "Up",
  "Paused",
]);

export const useFilterByType = createListStore<string>();

export const useHandlers = createListStore<(ServiceHandler & { installed: boolean })>([])
