# Type #
## password ##

#### Example with all options ####

```javascript
{
    "name": "passwordExample",
    "id": "passwordId",
    "type": "password",
    "match": "otherpasswordid", // if this is a 'confirm password' field, enter the id of the password field to match here and it will validate/display messages
    "label": "Password Example",
    "title": "Password Example",
    "required": true,
    "autofocus": false,
    "disabled": false,
    "readonly": false,
    "placeholder": "Password",
    "classname": "form-control",
    "formGroup": true,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "minlength": 6,
    "maxlength": 20,
    "messages": {
        "required": "You must enter a password!",
        "minlength": "Your password must be at least 6 characters",
        "invalid": "Your passwords do not match!" // add the 'invalid' message when you are confirming passwords
    }
}
```

## Repeat password example ##

Used mainly for signup forms, this will allow you to easily verify passwords.

Using the match property, you can pass in the id of the first password field to make sure they are identical.

```javascript
{
    "name": "password1",
    "type": "password",
    "label": "Enter Password",
    "required": true,
    "minlength": 8,
    "maxlength": 40,
    "messages": {
        "required": "You must enter a password!",
        "minlength": "Your password must be at least 8 characters!"
    }
},
{
    "name": "password2",
    "type": "password",
    "label": "Enter Password",
    "match": "password1",
    "required": true,
    "minlength": 8,
    "maxlength": 40,
    "messages": {
        "required": "You must enter your password again!",
        "invalid": "Your passwords do not match!"
    }
}
```
