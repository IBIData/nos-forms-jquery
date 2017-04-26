# Type #
## submit ##

> As a side note, with buttons the name property doesn't actually assign it a name attribute, but an id instead.

#### Example with all options ####

```javascript
{
    "name": "submitButton", // NEVER NAME A SUBMIT BUTTON 'SUBMIT'!!!
    "type": "submit",
    "classname": "btn btn-success",
    "formGroup": true,
    "inline": true, // use when you have multiple buttons you want to display inline with each other
    "value": "Submit",
    "title": "",
    "data": {
        "field": 0,
        "testing": 123,
    },
    "formaction": "",
    "formenctype": "",
    "formmethod": "",
    "formnovalidate": false,
    "formtarget": ""
}
```

#### More practical example ####

```javascript
{
    "name": "submitButton", // NEVER NAME A SUBMIT BUTTON 'SUBMIT'!!!
    "type": "submit",
    "classname": "btn btn-success",
    "formGroup": true,
    "inline": true,
    "value": "Submit"
}
```
