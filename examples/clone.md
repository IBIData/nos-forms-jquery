#Type
##clone

A clone field is basically a set of text boxes with add/remove buttons. This allows users to dynamically generate their own fields. This could be useful when a user has to submit an undetermined amount of information, such as recipe ingredients, book titles, etc.

####Example with all options

```json
{
    "name": "cloneExample",
    "type": "clone",
    "classname": "form-control",
    "formGroup": true,
    "label": "Clone Example",
    "data": {
        "field": 0,
        "testing": 123,
    },
    "placeholder": "Item", // will display on each field with a number appended to the end
    "start": 3, // how many inputs you want to display on page load
    "maxFields": 5, // the maximum allowed inputs to display on the page
    "addon": "<i class='glyphicon glyphicon-ok'></i>", // if you have a custom addon, insert here (symbols, html, text). Numbered by default
    "addButtonValue": "Add", // value of the button that adds fields
    "removeButtonValue": "Remove", // value of the button that removes fields
    "addButtonClass": "btn btn-primary", // classes for add button
    "removeButtonClass": "btn btn-danger" // classes for remove button
}
```