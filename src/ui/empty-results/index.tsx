import React, { useState } from "react";
import * as css from "./index.css";
import { Text } from "../text";

type EmptyResultsProps = {
  children: React.ReactNode;
};

function EmptyResults(props: EmptyResultsProps) {
  return (
    <div className={css.root}>
      <Text variant="subtitle">{props.children}</Text>
      <img src="/public/assets/icon-misReports.png" className={css.img} />
    </div>
  );
}
export { EmptyResults };
