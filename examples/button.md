#Type
##button

####Example with all options

```javascript
{
    "name": "button",
    "type": "button",
    "classname": "btn btn-info",
    "formGroup": true, // formGroup must be specified for buttons
    "data": {
        "field": 0,
        "testing": 123,
    },
    "align": "left", // will add a pull-left/pull-right class to the surrounding div - ONLY WORKS WITH FORMGROUP SET TO TRUE
    "inline": true, // when there are multiple buttons, this will display them in 'inline-block' divs
    "title": "",
    "value": "A Button"
}
```

####More practical example
```javascript
{
    "name": "button",
    "type": "button",
    "classname": "btn btn-info",
    "formGroup": true,
    "align": "left",
    "value": "A Button"
}
```