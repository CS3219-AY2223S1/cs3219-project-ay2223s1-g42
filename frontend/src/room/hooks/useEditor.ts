import React from "react";
import { io, Socket } from "socket.io-client";
import create from "zustand";

type EditorStore = {};

type EditorValues = EditorStore;

const EditorStoreValues = (
  setState: (values: Partial<EditorValues>) => void,
  getState: () => EditorValues
): EditorStore => {
  return {};
};

export const useEditorStore = create<EditorStore>(EditorStoreValues);
