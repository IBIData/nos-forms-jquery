/* global jQuery */
; (function ($, window, document, undefined) {

    "use strict";
    
    // Create the defaults
    var defaults = {
        fields: {},
        animationSpeed: 100,
        validate: true,
        htmlValidation: false,
        honeypot: true,
        messages: {
            required: 'Please fill out all required fields',
            invalid: 'Please correct errors'
        }
    };
        
    // The plugin constructor
    function Nos(element, options) {
                
        // need access to this later
        var self = this;
                
        // form element
        this.form = $(element);
                
        // final plugin settings
        this.settings = $.extend({}, defaults, options);
        this.settings.messages = $.extend({}, defaults.messages, options.messages);
        // need access to this later
        var userdata = this.settings;
                
        // Store arrays of element types
        // These are used to determine which function will be called from the 'getElements' object below
        this.elements = {
            text: ['text', 'email', 'tel', 'password', 'number', 'hidden', 'zip', 'date', 'week', 'time', 'month', 'datetime-local', 'search', 'url'],
            textarea: ['textarea'],
            buttons: ['submit', 'reset', 'button', 'image'],
            select: ['select'],
            file: ['file'],
            check: ['checkbox', 'radio'],
            state: ['state'],
            clone: ['clone'],
            html: ['html'],
            other: ['range', 'color']
        };
                
        // takes user form object and converts to string fragments for creating html
        this.getAttrs = function (input) {

            return $.extend({}, input, {
                type: input.type && ' type="' + input.type + '"' || '',
                name: input.name && ' name="' + input.name + '"' || '',
                id: (input.id || input.name) && ' id="' + (input.id || input.name) + '"' || '',
                minlength: input.minlength && ' minlength="' + input.minlength + '"' || '',
                maxlength: input.maxlength && ' maxlength="' + input.maxlength + '"' || '',
                required: input.required && ' required' || '',
                value: input.value && ' value="' + input.value + '"' || '',
                placeholder: input.placeholder && ' placeholder="' + input.placeholder + '"' || '',
                formGroup: (input.formGroup || input.formGroup === undefined) && this.getElements.formGroup() || { start: '', end: '' },
                label: input.label && this.getElements.label(input) || '',
                helpBlock: input.helpBlock && '<span id="' + (input.id || input.name) + '-help-block" class="help-block nos-help-block">' + input.helpBlock + '</span>' || '',
                classname: input.classname && ' class="' + input.classname + '"' || '',
                multiple: input.multiple && ' multiple' || '',
                autofocus: input.autofocus && ' autofocus' || '',
                disabled: input.disabled && ' disabled' || '',
                readonly: input.readonly && ' readonly' || '',
                title: input.title && ' title="' + input.title + '"' || '',
                size: input.size && ' size="' + input.size + '"' || '',
                message: self.getUserErrorMessages(input) // returns object that stores user error messages
            });

        },
                
        // assigns an object to the 'message' property above
        // this will contain the user error messages that will display on the form
        this.getUserErrorMessages = function (element) {
            return $.extend({}, {
                required: element.required && self.userErrorMessage.required(element) || '',
                valid: (element.type === 'email' || element.type === 'zip' || element.type === 'tel' || element.pattern || element.match) && self.userErrorMessage.valid(element) || '',
                minlength: (element.minlength && element.minlength > 1) && self.userErrorMessage.minlength(element) || '',
                min: (element.min && element.min > 1) && self.userErrorMessage.min(element) || '',
                max: element.max && self.userErrorMessage.max(element) || ''
            });
        };
                
        // Group of functions used to return a form element
        this.getElements = {

            self: this,
                    
            // returns bootstrap form-group div
            formGroup: function () {
                return {
                    start: '<div class="form-group nos-group">',
                    end: '</div>'
                };
            },

            honeypot: function () {
                return '<div id="nos-div-hp-css"><label for="nos-text-css">Please leave this field blank</label><input type="text" id="nos-text-css" name="nos-text-css[]" value=""></div><div id="nos-div-hp-js"><label for="nos-email-js">Please leave this field unchanged</label><input type="email" id="nos-email-js" name="nos-email-js[]" value="validemail@email.com"></div>';
            },

            div: function (classname) {
                return {
                    start: '<div class="' + classname + '">',
                    end: '</div>'
                };
            },

            fieldset: function (id) {
                return {
                    start: '<fieldset id="' + id + '" class="nos-fieldset">',
                    end: '</fieldset>'
                };
            },

            label: function (input) {
                var required;
                input.required ? required = ' required-field' : required = '';
                return '<label for="' + (input.id || input.name) + '" class="nos-label' + required + '">' + input.label + '</label>';
            },
                    
            // returns text-based elements
            text: function (input) {
                var el = $.extend(this.self.getAttrs(input), {
                    pattern: input.pattern && ' pattern="' + input.pattern + '"' || '',
                    autocomplete: input.autocomplete && ' autocomplete="' + input.autocomplete + '"' || '',
                    step: input.step && ' step="' + input.step + '"' || '',
                    min: input.min && ' min="' + input.min + '"' || '',
                    max: input.max && ' max="' + input.max + '"' || '',
                    classname: input.classname && ' class="form-control ' + input.classname + '"' || ' class="form-control"'
                });
                var element = el.formGroup.start + el.label +
                    '<input data-nos' + el.type + el.name + el.id + el.minlength + el.maxlength + el.placeholder + el.classname +
                    el.value + el.title + el.min + el.max + el.step + el.size + el.pattern + el.autocomplete + el.multiple + el.readonly +
                    el.disabled + el.autofocus + el.required + '>' + el.helpBlock +
                    el.message.required + el.message.minlength + el.message.valid + el.message.min + el.message.max +
                    el.formGroup.end;
                return element;
            },
                   
            // returns buttons
            buttons: function (input) {
                var nosgroup = input.formGroup && 'nos-form-group nos-group ' || '',
                    inline = input.inline && 'nos-inline' || '';
                var el = $.extend(this.self.getAttrs(input), {
                    src: input.src && ' src="' + input.src + '"' || '',
                    alt: input.alt && ' alt="' + input.alt + '"' || '',
                    formaction: input.formaction && ' formaction="' + input.formaction + '"' || '',
                    formenctype: input.formenctype && ' formenctype="' + input.formenctype + '"' || '',
                    formmethod: input.formmethod && ' formmethod="' + input.formmethod + '"' || '',
                    formnovalidate: input.formnovalidate && ' formnovalidate' || '',
                    formtarget: input.formtarget && ' formtarget="' + input.formtarget + '"' || '',
                    height: input.height && ' height="' + input.height + '"' || '',
                    width: input.width && ' width="' + input.width + '"' || '',
                    formGroup: (input.formGroup || input.inline) && this.div(nosgroup + inline) || { start: '', end: '' }
                });
                var element = el.formGroup.start +
                    '<input data-nos' + el.type + el.name + el.id + el.classname + el.title + el.src + el.alt + el.height + el.width +
                    el.formtarget + el.formmethod + el.formaction + el.formenctype + el.disabled + el.value + el.formnovalidate + '>&nbsp;' +
                    el.formGroup.end;
                return element;
            },
                    
            // returns textarea elements
            textarea: function (input) {
                var el = $.extend(this.self.getAttrs(input), {
                    rows: input.rows && ' rows="' + input.rows + '"' || '',
                    cols: input.cols && ' cols="' + input.cols + '"' || '',
                    wrap: input.wrap && ' wrap="' + input.wrap + '"' || '',
                    classname: input.classname && ' class="form-control ' + input.classname + '"' || ' class="form-control"'
                });
                var element = el.formGroup.start + el.label +
                    '<textarea data-nos' +
                    el.name + el.id + el.title + el.minlength + el.maxlength + el.placeholder + el.classname + el.value + el.rows + el.cols + el.wrap + el.readonly + el.disabled + el.autofocus + el.required +
                    '></textarea>' + el.helpBlock +
                    el.message.required + el.message.minlength +
                    el.formGroup.end;
                return element;
            },
                    
            // returns select elements
            select: function (input) {
                var selOptions = {};
                if (input.options.length) {
                    $.each(input.options, function () {
                        $.extend(selOptions, this);
                    });
                } else {
                    selOptions = input.options;
                }
                var options = '';
                var el = $.extend(this.self.getAttrs(input), {
                    classname: input.classname && ' class="form-control ' + input.classname + '"' || ' class="form-control"'
                });
                $.each(selOptions, function (k, v) {
                    var selectedOption;
                    el.selected === k ? selectedOption = ' selected' : selectedOption = '';
                    options += '<option value="' + k + '" ' + selectedOption + '>' + v + '</option>';
                });
                var element = el.formGroup.start + el.label +
                    '<select data-nos' +
                    el.name + el.id + el.classname + el.multiple + el.title + el.size + el.readonly + el.disabled + el.autofocus + el.required + '>' +
                    options +
                    '</select>' + el.helpBlock +
                    el.message.required +
                    el.formGroup.end;
                return element;
            },
                    
            // returns checkbox and radio elements
            check: function (input) {
                var inputOptions = {};
                if (input.options.length) {
                    $.each(input.options, function () {
                        $.extend(inputOptions, this);
                    });
                } else {
                    inputOptions = input.options;
                }
                var checked = '';
                var el = $.extend(this.self.getAttrs(input), {
                    inline: input.inline && ' class="' + input.type + '-inline"' || '',
                    name: (input.name && input.type === 'checkbox') ? ' name="' + input.name + '[]' + '"' : ' name="' + input.name + '"',
                    id: ' id="' + input.name + '-',
                    div: !input.inline && this.div(input.type) || { start: '', end: '' },
                    fieldset: this.fieldset(input.name) || { start: '', end: '' }
                });

                var element = el.formGroup.start + el.label + el.fieldset.start;

                $.each(inputOptions, function (k, v) {
                    if (typeof input.checked === 'object' || input.checked === undefined) {
                        $.inArray(k, input.checked) > -1 ? checked = ' checked' : checked = '';
                    } else if (typeof input.checked === 'string') {
                        k === input.checked ? checked = ' checked' : checked = '';
                    } else {
                        console.warn('Your checkbox/radio "checked" property must be an object or string');
                    }
                    element += el.div.start +
                    '<label' + el.inline + '><input data-nos' +
                    el.type + el.name + el.title + el.id + k + '" ' + el.classname + ' value="' + k + '"' + checked + el.disabled + el.autofocus + el.required +
                    '>' +
                    v +
                    '</label>' + el.helpBlock +
                    el.div.end;
                });

                element += el.fieldset.end +
                el.message.required +
                el.formGroup.end;
                return element;
            },
                    
            // returns file elements
            file: function (input) {
                var el = $.extend(this.self.getAttrs(input), {
                    accept: input.accept && ' accept="' + input.accept + '"' || '',
                    div: input.classname && this.div(input.classname) || { start: '', end: '' }
                });
                var element = el.formGroup.start + el.label +
                    el.div.start +
                    '<input data-nos' + el.type + el.name + el.id + el.title + el.accept + el.multiple + el.disabled + el.autofocus + el.required +
                    '>' + el.helpBlock +
                    el.message.required +
                    el.div.end +
                    el.formGroup.end;
                return element;
            },

            // custom html element
            html: function (input) {

                return input.element;

            },

            other: function (input) {
                var el = $.extend(this.self.getAttrs(input), {
                    step: input.step && ' step="' + input.step + '"' || '',
                    min: input.min && ' min="' + input.min + '"' || '',
                    max: input.max && ' max="' + input.max + '"' || ''
                });
                var element = el.formGroup.start + el.label +
                    '<input data-nos' + el.type + el.name + el.id + el.classname +
                    el.value + el.title + el.min + el.max + el.step + el.readonly +
                    el.disabled + el.autofocus + el.required + '>' + el.helpBlock +
                    el.message.required + el.message.min + el.message.max +
                    el.formGroup.end;
                return element;
            },

            // build clone fields
            clone: function (input) {

                var maxFields = (input.maxFields || 10) + 1,
                    startFields = (input.start || 1),
                    hideFields,
                    element = '',
                    i;

                // assign attributes 
                var el = $.extend(this.self.getAttrs(input), {
                    placeholder: input.placeholder && input.placeholder || '',
                    classname: input.classname && input.classname || 'form-control',
                    addValue: input.addButtonValue && input.addButtonValue || 'Add Field',
                    removeValue: input.removeButtonValue && input.removeButtonValue || 'Remove Field',
                    addButtonClass: input.addButtonClass && input.addButtonClass || 'btn btn-primary',
                    removeButtonClass: input.removeButtonClass && input.removeButtonClass || 'btn btn-danger',
                    name: input.name && ' name="' + input.name || ''
                });
                
                element += el.formGroup.start;

                element += el.label;

                // loop to build clone input fields
                for (i = 1; i < maxFields; i++) {

                    var addon = (input.addon || i);

                    i <= startFields ? hideFields = '' : hideFields = ' hidden';

                    var div = this.div('input-group nos-input-group' + hideFields);

                    element +=

                    el.formGroup.start +

                    div.start +

                    '<span class="input-group-addon nos-input-group-addon">' + addon + '</span>' +
                    '<input data-nos type="text" class="nos-clone ' + el.classname + '"' + el.name + i + '[]" >' +

                    div.end +

                    el.formGroup.end;

                }
                
                element += el.formGroup.end; 

                element += el.helpBlock;

                element += '<input type="button" data-nos-add-button class="' + el.addButtonClass + ' nos-form-group" value="' + el.addValue + '">&nbsp;<input type="button" data-nos-remove-button value="' + el.removeValue + '" class="' + el.removeButtonClass + ' nos-form-group">';


                return element;

            },
                    
            // returns select box with 50 states/territories/Canadian Provinces
            // the user specifies what to include, and this function will combine the appropriate objects to create the select element
            state: function (input) {

                var territories = { "American Samoa": "AS", "Federated States Of Micronesia": "FM", "Guam": "GU", "Marshall Islands": "MH", "Northern Mariana Islands": "MP", "Palau": "PW", "Puerto Rico": "PR", "Virgin Islands": "VI" };

                var states = { "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY" };

                var provinces = { "Alberta": "AB", "British Columbia": "BC", "Manitoba": "MB", "New Brunswick": "NB", "Newfoundland and Labrador": "NL", "Nova Scotia": "NS", "Northwest Territories": "NT", "Nunavut": "NU", "Ontario": "ON", "Prince Edward Island": "PE", "Quebec": "QC", "Saskatchewan": "SK", "Yukon": "YT" };
                        
                // this function orders our state object alphabetically by key
                function sortObject(obj, order) {
                    var key,
                        i,
                        tempArray = [],
                        tempObj = {};

                    for (key in obj) {
                        tempArray.push(key);
                    }

                    tempArray.sort(function (a, b) {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });

                    if (order === 'desc') {
                        for (i = tempArray.length - 1; i >= 0; i--) {
                            tempObj[tempArray[i]] = obj[tempArray[i]];
                        }
                    } else {
                        for (i = 0; i < tempArray.length; i++) {
                            tempObj[tempArray[i]] = obj[tempArray[i]];
                        }
                    }
                    return tempObj;
                }
                        
                // function to combine the objects and call the sort function once that is done
                // after object is complete, we create the html
                var stateObj = sortObject($.extend(states, (input.usTerritory && territories), (input.canada && provinces))),
                    options = '<option value="">' + (input.defaultSelected || "Select One...") + '</option>';
                var el = $.extend(this.self.getAttrs(input), {
                    classname: input.classname && ' class="form-control ' + input.classname + '"' || ' class="form-control"'
                });
                $.each(stateObj, function (k, v) {
                    var selectedOption;
                    el.selected === v ? selectedOption = ' selected' : selectedOption = '';
                    options += '<option value="' + v + '" ' + selectedOption + '>' + k + '</option>';
                });
                var element = el.formGroup.start + el.label +
                    '<select data-nos ' + el.name + el.id + el.classname + el.size + el.multiple + el.readonly + el.disabled + el.autofocus + el.required +
                    '>' +
                    options +
                    '</select>' + el.helpBlock +
                    el.message.required +
                    el.formGroup.end;
                return element;
            }
        };
                
        // field validation messages
        this.userErrorMessage = {

            required: function (el) {
                var message;
                el.messages ? message = el.messages.required : message = null;
                return '<div style="display: none;" class="alert alert-danger nos-help nos-required msg-required-' + el.name + '">' + (message || (el.label || el.placeholder || 'This') + ' is a required field') + '</div>';
            },

            valid: function (el) {
                var message;
                el.messages ? message = el.messages.invalid : message = null;
                return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-invalid-' + el.name + '">' + (message || (el.label || el.placeholder || 'This field') + ' must be valid') + '</div>';
            },

            minlength: function (el) {
                var message;
                el.messages ? message = el.messages.minlength : message = null;
                return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-minlength-' + el.name + '">' + (message || (el.label || el.placeholder || 'This field') + ' must have a minimum of ' + el.minlength + ' characters') + '</div>';
            },

            min: function (el) {
                var message;
                el.messages ? message = el.messages.min : message = null;
                return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-min-' + el.name + '">' + (message || (el.label || el.placeholder || 'This field') + ' must have a minimum value of ' + el.min) + '</div>';
            },

            max: function (el) {
                var message;
                el.messages ? message = el.messages.max : message = null;
                return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-max-' + el.name + '">' + (message || (el.label || el.placeholder || 'This field') + ' must have a maximum value of ' + el.max) + '</div>';
            },

            form: {
                required: function (form) {
                    return '<div style="display: none;" class="alert alert-danger nos-help nos-form-required msg-required-' + (form.name || form.id) + '">' + self.settings.messages.required + '</div>';
                },
                invalid: function (form) {
                    return '<div style="display: none;" class="alert alert-warning nos-help nos-form-invalid msg-invalid-' + (form.name || form.id) + '">' + self.settings.messages.invalid + '</div>';
                }
            }
        };
                
        // field validation functions
        this.validator = {

            email: function (email) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },

            phone: function (tel) {
                return /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(tel);
            },

            zipcode: function (zip) {
                return /^\d{5}(-\d{4})?$/.test(zip);
            },
                    
            // sanitizes text-based form inputs
            sanitize: function (input) {
                var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                    replace(/<[\/\!]*?[^<>]*?>/gi, '').
                    replace(/<style[^>]*?>.*?<\/style>/gi, '').
                    replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
                return output;
            }

        };
                
        // validation that runs on form submit
        this.submitValidation = function (data) {

            var form = $(data).serializeArray(),
                formdata = {};
                        
            // assign serialized form object properties to new form submit object, unless it is a checkbox field
            $.each(form, function (key, value) {
                if (value.name.indexOf('[]') === -1) {
                    formdata[value.name] = value.value;
                }
            });
                
            // selectors for required fields
            var reqInput = $('[data-nos]:not(:radio, :checkbox, :button, :submit, :reset, :file, :image, select)').filter('[required]:visible'),
                reqSR = $('select[data-nos]').filter('[required]:visible'),
                fileField = $(':file[data-nos]').filter('[required]:visible'),
                cbgroup = $(':checkbox[data-nos]').parents('fieldset'),
                cb = $(':checkbox[data-nos], :radio[data-nos]').filter('[required]:visible').parents('fieldset'),
                requiredFields = $('[data-nos]:not(:file, input[type=range], input[type=color])').filter('[required]:visible'),
                clone = $('.nos-clone');

            requiredFields.each(function () {
                $(this).val().length < 1 ? $(this).alterClass('nos-valid-required', 'nos-invalid-required') : $(this).alterClass('nos-invalid-required', 'nos-valid-required');
                $(this).on('change keyup keydown blur paste', function () {
                    $(this).val().length < 1 ? $(this).alterClass('nos-valid-required', 'nos-invalid-required') : $(this).alterClass('nos-invalid-required', 'nos-valid-required');
                });
            });
            
            if (clone.length) {
                var cloneName = $(clone).parents().siblings('.nos-label').attr('for');
                    formdata[cloneName] = {};
                $.each(clone, function () {
                    var cloneFieldName = $(this).attr('name').split('[]');
                   if ($(this).val() !== "") { 
                       formdata[cloneName][cloneFieldName[0]] = $(this).val(); 
                   }
                });
            }
                   
            // checkbox and radio validation
            // build individual arrays for each required field and check to see if arrays are empty on form submit
            if (cb) {
                var cba = {},
                    cmsg = {};
                cb.each(function (i) {
                    var checkboxes = $(this).find(':checkbox, :radio');
                    cmsg[i] = '.msg-required-' + $(this).attr('id');
                    cba[i] = [];
                    $(checkboxes).each(function () {
                        $(this).is(':checked') && cba[i].push(this.value);
                    });
                    cba[i].length < 1 && $(cmsg[i]).nosSlideDown();
                    $(checkboxes).change(function () {
                        $.inArray(this, cba[i]) > -1 ? cba[i].splice(this, 1) : cba[i].push(this);
                        cba[i].length > 0 && $(cmsg[i]).nosSlideUp();
                    });
                });
            }

            // create checkbox object for form submit response
            if (cbgroup) {
                var obj = {};
                cbgroup.each(function (i) {
                    var str = $(this).attr('id'),
                        fcb = $(this).find(':checkbox');
                    obj[i] = {};
                    fcb.each(function () {
                        var uid = $(this).attr('value');
                        obj[i][uid] = this.checked;
                    });
                    formdata[str] = obj[i];
                });
            }
                
            // check all text-based fields for a blank value
            $(reqInput).each(function (i) {
                var field = reqInput[i],
                    msg = '.msg-required-' + field.name,
                    mask = $(this).attr('data-mask');
                field.value = self.validator.sanitize(field.value);
                if (mask) {
                    if ($(field).caret().begin < 1) {
                        $(msg).nosSlideDown();
                        $(this).on('keyup keydown change blur paste', function () {
                            $(this).caret().begin > 0 && $(msg).nosSlideUp();
                            $(this).caret().begin < 1 && $(msg).nosSlideDown();
                        });
                    }
                } else {
                    if ($(field).val().length < 1) {
                        $(msg).nosSlideDown();
                        $(this).on('keyup keydown change blur paste', function () {
                            this.value.length > 0 && $(msg).nosSlideUp();
                            this.value.length < 1 && $(msg).nosSlideDown();
                        });
                    }
                }

            });
                
            // select Required field validation
            $(reqSR).each(function (i) {
                var sfield = reqSR[i],
                    msg = '.msg-required-' + sfield.name;
                if ($(sfield).val() === '') {
                    $(msg).nosSlideDown();
                    $(this).change(function () {
                        $(this).val() !== '' && $(msg).nosSlideUp();
                        $(this).val() === '' && $(msg).nosSlideDown();
                    });
                }
            });
                    
            // file Required field validation
            $(fileField).each(function (i) {
                var field = fileField[i];
                var msg = '.msg-required-' + field.name;
                var filelist = (document.getElementById(field.id).files || document.getElementById(field.id).value); // ie8 doesn't support 'files'
                if (filelist.length === 0) {
                    $(msg).nosSlideDown();
                    $(this).change(function () {
                        $(this).val() !== '' && $(msg).nosSlideUp();
                        $(this).val() === '' && $(msg).nosSlideDown();
                    });
                }
                formdata[field.name] = filelist;
            });
                        
            // send form submit object back to user if all fields are valid
            if (!$('.nos-help').is(':visible') && !$('.nos-untouched[required]').is(':visible') && $('#nos-text-css').val() === '' && $('#nos-email-js').val() === 'validemail@email.com') {
                userdata.submit(formdata);
            }

            else if (!$('.nos-help').is(':visible') && $('.nos-untouched[required]').is(':visible')) {
                $('[data-nos]').each(function () {
                    $(this).focus();
                });
            }

            else {
                if ($('.nos-required').is(':visible')) {
                    $('.nos-form-required').nosSlideDown();
                    $(':input, select, textarea').filter('[data-nos]').on('change input keyup blur focus paste', function () {
                        if ($('.nos-required').is(':visible')) {
                            $('.nos-form-required').nosSlideDown();
                        } else {
                            $('.nos-form-required').nosSlideUp();
                        }
                    });
                }
                if ($('.nos-invalid').is(':visible')) {
                    $('.nos-form-invalid').nosSlideDown();
                    $(':input, select, textarea').on('change input keyup blur focus paste', function () {
                        if ($('.nos-invalid').is(':visible')) {
                            $('.nos-form-invalid').nosSlideDown();
                        } else {
                            $('.nos-form-invalid').nosSlideUp();
                        }
                    });
                }
            }
        };
                
        // this function handles real time error messages while user is typing
        this.validate = function (fields) {

            var allFields = $('[data-nos]:not(:submit, :reset, :button, :image, :checkbox, :radio, input[type=color], input[type=range])');

            allFields.addClass('nos-untouched');

            allFields.on('focus change input', function () {
                $(this).alterClass('nos-untouched', 'nos-touched');
            });

            allFields.on('keydown change paste', function () {
                $(this).val().length > 0 && $(this).attr('class').indexOf('nos-invalid-') !== 1 ? $(this).addClass('nos-valid-field') : $(this).removeClass('nos-valid-field');
            }).on('blur change', function () {
                $(this).removeClass('nos-valid-field');
            });
            
            // resets form
            function reset() {
                $(':reset[data-nos]').click(function () {
                    $(this).closest('form').find(':input:not(:submit, :reset, :button, :image)').val('').alterClass('nos-*', '').addClass('nos-untouched');
                    $('.nos-help').nosSlideUp();
                });
            }
                    
            // checks maxlength on fields if browser doesn't catch/support it
            function maxLength(v) {
                var maxLengthId = (v.id || v.name);
                $('#' + maxLengthId).keydown(function (e) {
                    if ($(this).val().length > v.maxlength) {
                        e.preventDefault();
                    }
                });
            }
                    
            // validates that the minlength has been met and displays/hides message to user
            function minLength(v) {
                var msg = '.msg-minlength-' + v.name;
                var id = '#' + (v.id || v.name);
                $(id).on('keyup change blur focus paste', function () {
                    var minval = $(this).val().length;
                    if (minval > 0) {
                        minval < v.minlength ? ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-minlength', 'nos-invalid-minlength')) : ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-minlength', 'nos-valid-minlength'));
                    } else {
                        $(msg).nosSlideUp();
                        $(this).removeClass('nos-invalid-minlength nos-valid-minlength');
                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-minlength');
                });
            }
                    
            // validates the min and max attributes on number fields
            function minMax(v) {
                var minMsg = '.msg-min-' + v.name;
                var maxMsg = '.msg-max-' + v.name;
                var id = '#' + (v.id || v.name);
                $(id).on('keyup change blur focus paste submit', function () {
                    var numVal = $(this).val();
                    if (numVal > 0) {
                        numVal < v.min ? ($(minMsg).nosSlideDown(), $(this).alterClass('nos-valid-min', 'nos-invalid-min')) : ($(minMsg).nosSlideUp(), $(this).alterClass('nos-invalid-min', 'nos-valid-min'));
                        numVal > v.max ? ($(maxMsg).nosSlideDown(), $(this).alterClass('nos-valid-max', 'nos-invalid-max')) : ($(maxMsg).nosSlideUp(), $(this).alterClass('nos-invalid-max', 'nos-valid-max'));
                    } else {
                        $(minMsg).nosSlideUp();
                        $(this).removeClass('nos-invalid-min nos-invalid-max');
                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-min nos-valid-max');
                });
            }
                    
            // validates regex patterns 
            function validatePattern(v) {
                var nm = v.name,
                    msg = '.msg-invalid-' + nm,
                    id = '#' + (v.id || nm),
                    regex = new RegExp(v.pattern);
                $(id).on('keyup change blur focus paste', function () {
                    if ($(this).val().length > 0) {
                        regex.test($(this).val()) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-pattern', 'nos-valid-pattern')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-pattern', 'nos-invalid-pattern'));
                    }
                    else {
                        $(msg).nosSlideUp();
                        $(this).removeClass('nos-invalid-pattern nos-valid-pattern');
                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-pattern');
                });
            }

            function passwordMatch(v) {
                var id = '#' + v.match;
                var pwd = '#' + (v.id || v.name);
                var msg = '.msg-invalid-' + v.name;
                $(pwd + ',' + id).on('keyup change blur paste focus', function () {
                    if ($(pwd).val().length > 0) {
                        $(id).val() !== $(pwd).val() ? ($(msg).nosSlideDown(), $(pwd + ',' + id).alterClass('nos-valid-match', 'nos-invalid-match')) : ($(msg).nosSlideUp(), $(pwd + ',' + id).alterClass('nos-invalid-match', 'nos-valid-match'));
                    } else {
                        $(msg).nosSlideUp();
                        $(pwd + ',' + id).removeClass('nos-invalid-match nos-valid-match');
                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-match');
                });
            }
                    
            // calls email/zip/phone validation functions and hides/displays messages to user
            function validateFields(v) {
                var nm = v.name,
                    msg = '.msg-invalid-' + nm,
                    id = '#' + (v.id || nm);
                var emval;
                $(id).on('keyup input change blur paste focus', function () {
                    switch (v.type) {
                                
                        // once the user starts to type, email/zip/tel will be sent through a validator and a 
                        // message will be displayed to warn user about invalid input
                        // message will disappear once input is valid
                        case 'email':
                            emval = $(this).val();
                            if (emval.length > 0) {
                                self.validator.email(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-email', 'nos-valid-email')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-email', 'nos-invalid-email'));
                            }
                            emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-email nos-valid-email'));
                            break;

                        case 'zip':
                            emval = $(this).val();
                            if ($.mask && v.mask) {
                                if ($(this).caret().begin > 0) {
                                    self.validator.zipcode(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-zip', 'nos-valid-zip')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-zip', 'nos-invalid-zip'));
                                }
                                $(this).caret().end === 0 && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-zip nos-valid-zip'));
                            } else {
                                if (emval.length > 0) {
                                    self.validator.zipcode(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-zip', 'nos-valid-zip')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-zip', 'nos-invalid-zip'));
                                }
                                emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-zip nos-valid-zip'));
                            }
                            break;

                        case 'tel':
                            emval = $(this).val();
                            if ($.mask && v.mask) {
                                if ($(this).caret().begin > 0) {
                                    self.validator.phone(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-tel', 'nos-valid-tel')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-tel', 'nos-invalid-tel'));
                                }
                                $(this).caret().end === 0 && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-tel nos-valid-tel'));
                            } else {
                                if (emval.length > 0) {
                                    self.validator.phone(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-tel', 'nos-valid-tel')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-tel', 'nos-invalid-tel'));
                                }
                                emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-tel nos-valid-tel'));
                            }
                            break;

                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-email nos-valid-zip nos-valid-tel');
                });
            }
                    
            // clone field add button functionality
            $('[data-nos-add-button]').click(function () {
                $('.nos-input-group.hidden').length > 0 && $('.nos-input-group.hidden').eq(0).removeClass('hidden');
                $('.nos-input-group.hidden').length === 0 && $(this).addClass('disabled');
                $('.nos-input-group:not(.hidden)').length > 1 && $('[data-nos-remove-button]').removeClass('disabled');
            });
                    
            // clone field remove button functionality
            $('[data-nos-remove-button]').click(function () {
                $('.nos-input-group:not(.hidden)').length > 1 && $('.nos-input-group:not(.hidden)').eq(-1).addClass('hidden');
                $('.nos-input-group:not(.hidden)').length === 1 && $(this).addClass('disabled');
                $('.nos-input-group.hidden').length > 0 && $('[data-nos-add-button]').removeClass('disabled');
            });
                    
            // calls the validation functions
            function callValidation(k, v) {
                
                // set mask
                if (v.mask) {

                    $.mask ? $('#' + (v.id || v.name)).mask(v.mask) : console.warn('You must include the masked input plugin to use "mask". Go here: https://github.com/digitalBush/jquery.maskedinput');
                    $('#' + (v.id || v.name)).attr('data-mask', true);

                }
                        
                // call reset function
                v.type === 'reset' && reset();
        
                // call email/zip/phone validation function
                if ((v.type === 'email' || v.type === 'zip' || v.type === 'tel') && (v.validate || v.validate === undefined)) {
                    validateFields(v);
                }
                
                // call pattern validation
                v.pattern && validatePattern(v);
                        
                // call maxLength function
                v.maxlength && maxLength(v);
                        
                // call minLength function 
                v.minlength && minLength(v);
                        
                // call min / max function
                (v.min || v.max) && minMax(v);
                
                // call password match function
                v.match && passwordMatch(v);

            }

            function findElements(column) {

                $.each(column, function (key, value) {

                    callValidation(key, value);

                    if (this.column) {
                        findElements(this.column);
                    }

                });

            }
                    
            // find out if the form is one column or multi-column
            // multi-column forms send multiple objects
            $.each(fields, function (k, v) {

                if (this.column) {

                    callValidation(k, v);

                    findElements(this.column);

                }

                else {

                    callValidation(k, v);

                }

            });

        };
                
        // error messages to warn of incorrect types in the configuration
        this.errorMessages = function () {

            var settings = this.settings;
            typeof settings.fields !== 'object' && console.warn('Your form data is not an object!');
            typeof settings.validate !== 'boolean' && console.warn('"validate" must have a boolean value!');
            typeof settings.htmlValidation !== 'boolean' && console.warn('"htmlValidation" must have a boolean value!');
            typeof settings.submit !== 'function' && console.warn('"submit" must be a function!');
            typeof settings.animationSpeed !== 'number' && console.warn('"animationSpeed" must be a number!');
            typeof settings.messages !== 'object' && console.warn('"messages" must be an object!');

        };
                
        // set some plugin behavior
        this.setBehavior = function (settings) {
                    
            // toggles browser validation on/off based on user input - default is 'off'
            !this.settings.htmlValidation && this.form.attr('novalidate', '');

            $.prototype.alterClass = function (removals, additions) {

                var self = this;

                if (removals.indexOf('*') === -1) {
                    // Use native jQuery methods if there is no wildcard matching
                    self.removeClass(removals);
                    return !additions ? self : self.addClass(additions);
                }

                var patt = new RegExp('\\s' +
                    removals.
                        replace(/\*/g, '[A-Za-z0-9-_]+').
                        split(' ').
                        join('\\s|\\s') +
                    '\\s', 'g');

                self.each(function (i, it) {
                    var cn = ' ' + it.className + ' ';
                    while (patt.test(cn)) {
                        cn = cn.replace(patt, ' ');
                    }
                    it.className = $.trim(cn);
                });

                return !additions ? self : self.addClass(additions);
            };
            
            // this will alter the animation speed of the slideDown/slideUp effects
            // used for user error messages
            $.prototype.nosSlideDown = (function (slideDown) {
                var defaultSpeed = settings.animationSpeed;
                return function (speed) {
                    slideDown.call(this, speed || defaultSpeed);
                };
            })($.prototype.slideDown);

            $.prototype.nosSlideUp = (function (slideUp) {
                var defaultSpeed = settings.animationSpeed;
                return function (speed) {
                    slideUp.call(this, speed || defaultSpeed);
                };
            })($.prototype.slideUp);

        },
        
        // set of functions to build form
        this.build = {
          
            // need to access this later
            self: this,
            // accepts objects that contain a form field
            // runs them through the proper build functions
            buildElements: function (obj) {

                var element = '';
                
                // loop through all element arrays and categorize each element type
                $.each(self.elements, function (k) {
                                  
                    // when element type is matched to an array, it is sent to be built in the associated 'getElements' function
                    if ($.inArray(obj.type, this) > -1) {
                        element += self.getElements[k](obj);
                    }

                });

                return element;

            },
            
            // this function is used for nested columns
            // it will loop through and check each object to see if there is another nested column
            // if there is, it will run it and apply the proper rows
            buildBlock: function (block) {

                var str = block.row && '<div class="row nos-row">' || '',

                    self = this;

                // function to check each new branch of elements for another nested column
                // this function will repeat until it reaches the end of the tree
                function buildColumn(col) {
                    
                    // first column class
                    str += col.classname && '<div class="' + col.classname + '">' || '';

                    $.each(col.column, function () {

                        if (this.column) {
                            
                            // if there is another nested column with a row specified, add a row and check the next level
                            str += this.row && '<div class="row nos-row">' || '';
                            
                            // check the next level
                            buildColumn(this);
                            
                            // end div for row
                            str += this.row && '</div>' || '';

                        }

                        else {
                            
                            // if no other nested column exists, build what we found
                            str += self.buildElements(this);

                        }

                    });
                    
                    // end div for first column class
                    str += col.classname && '</div>' || '';

                }
                
                // initial function call
                buildColumn(block);
                
                // end divs for the rows
                str += block.row && '</div>' || '';

                return str;

            },
            
            // the main build function
            // accepts the main form configuration object and sends the pieces where they need to go
            form: function () {

                var self = this,
                    
                    // our form string
                    formStr = this.self.settings.honeypot && this.self.getElements.honeypot() || '',
                    
                    // user submitted json fields
                    field = this.self.settings.fields;

                $.each(field, function () {

                    // if there is a column
                    if (this.column) {

                        // build the columns
                        formStr += self.buildBlock(this);

                    }

                    else {
                        
                        // just a single column form
                        formStr += self.buildElements(this);

                    }

                });
                
                // render the form string
                this.self.render(formStr);

            }

        };
                
       
                
        // renders form
        this.render = function (input) {
            $(element).append(input);
        },
        
        // adds form validation messages to the end of the form tag
        this.addMessage = function () {
            
            // determines if you are using row classes in your form and mimics this
            var message = {
                row: {
                    start: $(this.form).find('.nos-row').length && '<div class="row">' || '',
                    end: $(this.form).find('.nos-row').length && '</div>' || ''
                },
                
                // if entire form is wrapped in a col-* class, apply the same class to the form messages
                // this ensures that the form messages have the same placement and width as the form itself
                structure: this.settings.fields.length === 1 && this.settings.fields[0].classname || 'col-md-12 col-sm-12 col-xs-12'
            };
            
            // append an error message onto the form for required fields
            $(this.form).append(message.row.start + '<div class="' + message.structure + '">' + this.userErrorMessage.form.required(this.form[0]) + '</div' + message.row.end);
                                        
            // append an error message onto the form for invalid fields
            $(this.form).append(message.row.start + '<div class="' + message.structure + '">' + this.userErrorMessage.form.invalid(this.form[0]) + '</div>' + message.row.end);

        },
                
        // initialize the plugin
        this.init();

    }

    // Avoid Plugin.prototype conflicts
    $.extend(Nos.prototype, {
        init: function () {

            var userdata = this.settings,
                self = this;
                    
            // displays error messages if the config object has incorrect types
            this.errorMessages();
                    
            // set some form behaviors
            this.setBehavior(this.settings);
                    
            // build the form
            this.build.form();
                    
            // hide honeypot fields
            this.settings.honeypot && $('#nos-div-hp-js').css('display', 'none');
                    
            // run validation
            this.settings.validate && this.validate(this.settings.fields), this.addMessage();
                    
            // form submit function
            // runs validation and passes submit object to user
            this.form.submit(function (e) {
                        
                // prevent default form submit
                e.preventDefault();
                        
                // run submit form validation, unless user specifies not to
                userdata.validate && self.submitValidation($(this));

            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.nosForm = function Run(options) {
        return this.each(function () {
            if (!$.data(this, "plugin_nosForm")) {
                $.data(this, "plugin_nosForm", new Nos(this, options));
            }
        });
    };

})(jQuery, window, document);
