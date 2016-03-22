#Type
##text

####Example with all options

```json
{
    "name": "txtExample",
    "id": "txtId",
    "type": "text",
    "autofocus": true,
    "label": "Simple Text Field Example",
    "required": true,
    "classname": "form-control",
    "formGroup": true,
    "placeholder": "Just a Text Field",
    "pattern": "[A-Za-z]{5}",
    "minlength": 5,
    "maxlength": 60,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "value": "",
    "title": "Simple Text Field",
    "autocomplete": "on",
    "disabled": false,
    "readonly": false,
    "size": 60,
    "messages": {
        "required": "This simple text field is required",  
        "invalid": "This field must be valid",
        "minlength": "This field must be at least 5 characters long"
    }
}
```

####More practical example

```json
{
    "name": "txtExample",
    "type": "text",
    "label": "Simple Text Field Example",
    "required": true,
    "maxlength": 60
}
```