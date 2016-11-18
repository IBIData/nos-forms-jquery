#Type
##state

####Example with all options

```javascript
{
    "name": "stateExample",
    "type": "state",
    "label": "State Example",
    "title": "State Example",
    "classname": "form-control",
    "formGroup": true,
    "required": true,
    "autofocus": false,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "disabled": false,
    "readonly": false,
    "multiple": false,
    "selected": "", // use two letter state abbreviations to select a state, a blank value to select the default
    "defaultSelected": "Select One...", // gives the default (blank) value some text. this is the default
    "us": true,
    "usTerritory": false,
    "canada": false,
    "mexico": false
}
```

####More practical example

```javascript
{
    "name": "stateExample",
    "type": "state",
    "label": "State Example",
    "required": true,
    "selected": "MN", // two letter abbreviations or full state names will select them (case insensitive), a blank value to select the default
    "defaultSelected": "Select One...", // gives the default (blank) value some text. this is the default
    "usTerritory": true,
    "canada": true,
    "mexico": true
}
```