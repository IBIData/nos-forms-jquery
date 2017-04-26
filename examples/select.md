# Type #
## select ##

#### Example with all options ####

```javascript
{
    "name": "selectExample",
    "id": "myselect",
    "type": "select",
    "label": "Select Example",
    "classname": "form-control",
    "formGroup": true,
    "required": true,
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "title": "Select Example",
    "multiple": false,
    "selected": "", // by setting the selected option to a blank string, we are selecting the blank value in the options object below
    "options": {
        "": "Select One...",
        "value1": "First Value",
        "value2": "Second Value",   // accepts an object or an array of objects
        "value3": "Third Value",
        "value4": "Fourth Value"
    }
}
```

#### More practical example ####

```javascript
{
    "name": "selectExample",
    "type": "select",
    "label": "Select Example",
    "required": true,
    "selected": "", // by setting the selected option to a blank string, we are selecting the blank value in the options object below
    "options": {
        "": "Select One...",
        "value1": "First Value",
        "value2": "Second Value",   // accepts an object, array, or an array of objects
        "value3": "Third Value",
        "value4": "Fourth Value"
    }
}
```

## Select Options ##

There are a few ways to enter your select options.

- As in the example above, you can enter them as an object

```javascript
"options": {
    "value1": "First Value",
    "value2": "Second Value"
}
```

- Enter them as an array of objects

```javascript
"options": [
    {
        "value1": "First Value"
    },
    {
        "value2": "Second Value"
    }
]
```

- Enter them as an array. In this scenario, each array item will be used as the selection and value.

```javascript
"options": [
    "First Value",
    "Second Value"
]
```
