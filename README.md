# Iconiex

Welcome to **Iconiex**, your go-to marketplace for a wide variety of beautifully designed SVG icons. Whether you're developing a web application or creating stunning graphics, Iconiex has the perfect icons to enhance your project.

## Table of Contents

- [Installation](#installation)
- [Overview](#overview)
- [Usage](#usage)
- [Icon Components](#icon-components)
- [Customization](#customization)

## Installation

You can easily install Iconiex using either **npm** or **yarn**. Run one of the following commands in your project directory:

### Using npm:

```bash
npm install react-iconiex-icons
```

### Using yarn:

```bash
yarn add react-iconiex-icons
```

## Overview

**Iconiex** offers a rich collection of high-quality icons designed to meet the needs of modern web applications. With our user-friendly React components, you can easily integrate icons into your projects and customize them as needed.

## Features

- **Wide Variety of Icons**: Explore an extensive library of icons suitable for different applications and styles.
- **Easy to Use**: Simple installation and usage, making it accessible for all developers.
- **Customizable**: Each icon component supports customization via `className` and `style` props.
- **Responsive Design**: Icons are designed to scale beautifully on any screen size.

## Usage

### Simple usages example

```js
import { IxArrowRigth } from "react-iconiex-icons";

function App() {
  return (
    <div className="App">
      <IxArrowRigth />
    </div>
  );
}

export default App;
```

### Using className for dynamic style for tailwindcss & bootstrap

```js
import { IxArrowRigth } from "react-iconiex-icons";

function App() {
  return (
    <div className="App">
      <IxArrowRigth className="text-red-500 text-4xl" />
    </div>
  );
}

export default App;
```

### Using inline style style

```js
import { IxArrowRigth } from "react-iconiex-icons";

function App() {
	return (
		<div className="App">
			<IxArrowRigth style={{color:"red", font-size:"32px"}} />
		</div>
	);
}

export default App;
```

### Change style with custom class name

```js
<IxArrowRigth className="my-icon" />
```

```css
.my-icon {
  color: "red";
  font-size: "32px";
  /* add another styles  */
}
```
