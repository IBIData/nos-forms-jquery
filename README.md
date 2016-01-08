#Nos-Forms-jQuery

**Quickly generate and validate html forms with jQuery, Bootstrap and json objects.**

This is a simple json form builder that will build and validate your forms for you. It will also handle serializing your data and spit out a nice json object to your submit function. This is meant to be used with Bootstrap, but you could probably get along without it.

This plugin is intended for people who spend a lot of time building tedious forms. Copying and pasting json objects from this file is encouraged, as well as saving and reusing json files to build your forms.

- IE 8 supported

##Dependencies

- [jQuery](http://jquery.com/download/) - minimum version 1.9

- [Bootstrap](http://getbootstrap.com/getting-started/) (recommended) - minimum version 3.0

##Getting Started

1. Include js and css file from 'dist' directory

2. Create empty form element with a unique id/class

3. Call nosForm function, specifying your data and options

##Quick Example

A simple contact form built with [Bootstrap](http://getbootstrap.com). This form will be sanitized and validated.

####index.html

```html
<form id="myform" class="form">
    <h2>My Form</h2>
</form>
```

####js file

```javascript
$.get('contact-form.json', function (jsonData) {
                    
    $("#myform").nosForm({
        fields: jsonData,
        submit: function (formdata) {
            console.log(formdata);
        }
    });
    
})
```
####contact-form.json

```json
[
    {
        "name": "name", 
        "id": "nameId", 
        "type": "text", 
        "label": "Name", 
        "required": true, 
        "classname": "form-control", 
        "formGroup": true, 
        "placeholder": "Your Name",
        "minlength": 1, 
        "maxlength": 60 
    }, 
    {
        "name": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "classname": "form-control",
        "formGroup": true,
        "placeholder": "Your Email",
        "minlength": 1,
        "maxlength": 100
    },   
    {
        "name": "message",
        "type": "textarea",
        "label": "Message",
        "required": true,
        "classname": "form-control",
        "formGroup": true,
        "placeholder": "Your message",
        "minlength": 5,
        "maxlength": 500,
        "rows": 8
    },
    {
        "name": "submit",
        "type": "submit",
        "classname": "btn btn-success",
        "formGroup": true,
        "value": "Submit"
    }
]
```

##Options

All options with default values

```javascript
$("#myform").nosForm({
    fields: {}, // Your json data,
    validate: true, // toggle javascript validation
    htmlValidation: false, // toggle html browser validation
    submit: function (formdata) {
        // your submit function
        // this will pass back the entered form data as a formatted json object
    }
});
```

###Single Columns

These are pretty standard.

```json
[
    {
        // form elements here   
    }   
]
```

###Multiple Columns

If you would like a form to work with multiple columns, you just have to format your json data a little different.

```json
[
    {
       "classname": "col-md-4",
       "column": [
           {
               // form elements here
           }
       ] 
    },
    {
       "classname": "col-md-4",
       "column": [
           {
               // form elements here
           }
       ] 
    },
    {
       "classname": "col-md-4",
       "column": [
           {
               // form elements here
           }
       ] 
    }   
]
```

Create as many columns as you like.

###Special Types

There are a few special element types available.



###Properties

**type** | Required | String

- Specifies the type of element

**name** | Required | String

- Gives the element a name, and will be used as the id if none is specified

**id** | String

- Gives the element an id. If not specified, the name will also be the id.

**formGroup** | Boolean

- Wraps the element in a Bootstrap form group

**classname** | String

- Gives the element a class

**label** | String

- Adds a label above element

**mask** | String
 
- Adds a masked input to a text element. [Requires external plugin](https://github.com/digitalBush/jquery.maskedinput)

All other html attributes are supported and behave as expected. See the examples below.

##Examples

####text

**

####email
####tel
####date
####submit
####reset
####button
####checkbox
####radio
####select
####textarea
####password
####number
####state
####zip
####color
####url
####week
####time
####search
####range
####month
####hidden
####datetime-local
####file
####image


###TODO

- add all html global attributes (accesskey, contenteditable, contextmenu, data, etc)







