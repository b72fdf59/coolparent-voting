![demo](https://github.com/iblcode/coolparent-voting/raw/master/demo.gif)
Built upon React-TypeScript and React-Bubble-Chart  
Note that React-Bubble-Chart has an obsolete dependency on d3@3.5ish

It periodically queries the server to update the chart.

The data returned from server has to be in a format of

```
{...
  data:
    [
      {'_id':John Smith, 'value':3}
      ...
    ]
}
```

To install:

```
npm install
```

To run:

```
npm start
```

to build:

```
npm build
```
