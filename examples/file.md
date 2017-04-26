# Type #
## file ##

Because the handling of file uploads can vary, your files will submitted to your success function as a filelist. From there, you are free to handle them appropriately.

#### Example with all options ####

```javascript
{
    "name": "fileExample",
    "id": "fileId",
    "type": "file",
    "label": "File Upload Example",
    "formGroup": true,
    "classname": "",
    "disabled": false,
    "autofocus": false,
    "data": {
        "field": 0,
        "testing": 123,
    },
    "helpBlock": "Only image files are accepted",
    "title": "File Upload Example",
    "required": true,
    "accept": "image/*",
    "multiple": true
}
```

#### More practical example ####

```javascript
{
    "name": "fileExample",
    "type": "file",
    "label": "File Upload Example",
    "helpBlock": "Only image files are accepted",
    "required": true,
    "accept": "image/*",
    "multiple": true
}
```

### Submitting files to server ###

The easiest way to submit form fields and files simultaneously. Although you will have to delete any unnecessary fields (eg: buttons, honeypots, etc).

```javascript
submit: function (formdata) {
    var fd = new FormData($('form')[0]);
    $.ajax({
        url: './upload',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        cache: false
    })
    .done(function (res) {
        console.log(res);
    })
    .fail(function (xhr, status, err) {
        console.log(err);
    });
}
```

#### Submitting files to server - Single file ####

Sometimes it's just easier to manually append file names to a FormData object.

```javascript
submit: function (formdata) {
    var fd = new FormData();
    fd.append('myfile', formdata.myfilefield[0]);
    fd.append('sometextfield', formdata.textfield);
    //... other text fields appended there
    $.ajax({
        url: './upload',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        cache: false
    })
    .done(function (res) {
        console.log(res);
    })
    .fail(function (xhr, status, err) {
        console.log(err);
    });
}
```

#### Submitting files to server - Multiple files ####
```javascript
submit: function (formdata) {
    var fd = new FormData();
    $.each(formdata.myfilefield, function (i) {
        fd.append('myfile', formdata.myfilefield[i]);
    });
    // Lets say we have a lot of text fields to send with the files
    // first delete the file object
    delete formdata.myfilefield;
    // loop through the fields and append them to the formData object
    $.each(formdata, function (k, v) {
        fd.append(k, v);
    });
    $.ajax({
        url: './upload',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        cache: false
    })
    .done(function (res) {
        console.log(res);
    })
    .fail(function (xhr, status, err) {
        console.log(err);
    });
}
```
