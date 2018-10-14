import React from "react";
import { DropdownContext } from "./WithCursorDropdown.jsx";

import styles from "../styles.css";

export default function CursorDropdown(props) {
  const { pattern, component } = props;
  return (
    <DropdownContext.Consumer>
      {context => {
        const { cursor, onClick } = context;
        const match = cursor.word.value.match(pattern);
        return match
          ? React.createElement(component, {
              filterText: match[1],
              onClick: value => onClick(value)
            })
          : null;
      }}
    </DropdownContext.Consumer>
  );
}
