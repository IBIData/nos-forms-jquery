#Nos-Forms-jQuery

**Quickly generate and validate html forms with jQuery, Bootstrap and json objects.**

This is a simple json form builder that will build and validate your forms for you. It will also handle serializing your data and spit out a nice json object to your submit function. This is meant to be used with Bootstrap, but you could probably get along without it.

This plugin is intended for people who spend a lot of time building tedious forms. Copying and pasting json objects from this file is encouraged, as well as saving and reusing json files to build your forms.

- IE 8 supported

##Dependencies
----------------------------------------

- [jQuery](http://jquery.com/download/) - minimum version 1.9

- [Bootstrap](http://getbootstrap.com/getting-started/) (recommended) - minimum version 3.0
----------------------------------------

##Getting Started
----------------------------------------

1. Include js and css file from 'dist' directory

2. Create empty form element with a unique id/class

3. Call nosForm function, specifying your data and options
----------------------------------------

##Quick Example
----------------------------------------

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
----------------------------------------

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

This format allows you to create your form elements in blocks. Adding Bootstrap classes makes it easy for you to display your form in a column layout. Add as many columns as you'd like.

##Special Types

There are a few special element types available.

**state** - This will render a select element with all 50 states and options for Canadian Provinces and US Territories

**zip** - Will render a text box with zip code pattern validation built in

**clone** - Will create a text input with add/remove field buttons. Good for letting users enter an undetermined amount of data.

##Properties

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
----------------------------------------

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
----------------------------------------

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
    "validate": true, // will validate email by default. set this to false to turn off automatic email validation
    "pattern": "", // alternative to 'validate'. use your own regex. don't use this with 'validate' - you'll have to escape some characters and omit the beginning/end forward slashes
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
    "size": 100,
    "message": {
        "required": "Email Address is required",  
        "invalid": "Your email must be valid"
    }
}
```
####tel
```json
{
    "name": "telExample",
    "id": "telId",
    "type": "tel",
    "autofocus": false,
    "label": "Email Example",
    "validate": true, // will validate phone numbers by default (999-999-9999). disable this to turn it off
    "pattern": "", // use your own regex. be sure to turn off 'validate' above when you use this - you'll have to escape some characters and omit the beginning/end forward slashes
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
    "size": 100,
    "mask": "999-999-9999", // requires masked input plugin https://github.com/digitalBush/jquery.maskedinput
    "message": {
        "required": "Your phone number is required",  
        "invalid": "Your phone number must be valid"
    }
}
```
####zip
```json
{
    "name": "zipExample",
    "id": "zipId",
    "type": "zip",
    "label": "Zip Code Example",
    "title": "Zip Code Example",
    "required": true,
    "classname": "form-control",
    "validate": true, // will validate zip codes by default (99999-9999 && 99999). disable this to turn it off
    "pattern": "", // use your own regex instead - you'll have to escape some characters and omit the beginning/end forward slashes
    "disabled": false,
    "autofocus": false,
    "readonly": false,
    "formGroup": true,
    "placeholder": "Zip Code",
    "mask": "99999?-9999" // requires masked input plugin https://github.com/digitalBush/jquery.maskedinput 
}
```
####date
```json
{
    "name": "dateExample",
    "id": "dateId",
    "type": "date",
    "label": "Date Example",
    "title": "Date Example",
    "required": true,
    "classname": "form-control",
    "autofocus": false,
    "autocomplete": true,
    "disabled": false,
    "readonly": false,
    "formGroup": true,
    "min": "1900-01-01",
    "max": "2015-12-31",
    "value": ""
}
```
####submit
```json
{
    "name": "submit",
    "type": "submit",
    "classname": "btn btn-success",
    "formGroup": true,
    "inline": true, // use when you have multiple buttons you want to display inline with each other
    "value": "Submit",
    "title": "",
    "formaction": "",
    "formenctype": "",
    "formmethod": "",
    "formnovalidate": false,
    "formtarget": ""
}
```
####reset
```json
{
    "name": "reset",
    "type": "reset",
    "classname": "btn btn-danger",
    "formGroup": true,
    "inline": true,
    "title": "",
    "value": "Reset"
}
```
####button
```json
{
    "name": "button",
    "type": "button",
    "classname": "btn btn-info",
    "formGroup": true,
    "inline": true,
    "title": "",
    "value": "A Button"
}
```
####checkbox
```json
{
    "name": "cbExample",
    "type": "checkbox",
    "label": "Checkbox Example",
    "formGroup": true,
    "required": true,
    "disabled": false,
    "inline": false,
    "checked": [ "value2", "value3" ], // accepts a value from the options below. can be a string or an array of options
    "options": {
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```
####radio
```json
{
    "name": "radioExample",
    "type": "radio",
    "label": "Radio Example",
    "formGroup": true,
    "required": true,
    "disabled": false,
    "inline": true, // display radio options inline. this basically just changes the bootstrap layout for radio controls
    "checked": "value1", // accepts a value from the options below
    "options": {
        "value1": "First Option",
        "value2": "Second Option",
        "value3": "Third Option"
    }
}
```
####select
```json
{
    "name": "selectExample",
    "type": "select",
    "label": "Select Example",
    "classname": "form-control",
    "formGroup": true,
    "required": true,
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "title": "Select Example",
    "multiple": false,
    "selected": "", // by setting the selected option to a blank string, we are setting it to the blank value in the options object below
    "options": {
        "": "Select One...",
        "value1": "First Value",
        "value2": "Second Value",
        "value3": "Third Value",
        "value4": "Fourth Value"
    }
}
```
####textarea
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
    "title": "Textarea Example",
    "rows": 8,
    "cols": 100,
    "wrap": "hard",
    "value": ""
}
```

####password
```json
{
    "name": "passwordExample",
    "id": "passwordId",
    "type": "password",
    "label": "Password Example",
    "title": "Password Example",
    "required": true,
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "placeholder": "Password",
    "classname": "form-control",
    "formGroup": true,
    "minlength": 6,
    "maxlength": 20,
    "message": {
        "required": "You must enter a password!",
        "minlength": "Your password must be at least 6 characters"
    }
}
```
####number
```json
{
    "name": "numberExample",
    "id": "numberId",
    "type": "number",
    "label": "Number Example",
    "title": "Number Example",
    "required": true,
    "placeholder": "A Number",
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "classname": "form-control",
    "formGroup": true,
    "min": 5,
    "max": 10,
    "step": 1,
    "message": {
        "min": "Your number must have a minimum value of 5",
        "max": "Your number must be no greater than 10"   
    }
}
```
```json
{
    "name": "cloneExample",
    "type": "clone",
    "classname": "form-control",
    "formGroup": true,
    "label": "Clone Example",
    "placeholder": "Item", // will display on each field with a number appended to the end
    "start": 3, // how many inputs you want to display on page load
    "maxFields": 5, // the maximum allowed inputs to display on the page
    "addon": "<i class='glyphicon glyphicon-ok'></i>", // if you have a custom addon, insert here (symbols, html, text). Numbered by default
    "addButtonValue": "Add", // value of the button that adds fields
    "removeButtonValue": "Remove" // value of the button that removes fields
}
```
####state
```json
{
    "name": "stateExample",
    "type": "state",
    "label": "State Example",
    "title": "State Example",
    "classname": "form-control",
    "formGroup": true,
    "required": true,
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "multiple": false,
    "selected": "", // use two letter state abbreviations to select a state, a blank value to select the default
    "defaultSelected": "Select One...", // gives the default (blank) value some text. this is the default
    "usTerritory": true, 
    "canada": true
}
```
####color
```json
{
    "name": "colorexample",
    "id": "colorId",
    "type": "color",
    "label": "Color Picker Example",
    "required": true,
    "title": "Color Picker Example",
    "disabled": false,
    "autofocus": false,
    "classname": "",
    "formGroup": true,
    "value": "#E7E7E8"
}
```
####url
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
    "classname": "form-control",
    "formGroup": true,
    "minlength": 1,
    "maxlength": 60,
    "placeholder": "http://www.example.com",
    "value": ""
}
```
####week
```json
{
    "name": "weekExample",
    "id": "weekId",
    "type": "week",
    "label": "Week Example",
    "title": "Week Example",
    "autofocus": false,
    "disabled": false,
    "min": "",
    "max": "",
    "readonly": false,
    "required": true,
    "classname": "form-control",
    "formGroup": true,
    "value": ""
}
```
####time
```json
{
    "name": "timeExample",
    "id": "timeId",
    "type": "time",
    "label": "Time Example",
    "title": "Time Example",
    "required": true,
    "classname": "form-control",
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "formGroup": true,
    "min": "",
    "max": "",
    "value": ""
}
```
####search
```json
{
    "name": "searchExample",
    "id": "searchId",
    "type": "search",
    "label": "Search Example",
    "title": "Search Example",
    "required": true,
    "classname": "form-control",
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "formGroup": true,
    "minlength": "",
    "maxlength": "",
    "value": ""
}
```
####range
```json
{
    "name": "rangeExample",
    "id": "rangeId",
    "type": "range",
    "label": "Range Example",
    "required": true,
    "classname": "",
    "formGroup": true,
    "autofocus": false,
    "disabled": false,
    "title": "Range Example",
    "min": 1,
    "max": 100,
    "step": 1,
    "value": 25
}
```
####month
```json
{
    "name": "monthExample",
    "id": "monthId",
    "type": "month",
    "label": "Month Example",
    "title": "Month Example",
    "disabled": false,
    "readonly": false,
    "autofocus": false,
    "required": true,
    "classname": "form-control",
    "formGroup": true,
    "min": "",
    "max": "",
    "value": ""
}
```
####hidden
```json
{
    "name": "hiddenExample",
    "id": "hiddenId",
    "type": "hidden",
    "label": "Hidden Example",
    "title": "Hidden Example",
    "required": true,
    "classname": "form-control",
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "formGroup": true,
    "minlength": "",
    "maxlength": "",
    "value": ""
}
```
####datetime-local
```json
{
    "name": "datetimeLocalExample",
    "id": "datetimeLocalId",
    "type": "datetime-local",
    "title": "Datetime Local Example",
    "label": "Datetime Local Example",
    "disabled": false,
    "readonly": false,
    "required": true,
    "autofocus": false,
    "classname": "form-control",
    "formGroup": true,
    "min": "",
    "max": "",
    "value": ""
}
```
####file
```json
{
    "name": "fileExample",
    "id": "fileId",
    "type": "file",
    "label": "File Upload Example",
    "formGroup": true,
    "classname": "",
    "disabled": false,
    "autofocus": false,
    "title": "File Upload Example",
    "required": true,
    "accept": "image/*",
    "multiple": true
}
```
####image
```json
{
    "name": "imageExample",
    "id": "imageId",
    "type": "image",
    "classname": "",
    "formGroup": true,
    "inline": false,
    "autofocus": false,
    "src": "http://placehold.it/50x40",
    "alt": "Placeholder Image",
    "height": 50,
    "width": 50
}
```


###TODO

- add all html global attributes (accesskey, contenteditable, contextmenu, data, etc)







