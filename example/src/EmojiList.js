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
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.filtered = [];

    this.state = {
      isHidden: false,
      option: 0
    };
  }

  handleClick(e) {
    this.props.onChange(`${e.target.value} `);
  }

  handleKeyDown(e) {
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
        e.preventDefault();
        const { char } = this.filtered[this.state.option];
        this.props.onChange(`${char} `);
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
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.filterText !== prevProps.filterText && this.state.isHidden) {
      this.show();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    this.filtered = filter(this.props.filterText);
    console.log(this.filtered);
    return (
      <ListGroup role="listbox" hidden={this.state.isHidden}>
        {this.filtered.map((emoji, i) => {
          const { name, char } = emoji;
          const isActive = i === this.state.option;
          return (
            <ListGroupItem
              role="option"
              active={isActive}
              aria-selected={isActive}
              key={name}
              value={char}
              tag="button"
              action
              onClick={this.handleClick}
            >
              {char} {name}
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
  for (let name of emojiNames) {
    if (filtered.length >= MAX_FILTERED_LIST_LENGTH) {
      break;
    }
    if (
      name.startsWith(filterText) ||
      gemoji.name[name].tags.some(tag => tag.startsWith(filterText))
    ) {
      filtered.push({ name, char: gemoji.name[name].emoji });
    }
  }
  return filtered;
});
