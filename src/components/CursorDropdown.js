import React from "react";
import { DropdownContext } from "./WithCursorDropdown.js";

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
              onClick: value => onClick(value),
              style: {
                position: "absolute",
                top: cursor.coordinates.top,
                left: cursor.coordinates.left
              }
            })
          : null;
      }}
    </DropdownContext.Consumer>
  );
}
