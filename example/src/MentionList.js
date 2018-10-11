import React, { Component } from "react";
import memoize from "memoize-one";
import { ListGroup, ListGroupItem } from "reactstrap";

const users = [
  {
    name: "Daniel Peterson",
    handle: "danrpts"
  }
];

export default class MentionList extends Component {
  constructor(props) {
    super(props);

    this.show = () => this.setState({ isHidden: false });
    this.hide = () => this.setState({ isHidden: true });
    this.propogateClick = this.propogateClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.filtered = [];

    this.state = {
      isHidden: false,
      option: 0
    };
  }

  propogateClick(e) {
    e.preventDefault();
    const user = this.filtered[this.state.option];
    this.props.onClick(`@${user.handle} `);
  }

  onKeyDown(e) {
    if (this.state.isHidden || this.filtered.length < 1) {
      return null;
    }
    const { key } = e;
    switch (key) {
      case "Escape":
        e.preventDefault();
        this.hide();
        break;
      case "Enter":
      case "Tab":
        this.propogateClick(e);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setState(({ option }) => {
          return { option: clamp(option - 1, 0, this.filtered.length - 1) };
        });
        break;
      case "ArrowDown":
        e.preventDefault();
        this.setState(({ option }) => {
          return { option: clamp(option + 1, 0, this.filtered.length - 1) };
        });
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.filterText !== prevProps.filterText && this.state.isHidden) {
      this.show();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  render() {
    this.filtered = filter(this.props.filterText);
    return (
      <ListGroup role="listbox" hidden={this.state.isHidden}>
        {this.filtered.map((user, i) => {
          const { name, handle } = user;
          const isSelected = i === this.state.option;
          return (
            <ListGroupItem
              role="option"
              active={isSelected}
              aria-selected={isSelected}
              key={i}
              tag="button"
              action
              onClick={this.propogateClick}
            >
              {name} @{handle}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
}

// Helper to clamp a value between min and max inclusive
const clamp = (value, min, max) => {
  return value < min ? min : value > max ? max : value;
};

// Helper to filter users and memoize the result
const filter = memoize((filterText = "") =>
  users.filter(({ handle }) => handle.startsWith(filterText))
);
