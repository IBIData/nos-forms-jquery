#Type
##textarea

####Example with all options

```json
{
    "name": "taExample",
    "type": "textarea",
    "label": "Textarea Example",
    "required": true,
    "classname": "form-control",
    "formGroup": true,
    "placeholder": "Textarea content here",
    "autofocus": false,
    "minlength": 1,
    "maxlength": 200,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "title": "Textarea Example",
    "rows": 8,
    "cols": 100,
    "wrap": "hard",
    "value": ""
}
```

####More practical example

```json
{
    "name": "taExample",
    "type": "textarea",
    "label": "Textarea Example",
    "required": true,
    "maxlength": 200,
    "rows": 8,
}
```