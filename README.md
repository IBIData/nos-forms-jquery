#Nos-Forms-jQuery

**Quickly generate and validate html forms with jQuery, Bootstrap and json.**

This is a simple json form builder that will build and validate your forms for you. It will also handle serializing your data and spit out a nice json object to your submit function. This plugin is meant to be used with Bootstrap.

This plugin is intended for people who spend a lot of time building tedious forms. Copying and pasting from this file is encouraged, as well as saving and reusing json files to build your forms.

- IE 8 supported

##Dependencies
----------------------------------------

- [jQuery](http://jquery.com/download/) - minimum version 1.9

- [Bootstrap](http://getbootstrap.com/getting-started/) - minimum version 3.0

##Getting Started
----------------------------------------

1. Include js and css file from 'dist' directory

2. Create empty form element with a unique id

3. Call nosForm function, specifying your data and options

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

> Note: you don't have to store your config in a json file. You can just write this in your plugin initilization as JavaScript.

```json
[
    {
        "name": "name",
        "id": "nameId",
        "type": "text",
        "label": "Name",
        "required": true,
        "placeholder": "Your Name",
        "minlength": 1,
        "maxlength": 60
    },
    {
        "name": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "Your Email",
        "minlength": 1,
        "maxlength": 100
    },
    {
        "name": "message",
        "type": "textarea",
        "label": "Message",
        "required": true,
        "placeholder": "Your message",
        "minlength": 5,
        "maxlength": 500,
        "rows": 8
    },
    {
        "name": "submitButton", // NEVER NAME THIS 'submit'!!!
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
    fields: null, // Your json data {},
    ajax: true, // receive data in your submit function and send it with ajax (if false, a classic submit occurs)
    validate: true, // toggle javascript validation
    htmlValidation: false, // toggle html browser validation
    animationSpeed: 100, // change speed of js animations (error message animations)
    honeypot: false, // adds two honeypot fields to filter out bots
    onlySubmitWithValue: false, // if true, will only send form fields that have been filled out (empty fields don't get submitted)
    messages: { // these are the messages that will appear on the bottom of the form when an unsuccessful submit has occurred
        required: 'Please fill out all required fields', // warning about required fields
        invalid: 'Invalid fields' // warning about invalid fields (pattern, minlength, min, max)
    },
    messageLocation: { // places required/invalid error messages on the form
        top: false, // specifies the messages to be displayed on the top
        bottom: true  // specifies the messages to be displayed on the bottom
    },
    submit: function (formdata, form) {
        // your submit function
        // this will pass back the entered form data as a formatted json object and your form as a second argument
    },
    init: function (form) {
        // fires after form is rendered
        // passes back the form
    }
});
```

###**fields**

 Accepts an object with your form element structure. This was originally intended to be imported from a json file (for easy reuse of forms), but you can write the object in your js file as well. This allows you to write your own functions that return the correct values to individual fields.

###**ajax**

 Accepts a boolean value. If set to true, your form will send a serialized object to your submit function, where you will be responsible for sending an ajax request with your form data. If set to false, a classic form submit will occur and your submit function will not be necessary. If you set ajax to false and a submit function is still present, you will still receive the form data as usual and you will have to manually submit the form. This can be useful for deleting out fields you don't want to send to the server (e.g.: confirm password fields) or if you need to manually check something before sending the form. **Worth noting:**: never name your submit button 'submit' or your form will not submit properly.

###**validate**

 Accepts a boolean value. Toggles the build-in validation on or off. If for some reason you don't need validation, turn this off.

###**htmlValidate**

 Accepts a boolean value. Toggles the html5 validation on or off. Basically, this is just adding and removing a 'novalidate' tag from the form.

###**animationSpeed**

 Accepts a number value (milliseconds). Controls the speed of the validation messages popping in and out of form fields.

###**honeypot**

 Accepts a boolean. Optionally, there are two honeypot text fields rendered on each form (one is empty and one has a preset value). Both are hidden by CSS and JS. If either are modified, the form data will be ignored and the plugin will submit an object instead: **{ honeypot: true }**. You are free to handle this however needed in your submit function.

###**onlySubmitWithValue**

 Accepts a boolean. When this field is set to true, only fields that have a value will be sent to your submit function. This essentially will ignore any field that a user has not filled out. This can be useful when you have a lot of optional fields and you don't want to post all of them all the time.

###**messages**

 Accepts two properties with string values: 'required' and 'invalid'. These are the two messages that are positioned below each form. On an unsuccessful form submit, the appropriate message will be displayed to the user. If not modified, they will display the default values shown above.

###**messageLocation**
 Accepts two properties with boolean values: 'top' and 'bottom'. These settings determine the location of the user error messages to be displayed on an invalid form submit attempt.

###**submit**

 Accepts a function that receives the form data passed to it. Passes two arguments: the form data and the form.

###**init**

 Function that will fire as soon as the form renders. Passes the form as it's only argument.

##Structure
 ---

##Single Columns

These are pretty standard.

```javascript
[
    {
        // form element here
    },
    {
        // form element here
    }
]
```

##Multiple Columns

If you would like a form to work with multiple columns, you just have to format your json data a little different.

```javascript
[
    {
       "classname": "col-md-4",
       "column": [
           {
               // form element here
           }
       ]
    },
    {
       "classname": "col-md-4",
       "column": [
           {
               // form element here
           }
       ]
    },
    {
       "classname": "col-md-4",
       "column": [
           {
               // form element here
           }
       ]
    }
]
```

##Nesting Columns

Nesting columns can be accomplished by declaring a row where needed.

```javascript
[
    {
        "row": true, // wraps a row class div around this column
        "classname": "col-md-6 col-md-offset-3", // centers this form on the page in a col-6
        "column": [
            {
                "row": true, // adds another row
                "classname": "col-md-12", // nests a col-12 class inside the col-6
                "column": [
                    {
                        // form element here
                    }
                ]
            },
            {
                "row": true,
                "column": [
                    {
                        "classname": "col-md-6",
                        "column": [
                            {
                                // form element here
                            }
                        ]
                    },
                    {
                        "classname": "col-md-6",
                        "column": [
                            {
                                // form element here
                            }
                        ]
                    }
                ]
            },
            {
                "row": true,
                "classname": "col-md-12",
                "column": [
                    {
                        // form element here
                    }
                ]
            }
        ]
    }
]
```

This format allows you to create your form elements in blocks. Adding Bootstrap classes makes it easy for you to display your form in a column layout. Add as many columns and nest them as deep as you like.

##Types

---

| Name                                  | Description                                                                                                       |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [button](./examples/button.md)        | Standard HTML button element - rendered with button tag, not input.
| [buttonGroup](./examples/buttonGroup.md)| Bootstrap Button Group
| [checkbox]('./examples/checkbox.md)   | Standard HTML checkbox input.
| [clone]('./examples/clone.md)         | A set of text fields with a button to add/remove fields.
| [color]('./examples/color.md)         | Standard HTML color input.
| [date]('./examples/date.md)           | Standard HTML date input.
| [datetime-local]('./examples/datetime-local.md)| Standard HTML datetime-local input.
| [email]('./examples/email.md)         | Standard HTML email input. Email validation is built in, but optional.
| [file]('./examples/file.md)           | Standard HTML file input.
| [hidden]('./examples/hidden.md)       | Standard HTML hidden input.
| [html]('./examples/html.md)           | Enter your own html string.
| [image]('./examples/image.md)         | Standard HTML image input.
| [label]('./examples/label.md)         | Standard HTML label element.
| [month]('./examples/month.md)         | Standard HTML month input.
| [number]('./examples/number.md)       | Standard HTML number input.
| [password]('./examples/password.md)   | Standard HTML password input.
| [radio]('./examples/radio.md)         | Standard HTML radio input.
| [range]('./examples/range.md)         | Standard HTML range input.
| [reset]('./examples/reset.md)         | Standard HTML reset button element - rendered with button tag, not input. Will automatically reset your form without configuration.
| [search]('./examples/search.md)       | Standard HTML search input.
| [select]('./examples/select.md)       | Standard HTML select element.
| [state]('./examples/state.md)         | Sets all 50 US states in a select element. Also able to add US Territories, Mexican states, and Canadian Provinces.
| [submit]('./examples/submit.md)       | Standard HTML submit button element - rendered with button tag, not input.
| [tel]('./examples/tel.md)             | Standard HTML tel input. Phone validation is built in, but optional.
| [text]('./examples/text.md)           | Standard HTML text input.
| [textarea]('./examples/textarea.md)   | Standard HTML textarea element.
| [time]('./examples/time.md)           | Standard HTML time input.
| [url]('./examples/url.md)             | Standard HTML url input.
| [week]('./examples/week.md)           | Standard HTML week input.
| [zip]('./examples/zip.md)             | HTML text input with zip code validation built in, but optional.


##Properties

---

| Name              | Type          | Description                                                                                                           |
|-------------------|---------------|-----------------------------------------------------------------------------------------------------------------------|
| accept            | string        | *Used with type 'file'* - specifies accepted file types. See [file](./examples/file.md).
| addon             | string        | *Used with type 'clone'* - specifies an input-group addon. See [Clone](./examples/clone.md).
| alt               | string        | *Used with type 'image'* - specifies alt tag text. See [image](./examples/image.md).
| autocomplete      | string        | Toggles autocomplete for single element. Accepts "on" or "off".
| autofocus         | boolean       | Sets HTML5 autofocus attribute for element (only 1 per page).
| checked           | string/array  | *Used with types 'checkbox, radio'* - specifies pre-checked boxes. See [checkbox](./examples/checkbox.md) and [radio](./examples/checkbox.md).
| classname         | string        | Specifies class names for element. 'form-control' is active by default for text elements.
| cols              | number        | *Used with type 'textarea'* - specifies number of columns. See [textarea](./examples/textarea.md).
| [data](./examples/properties/data.md)| object        | Assigns data- attributes to element. See [data](./examples/properties/data.md).
| defaultSelected   | string        | *Used with type 'state'* - Sets the default selected value. See [state](./examples/state.md).
| disabled          | boolean       | Sets HTML5 disabled attribute on element.
| element           | string        | *Used with type 'html'* - Specifies html string to render. See [html](./examples/html.md).
| formaction        | string        | *Used with type 'submit, image'* - Sets HTML formaction attribute. See [submit](./examples/submit.md).
| formenctype       | string        | *Used with type 'submit'* - Sets HTML formenctype attribute. See [submit](./examples/submit.md).
| formGroup         | boolean       | Wraps element in a Bootstrap form-group div. Default is true.
| formmethod        | string        | *Used with type 'submit'* - Sets HTML formmethod attribute. See [submit](./examples/submit.md).
| formnovalidate    | string        | *Used with type 'submit'* - Sets HTML formnovalidate attribute. See [submit](./examples/submit.md).
| formtarget        | string        | *Used with type 'submit'* - Sets HTML formtarget attribute. See [submit](./examples/submit.md).
| height            | number        | *Used with type 'image'* - specifies element height. See [image](./examples/image.md).
| helpBlock         | string        | Inserts a Bootstrap help block below element.
| id                | string        | Assigns element an id. If no id is present, the name field will also be the id.
| inline            | boolean       | *Used with type 'button, submit, reset, image, checkbox, radio'* - Assigns 'inline-block' css property to element.
| [inputGroup](./examples/properties/inputGroup.md)| object        | Adds a Bootstrap input group to the element. See [inputGroup](./examples/properties/inputGroup.md).
| label             | string        | Adds a label before the element.
| mask              | string        | Adds a masked input to a text element. [Requires external plugin](https://github.com/digitalBush/jquery.maskedinput).
| match             | string        | *Used with type 'password'* - used to match passwords when you have a 'repeat password' field. See [password](./examples/password.md).
| max               | number        | *Used with types 'number, date, range, datetime-local, month, time, week'* - sets maximum accepted value. See [number](./examples/number.md).
| maxFields         | number        | *Used with type 'clone'* - sets the maximum allowed fields to be dynamically generated. See [clone](./examples/clone.md).
| maxlength         | number        | Sets a maxlength property on the field. This will also be validated in javascript.
| [messages](./examples/properties/messages.md)| object        | Overrides the default validation messages. See [messages](./examples/properties/messages.md).
| min               | number        | *Used with types 'number, date, range, datetime-local, month, time, week'* - sets minimum accepted value. See [number](./examples/number.md).
| minlength         | number        | Sets a minlength property on the field. This will also be validated in javascript.
| multiple          | boolean       | *Used with types 'select, state, file'* - Enable multiple selections. See [select](./examples/select.md), [state](./examples/state.md), and [file](./examples/file.md).
| name              | string        | Gives the element a name. Will also assign the name to the id if no id is specified.
| options           | object/array  | *Used with types 'select, checkbox, radio'* - Sets the options with key-value pairs.
| pattern           | string/regex  | Sets HTML5 pattern attribute (Regex strings are difficult to pass in json format).
| placeholder       | string        | Sets a placeholder in text-based elements.
| readonly          | boolean       | Sets HTML5 readonly attribute.
| required          | boolean       | Sets HTML5 required attribute. These fields are also validated in javascript.
| rows              | number        | *Used with type 'textarea'* - Sets the number of rows. See [textarea](./examples/textarea.md).
| selected          | string        | *Used with types 'select, state'* - Preselects a select value. See [select](./examples/select.md) and [state](./examples/state.md).
| size              | number        | *Used with types 'text, search, tel, url, email, password'* - Sets the input size.
| src               | string        | *Used with type 'image'* - Sets the image source. See [image](./examples/image.md).
| start             | number        | *Used with type 'clone'* - Sets the number of text fields to start with. See [clone](./examples/clone.md).
| step              | number        | *Used with types 'number, range, date, datetime-local, month, time'* - Sets the step attribute.
| submitType        | string        | *Used with type 'checkbox' - Sets the type of value you would like the form to submit for you. See [checkbox](./examples/checkbox.md).
| tabindex          | number        | Sets the tab index (not working with checkboxes, radios yet)
| title             | string        | Sets the HTML title attribute.
| type              | string        | Sets the element type.
| validate          | boolean       | *Used with types 'email, zip, tel'* - Specifies if you would like to validate the form field.
| value             | string        | Sets a value to the field.
| width             | number        | *Used with type 'image'* - specifies element width. See [image](./examples/image.md).
| wrap              | string        | *Used with type 'textarea'* - Sets HTML wrap attribute.


##Validation
---

By default, validation will happen when you specify certain properties in your json file. All fields will be checked for values and sanitized. Error messages will be generated, and it will basically take care of itself.

- ***required*** - adds required tag and ensures a value is in place

- ***minlength*** - adds minlength tag and checks with javascript

- ***maxlength*** - adds maxlength tag and double checks it with javascript

- ***pattern*** - will validate input against a regex of your choosing

- ***min*** - adds min tag and checks

- ***max*** - adds max tag and checks

- ***match*** - enter in the id of an element to check against. This will check that these values match (Mostly for password confirmation). You can customize the error message with the 'invalid' message.

###Validation Messages

----------------------------------------

By default, there are messages in place that warn the user about missing/invalid fields. They are inside hidden Bootstrap alert divs. If you do not specify a value, they will name each field by whatever value you have on the label. If you don't have a label, they will find a placeholder value.

These messages can be customized for each field, if you need. See the examples below.

There are five specific types of message that can appear for each field:

 - ***required*** - "[field name] is a required field"

    - triggered (on submit) when a required field is left blank

 - ***minlength*** - "[field name] must have a minimum of * characters"

    - triggered (as you type) when a minlength has not been met

 - ***invalid*** - "[field name] must be valid"

    - triggered (as you type) when certain criteria have not been met. (email/zip/phone not valid, regex pattern not matching, passwords not matching, etc.)

 - ***min*** - "[field name] must have a minimum value of *."

    - triggered (as you type) when a minimum has not been met (numbers, dates)

 - ***max*** - "[field name] must have a maximum value of *."

    - triggered (as you type) when a max has been overshot

There are also some default form messages that will display on the bottom of the form if the user tries to submit unsuccessfully. These can be customized in the plugin initilization, as mentioned in the 'Options' section.

##Destroy Method

------------------------------------------

NosForm does come with a destroy method:

```javascript
$('#myform').nosForm('destroy')
```

This will empty the form, keeping your actual form tag intact, while removing all options and event listeners.

























