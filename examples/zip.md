# Type #
## zip ##

Has built-in US zip code validation by default. If you don't require it, you can disable it with the 'validate' property.

#### Example with all options ####

```javascript
{
    "name": "zipExample",
    "id": "zipId",
    "type": "zip",
    "label": "Zip Code Example",
    "title": "Zip Code Example",
    "required": true,
    "classname": "form-control",
    "data": {
        "field": 0,
        "testing": 123,
    },
    "validate": true, // will validate zip codes by default (99999-9999 && 99999). disable this to turn it off
    "pattern": "", // use your own regex instead - you'll have to escape some characters and omit the beginning/end forward slashes
    "disabled": false,
    "autofocus": false,
    "readonly": false,
    "formGroup": true,
    "placeholder": "Zip Code",
    "mask": "99999?-9999" // requires jQuery-Mask-Plugin https://github.com/igorescobar/jQuery-Mask-Plugin
}
```

#### More practical example ####

```javascript
{
    "name": "zipExample",
    "type": "zip",
    "label": "Zip Code Example",
    "required": true
}
```
