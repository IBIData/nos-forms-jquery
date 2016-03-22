#Type
##tel

Has built-in US telephone number validation enabled by default. If you don't require this, you can disable it with the 'validate' property.

####tel
```json
{
    "name": "telExample",
    "id": "telId",
    "type": "tel",
    "autofocus": false,
    "label": "Email Example",
    "validate": true, // will validate phone numbers by default (999-999-9999). disable this to turn it off
    "pattern": "", // use your own regex. be sure to turn off 'validate' above when you use this - you'll have to escape some characters and omit the beginning/end forward slashes
    "required": true,
    "classname": "form-control secondClass",
    "formGroup": true,
    "placeholder": "Email Address",
    "minlength": 1,
    "maxlength": 100,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "value": "",
    "title": "Email Address",
    "autocomplete": "on",
    "disabled": false,
    "readonly": false,
    "size": 100,
    "mask": "999-999-9999", // requires masked input plugin https://github.com/digitalBush/jquery.maskedinput
    "messages": {
        "required": "Your phone number is required",  
        "invalid": "Your phone number must be valid"
    }
}
```

####tel
```json
{
    "name": "telExample",
    "type": "tel",
    "label": "Email Example",
    "required": true,
    "maxlength": 100
}
```