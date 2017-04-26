# Type #
## number ##

#### Example with all options ####

```javascript
{
    "name": "numberExample",
    "id": "numberId",
    "type": "number",
    "label": "Number Example",
    "title": "Number Example",
    "required": true,
    "placeholder": "A Number",
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "classname": "form-control",
    "formGroup": true,
    "min": 5,
    "max": 10,
    "step": 1,
    "messages": {
        "min": "Your number must have a minimum value of 5",
        "max": "Your number must be no greater than 10"
    }
}
```

#### More practical example ####

```javascript
{
    "name": "numberExample",
    "type": "number",
    "label": "Number Example",
    "required": true,
    "min": 5,
    "max": 10,
    "step": 1,
    "messages": {
        "min": "Your number must have a minimum value of 5",
        "max": "Your number must be no greater than 10"
    }
}
```
