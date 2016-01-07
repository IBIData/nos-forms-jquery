#Nos-Forms-jQuery

Quickly generate and validate html forms with jQuery, Bootstrap and json objects.

##Dependencies

- [jQuery](http://jquery.com/download/) - minimum version 1.9

- [Bootstrap](http://getbootstrap.com/getting-started/) (recommended) - minimum version 3.0

##Getting Started

1. Include js and css file from 'dist' directory

2. Create empty form element with a unique id/class

3. Call nosForm function, specifying your data and options

```html
<form id="myform" class="form">
    <h2>My Form</h2>
</form>
```
```javascript
$.get('contact-form.json', function (data) {
                    
    $("#myform").nosForm({
        fields: data,
        submit: function (formdata) {
            console.log(formdata);
        }
    });
    
})
```

##Options

TODO: options

##Examples

TODO: examples





