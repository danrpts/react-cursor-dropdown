import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropdownContext } from "./WithCursorDropdown.jsx";

import styles from "../styles.css";

export default function CursorDropdown(props) {
  return (
    <DropdownContext.Consumer>
      {context => {
        const { cursor, handleCursorDropdownChange } = context;
        // NOTE: the provided regex needs to have a capture group
        const match = cursor.value.match(props.pattern);
        return match
          ? React.createElement(props.component, {
              filterText: match[1],
              onChange: handleCursorDropdownChange
            })
          : null;
      }}
    </DropdownContext.Consumer>
  );
}

CursorDropdown.propTypes = {
  pattern: PropTypes.instanceOf(RegExp).isRequired,
  component: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.func.isRequired
  ])
};
