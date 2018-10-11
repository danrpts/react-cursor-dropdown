# react-caret-dropdown

> A React HOC for adding cursor dropdown menus to textareas and inputs.

[![NPM](https://img.shields.io/npm/v/react-caret-dropdown.svg)](https://www.npmjs.com/package/react-caret-dropdown) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-cursor-dropdown
```

## Usage

```jsx
import React, { Component } from 'react'

import { WithCursorDropdown, CursorDropdown } from "react-caret-dropdown";

const Input = props => <input {...props} />;
const InputCursorDropdown = WithCursorDropdown(Input);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      selection: {
        start: 0,
        end: 0
      }
    };

    this.onChange = e => {
      this.setState({
        value: e.target.value,
        selection: {
          start: e.target.selectionStart,
          end: e.target.selectionEnd
        }
      });
    };
  }
  
  render () {
    return (
      <InputCursorDropdown value={this.state.value} selection={this.state.selection} onChange={this.onChange}>
        <CursorDropdown pattern={/^:([\w+-]*)$/} component={EmojiList} />
      </InputCursorDropdown>
    )
  }
}
```

## License

MIT © [danrpts](https://github.com/danrpts)
