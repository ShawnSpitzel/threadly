import React from "react";

export function makeId() {
  const id = crypto.randomUUID();
  return id;
}