#Type
##radio

####Example with all options

```json
{
    "name": "radioExample",
    "type": "radio",
    "label": "Radio Example",
    "formGroup": true,
    "required": true,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "disabled": false,
    "inline": true, // display radio options inline. this basically just changes the bootstrap layout for radio controls
    "checked": "value1", // accepts a value from the options below
    "options": {
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```

####More practical example

```json
{
    "name": "radioExample",
    "type": "radio",
    "label": "Radio Example",
    "required": true,
    "inline": true, // display radio options inline. this basically just changes the bootstrap layout for radio controls
    "checked": "value1", // accepts a value from the options below
    "options": {
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```

##Radio Options

There are a few ways to enter your radio options.

- As in the example above, you can enter them as an object

```json
"options": {
    "value1": "First Option",
    "value2": "Second Option"
}
```

- Enter them as an array of objects

```json
"options": [
    {
        "value1": "First Option"   
    },
    {
        "value2": "Second Option"
    }
]
```

- Enter them as an array. In this scenario, each array item will be used as the radio selection and value.

```json
"options": [
    "First Option",
    "Second Option"   
]
```