# reactTree
Node tool which creates visualization of react component dependencies as a tree

Usage

Add on dependencies directly from github

```jsx
  "react-tree": "git+https://github.com/occmundial/react-tree/edit/master/README.md"
```

Add a script to run it on package.json

```jsx
  "build-tree": "react-tree ./src 2 false"
```

React-tree accepts 3 parameters
1. Source folder (mandatory)
2. Logging level (0-2) from 0 being no logging to 2 being detailed logging. Used mostly for debugging.
3. Include non-react components. It will include all other imports even if they are not part of your source components.
