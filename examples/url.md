#Type
##url

####Example with all options
```json
{
    "name": "urlExample",
    "id": "urlId",
    "type": "url",
    "label": "URL Example",
    "title": "URL Example",
    "disabled": false,
    "autofocus": false,
    "readonly": false,
    "required": true,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "classname": "form-control",
    "formGroup": true,
    "minlength": 1,
    "maxlength": 60,
    "placeholder": "http://www.example.com",
    "value": ""
}
```

####More practical example
```json
{
    "name": "urlExample",
    "type": "url",
    "label": "URL Example",
    "required": true,
    "maxlength": 60,
    "placeholder": "http://www.example.com"
}
```