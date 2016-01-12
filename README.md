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
    animationSpeed: 100, // change speed of js animations (this will alter the default jquery slideUp() and slideDown() speeds)
    messages: { // these are the messages that will appear on the bottom of the form when an unsuccessful submit has occurred
        required: 'Please fill out all required fields', // warning about required fields
        invalid: 'Invalid fields' // warning about invalid fields (pattern, minlength, min, max)
    },
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

**state**

This will render a select element with all 50 states and options for Canadian Provinces and US Territories

**zip**

Will render a text box with zip code pattern validation built in

###Properties

**type** | *Required* | *String*

- Specifies the type of element

**name** | *Required* | *String*

- Gives the element a name, and will be used as the id if none is specified

**id** | *String*

- Gives the element an id. If not specified, the name will also be the id.

**formGroup** | *Boolean*

- Wraps the element in a Bootstrap form group

**classname** | *String*

- Gives the element a class

**label** | *String*

- Adds a label above element

**mask** | *String*
 
- Adds a masked input to a text element. [Requires external plugin](https://github.com/digitalBush/jquery.maskedinput)

All other html attributes are supported and behave as expected. See the examples below.

##Validation 

By default, validation will happen when you specify certain properties in your json file. All fields will be checked for values and sanitized. Error messages will be generated, and it will basically take care of itself.

- ***required*** - adds required tag and ensures a value is in place

- ***minlength*** - adds minlength tag and checks with javascript

- ***maxlength*** - adds maxlength tag and double checks it with javascript

- ***pattern*** - will validate input against a regex of your choosing

- ***min*** - adds min tag and checks

- ***max*** - adds max tag and checks

###Validation Messages

By default, there are messages in place that warn the user about missing/invalid fields. They are inside hidden Bootstrap alert divs. If you do not specify a value, they will name each field by whatever value you have on the label. If you don't have a label, they will find a placeholder value.

These messages can be customized for each field, if you need. See the examples below.

There are also some default form messages that will display on the bottom of the form if the user tries to submit unsuccessfully. These can be customized in the plugin initilization, as mentioned in the 'Options' section.

##Examples

The following examples have all available options listed. Normally they won't look so bloated.

####text

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
    "value": "",
    "title": "Simple Text Field",
    "autocomplete": "on",
    "disabled": false,
    "readonly": false,
    "size": 60,
    "message": {
        "required": "This simple text field is required",  
        "invalid": "This field must be valid",
        "minlength": "This field must be at least 5 characters long"
    }
}
```
####email
```json
{
    "name": "emailExample",
    "id": "emailId",
    "type": "email",
    "autofocus": false,
    "label": "Email Example",
    "required": true,
    "classname": "form-control secondClass",
    "formGroup": true,
    "placeholder": "Email Address",
    "minlength": 1,
    "maxlength": 100,
    "value": "",
    "title": "Email Address",
    "autocomplete": "on",
    "disabled": false,
    "readonly": false,
    "size": 60,
    "message": {
        "required": "This simple text field is required",  
        "invalid": "This field must be valid",
        "minlength": "This field must be at least 5 characters long"
    }
}
```
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







