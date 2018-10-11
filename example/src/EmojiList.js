import React, { Component } from "react";
import memoize from "memoize-one";
import gemoji from "gemoji";
import { ListGroup, ListGroupItem } from "reactstrap";

const emojiNames = Object.keys(gemoji.name);
const MAX_FILTERED_LIST_LENGTH = 5;

export default class EmojiList extends Component {
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
    const id = this.filtered[this.state.option];
    const { emoji } = gemoji.name[id];
    this.props.onClick(`${emoji} `);
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
        {this.filtered.map((emojiName, i) => {
          const { name, emoji } = gemoji.name[emojiName];
          const isSelected = i === this.state.option;
          return (
            <ListGroupItem
              role="option"
              active={isSelected}
              aria-selected={isSelected}
              key={emojiName}
              tag="button"
              action
              onClick={this.propogateClick}
            >
              {emoji} {name}
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

// Helper to filter emojis and memoize the result
const filter = memoize((filterText = "") => {
  let filtered = [];
  for (let emojiName of emojiNames) {
    if (filtered.length >= MAX_FILTERED_LIST_LENGTH) {
      break;
    }
    if (
      emojiName.startsWith(filterText) ||
      gemoji.name[emojiName].tags.some(tag => tag.startsWith(filterText))
    ) {
      filtered.push(emojiName);
    }
  }
  return filtered;
});
