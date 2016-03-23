#Type
##checkbox

####Example with all options

```javascript
{
    "name": "cbExample",
    "id": "cbExample",
    "type": "checkbox",
    "label": "Checkbox Example",
    "formGroup": true,
    "required": true, // will require at least one checkbox checked to be valid
    "disabled": false,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "submitType": "object", // determines what type of data will be returned on submit (object, array, or string)
    "inline": false, // display checkboxes inline. this basically just changes the bootstrap layout for checkbox controls
    "checked": [ "value2", "value3" ], // accepts a value from the options below. can be a string or an array of options
    "options": { // accepts an object, array, or array of objects - if you specify an array, each value will populate the text value and value attribute
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```

####More practical example

```javascript
{
    "name": "cbExample",
    "type": "checkbox",
    "label": "Checkbox Example",
    "required": true,
    "submit": "object",
    "inline": false,
    "checked": "value2",
    "options": { 
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```

##Checkbox Options

There are a few ways to enter your checkbox options.

- As in the example above, you can enter them as an object

```javascript
"options": {
    "value1": "First Option",
    "value2": "Second Option"
}
```

- Enter them as an array of objects

```javascript
"options": [
    {
        "value1": "First Option"   
    },
    {
        "value2": "Second Option"
    }
]
```

- Enter them as an array. In this scenario, each array item will be used as the checkbox selection and value.

```javascript
"options": [
    "First Option",
    "Second Option"   
]
```

##Submit Type

This is a special property for checkboxes that will determine how your data will be submitted to your success function. The choices are as follows:

- object - sends back all options with a true/false value

```javascript
{
    "value1": true,
    "value2": true,
    "value3": false
}
```

 - array - sends back all checked options as an array
 
```javascript
[
    "value1", "value2"   
]
```

- string - sends back all checked options as a string

```javascript
"value1, value2"
```