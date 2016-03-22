#Type
##email

Has built-in email validation enabled by default. If you don't require this, you can disable it with the 'validate' property.

####Example with all options

```json
{
    "name": "emailExample",
    "id": "emailId",
    "type": "email",
    "autofocus": false,
    "label": "Email Example",
    "validate": true, // will validate email by default. set this to false to turn off automatic email validation
    "pattern": "", // alternative to 'validate'. use your own regex. don't use this with 'validate' - you'll have to escape some characters and omit the beginning/end forward slashes
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
    "messages": {
        "required": "Email Address is required",  
        "invalid": "Your email must be valid"
    }
}
```

####More practical example

```json
{
    "name": "emailExample",
    "type": "email",
    "label": "Email Example",
    "required": true,
    "maxlength": 100
}
```