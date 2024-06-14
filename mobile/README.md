we use nativewind

in case of:
Getting Error: "Use process(css).then(cb) to work with async plugins"

```
I have solved this by downgrading the tailwindcss to 3.3.2

npm install tailwindcss@3.3.2 --save-dev
```