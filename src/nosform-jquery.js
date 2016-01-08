/* global jQuery */
;(function ( $, window, document, undefined ) {

    "use strict";

        // Create the defaults
        var pluginName = "nosForm",
            defaults = {
                fields: {},
                validate: true,
                htmlValidation: false
            };

        // The plugin constructor
        function Nos ( element, options ) {
                
                // need access to this later
                var self = this;
                
                // form element
                this.form = $(element);
                
                // final plugin settings
                this.settings = $.extend({}, defaults, options);
                
                // need access to this later
                var userdata = this.settings;
                
                // Store arrays of element types
                // These are used to determine which function will be called from the 'getElements' object below
                this.elements = {
                    text: ['text', 'email', 'tel', 'password', 'number', 'hidden', 'zip', 'date', 'week', 'time', 'month', 'datetime-local', 'search', 'url', 'range', 'color'],
                    textarea: ['textarea'],
                    buttons: ['submit', 'reset', 'button', 'image'],
                    select: ['select'],
                    file: ['file'],
                    check: ['checkbox', 'radio'],
                    state: ['state']
                };
                
                // toggles browser validation on/off based on user input - default is 'off'
                this.htmlValidation = function () {
                    
                    !this.settings.htmlValidation && this.form.attr('novalidate', '');
                    
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
                        
                        classname: input.classname && ' class="' + input.classname + '"' || '',
                        
                        multiple: input.multiple && ' multiple' || '',
                        
                        autofocus: input.autofocus && ' autofocus' || '',
                        
                        disabled: input.disabled && ' disabled' || '',
                        
                        readonly: input.readonly && ' readonly' || '',
                        
                        title: input.title && ' title="' + input.title + '"' || '',
                        
                        size: input.size && ' size="' + input.size + '"' || '',
                        
                        // stores user error messages
                        message: self.getUserErrorMessages(input)
                        
                    });
                    
                },
                
                // assigns an object to the 'message' property above
                // this will contain the user error messages that will display on the form
                this.getUserErrorMessages = function (element) {
                    return $.extend({}, {
                        required: element.required && self.userErrorMessage.required(element) || '',
                        valid: (element.type === 'email' || element.type === 'zip' || element.type === 'tel') && self.userErrorMessage.valid(element) || '',
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
                    
                    div: function (classname) {
                        return {
                            start: '<div class="' + classname + '">',
                            end: '</div>'
                        };
                    },
                    
                    fieldset: function (id) {
                        return {
                            start: '<fieldset id="' + id + '">',
                            end: '</fieldset>'
                        };
                    },
                    
                    label: function (input) {
                        var required;
                        input.required ? required = ' class="required-field"' : ''; 
                        return '<label for="' + (input.id || input.name) + '"' + required + '>' + input.label + '</label>';
                    },
                    
                    // returns text-based elements
                    text: function (input) {
                        var formgroup, label;
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            pattern: input.pattern && ' pattern="' + input.pattern + '"' || '',
                            autocomplete: input.autocomplete && ' autocomplete="' + input.autocomplete + '"' || '',
                            step: input.step && ' step="' + input.step + '"' || '',
                            min: input.min && ' min="' + input.min + '"' || '',
                            max: input.max && ' max="' + input.max + '"' || ''
                        });
                        var element = (formgroup.start || '') + label + 
                            '<input' + el.type + el.name + el.id + el.minlength + el.maxlength + el.placeholder + el.classname + 
                            el.value + el.title + el.min + el.max + el.step + el.size + el.pattern + el.autocomplete + el.multiple + el.readonly + el.disabled + el.autofocus + el.required + '>' + 
                            (el.message.required || '') + (el.message.minlength || '') + (el.message.valid || '') + (el.message.min || '') + (el.message.max || '') + 
                            (formgroup.end || '');
                        return element;
                    },
                    
                    // returns buttons
                    buttons: function (input) {
                        var nosgroup = input.formGroup && 'nos-form-group nos-group ' || '',
                            inline = input.inline && 'nos-inline' || '',
                            formgroup;
                        (input.formGroup || input.inline) ? formgroup = this.div(nosgroup + inline) : formgroup = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            src: input.src && ' src="' + input.src + '"' || '',
                            alt: input.alt && ' alt="' + input.alt + '"' || '',
                            formaction: input.formaction && ' formaction="' + input.formaction + '"' || '',
                            formenctype: input.formenctype && ' formenctype="' + input.formenctype + '"' || '',
                            formmethod: input.formmethod && ' formmethod="' + input.formmethod + '"' || '',
                            formnovalidate: input.formnovalidate && ' formnovalidate' || '',
                            formtarget: input.formtarget && ' formtarget="' + input.formtarget + '"' || '',
                            height: input.height && ' height="' + input.height + '"' || '',
                            width: input.width && ' width="' + input.width + '"' || ''
                        });
                        var element = (formgroup.start || '') + 
                            '<input' + el.type + el.name + el.id + el.classname + el.title + el.src + el.alt + el.height + el.width + 
                            el.formtarget + el.formmethod + el.formaction + el.formenctype + el.disabled + el.value + el.formnovalidate + '>&nbsp;' + 
                            (formgroup.end || formgroup);
                        return element;
                    },
                    
                    // returns textarea elements
                    textarea: function (input) {
                        var formgroup, label;
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            rows: input.rows && ' rows="' + input.rows + '"' || '',
                            cols: input.cols && ' cols="' + input.cols + '"' || '',
                            wrap: input.wrap && ' wrap="' + input.wrap + '"' || ''
                        });
                        var element = (formgroup.start || '') + label + 
                            '<textarea' + 
                            el.name + el.id + el.title + el.minlength + el.maxlength + el.placeholder + el.classname + el.value + el.rows + el.cols + el.wrap + el.readonly + el.disabled + el.autofocus + el.required + 
                            '></textarea>' + 
                            (el.message.required || '') + (el.message.minlength || '') + 
                            (formgroup.end || '');
                        return element;
                    },
                    
                    // returns select elements
                    select: function (input) {
                        var formgroup, label, options = '';
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        var el = this.self.getAttrs(input);
                        $.each(input.options, function (k,v) {
                            var selectedOption;
                            el.selected === k ? selectedOption = ' selected' : selectedOption = '';
                            options += '<option value="' + k + '" ' + selectedOption + '>' + v + '</option>';
                        });
                        var element = (formgroup.start || '') + label + 
                            '<select' + 
                            el.name + el.id + el.classname + el.multiple + el.title + el.size + el.readonly + el.disabled + el.autofocus + el.required + '>' + 
                            options + 
                            '</select>' + 
                            (el.message.required || '') +  
                            (formgroup.end || '');
                        return element;
                    },
                    
                    // returns checkbox and radio elements
                    check: function (input) {
                        var formgroup, label, div, 
                            checked = '', 
                            fieldset = this.fieldset(input.name),
                            type = input.type;
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        !input.inline ? div = this.div(type) : div = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            inline: input.inline && ' class="' + type + '-inline"' || '',
                            name: (input.name && input.type === 'checkbox') ? ' name="' + input.name + '[]' + '"' : ' name="' + input.name + '"',
                            id: ' id="' + input.name + '-'
                        });
                        
                        var element = (formgroup.start || '') + label + (fieldset.start || '');
                        
                        $.each(input.options, function (k, v) {
                            if (typeof input.checked === 'object') {
                                $.inArray(k, input.checked) > -1 ? checked = ' checked': checked = '';
                            } else if (typeof input.checked === 'string') {
                                k === input.checked ? checked = ' checked': checked = '';
                            } else {
                                console.warn('Your checkbox/radio "checked" property must be an object or string');
                            }
                            element += (div.start || '') + 
                                    '<label' + el.inline + '><input' +
                                    el.type + el.name + el.title + el.id+k+'" ' + el.classname + ' value="' + k + '"' + checked + el.disabled + el.autofocus + el.required + 
                                    '>' + 
                                    v + 
                                    '</label>' + 
                                    (div.end || '');
                        });
                        
                        element += (fieldset.end || '') + 
                        (el.message.required || '') +  
                        (formgroup.end || '');
                        return element;
                    },
                    
                    // returns file elements
                    file: function (input) {
                        var formgroup, label,
                            div = this.div(input.classname);
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        var el = $.extend(this.self.getAttrs(input), {
                            accept: input.accept && ' accept="' + input.accept + '"' || '',
                        });
                        var element = (formgroup.start || '') + label + 
                            (div.start || '') + 
                            '<input' + el.type + el.name + el.id + el.title + el.accept + el.multiple + el.disabled + el.autofocus + el.required + 
                            '>' +  
                            (el.message.required || '') + 
                            (div.end || '') + 
                            (formgroup.end || '');
                        return element;
                    },
                    
                    // returns select box with 50 states/territories/Canadian Provinces
                    // the user specifies what to include, and this function will combine the appropriate objects to create the select element
                    state: function (input) {
                        var formgroup, label;
                        input.formGroup ? formgroup = this.formGroup() : formgroup = '';
                        input.label ? label = this.label(input) : label = '';
                        var territories = {"American Samoa": "AS","Federated States Of Micronesia": "FM","Guam": "GU","Marshall Islands": "MH","Northern Mariana Islands": "MP","Palau": "PW","Puerto Rico": "PR","Virgin Islands": "VI"};
                        var states = {"Alabama": "AL","Alaska": "AK","Arizona": "AZ","Arkansas": "AR","California": "CA","Colorado": "CO","Connecticut": "CT","Delaware": "DE","District Of Columbia": "DC","Florida": "FL","Georgia": "GA","Hawaii": "HI","Idaho": "ID","Illinois": "IL","Indiana": "IN","Iowa": "IA","Kansas": "KS","Kentucky": "KY","Louisiana": "LA","Maine": "ME","Maryland": "MD","Massachusetts": "MA","Michigan": "MI","Minnesota": "MN","Mississippi": "MS","Missouri": "MO","Montana": "MT","Nebraska": "NE","Nevada": "NV","New Hampshire": "NH","New Jersey": "NJ","New Mexico": "NM","New York": "NY","North Carolina": "NC","North Dakota": "ND","Ohio": "OH","Oklahoma": "OK","Oregon": "OR","Pennsylvania": "PA","Rhode Island": "RI","South Carolina": "SC","South Dakota": "SD","Tennessee": "TN","Texas": "TX","Utah": "UT","Vermont": "VT","Virginia": "VA","Washington": "WA","West Virginia": "WV","Wisconsin": "WI","Wyoming": "WY"};
                        var provinces = {"Alberta": "AB","British Columbia": "BC","Manitoba": "MB","New Brunswick": "NB","Newfoundland and Labrador": "NL","Nova Scotia": "NS","Northwest Territories": "NT","Nunavut": "NU","Ontario": "ON","Prince Edward Island": "PE","Quebec": "QC","Saskatchewan": "SK","Yukon": "YT"};
                        
                        // this function orders our state object alphabetically by key
                        function sortObject(obj, order) {
                            var key,
                                i,
                                tempArray = [],
                                tempObj = {};
                                
                            for (key in obj) {
                                tempArray.push(key);
                            }
                            tempArray.sort(
                                function(a, b) {
                                    return a.toLowerCase().localeCompare(b.toLowerCase());
                                }
                            );
                            if (order === 'desc') {
                                for ( i = tempArray.length - 1; i >= 0; i-- ) {
                                    tempObj[tempArray[i]] = obj[tempArray[i]];
                                }
                            } else {
                                for ( i = 0; i < tempArray.length; i++ ) {
                                    tempObj[tempArray[i]] = obj[tempArray[i]];
                                }
                            }
                            return tempObj;
                        }
                        
                        // function to combine the objects and call the sort function once that is done
                        // after object is complete, we create the html
                        var stateObj = sortObject($.extend(states, (input.usTerritory && territories), (input.canada && provinces))),
                            options = '<option value="">' + (input.defaultSelected || "Select One...") + '</option>';
                        var el = this.self.getAttrs(input);
                        $.each(stateObj, function (k,v) {
                            var selectedOption;
                            el.selected === v ? selectedOption = ' selected' : selectedOption = '';
                            options += '<option value="' + v + '" ' + selectedOption + '>' + k + '</option>';
                        });
                        var element = (formgroup.start || '') + label + 
                            '<select ' + el.name + el.id + el.classname + el.size + el.multiple + el.readonly + el.disabled + el.autofocus + el.required + 
                            '>' + 
                            options + 
                            '</select>' + 
                            (el.message.required || '') + 
                            (formgroup.end || '');
                            return element;
                    }
                };
                
                // field validation functions
                this.validator = {
                    
                    email: function (email) {
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(email);
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
                
                // field validation messages
                this.userErrorMessage = {
                    
                    required: function (el) {
                        return '<span style="display: none;" class="help-block nos-help msg-required-' + el.name + '">' + (el.label || el.placeholder) + ' is a required field</span>';
                    },
                    
                    valid: function (el) {
                        return '<span style="display: none;" class="help-block nos-help msg-invalid-' + el.name + '">' + (el.label || el.placeholder) + ' must be valid</span>';
                    },
                    
                    minlength: function (el) {
                        return '<span style="display: none;" class="help-block nos-help msg-minlength-' + el.name + '">' + (el.label || el.placeholder) + ' must be a minimum of ' + el.minlength + ' characters</span>';
                    },
                    
                    min: function (el) {
                        return '<span style="display: none;" class="help-block nos-help msg-min-' + el.name + '">' + (el.label || el.placeholder) + ' must be a minimum of ' + el.min + '</span>';
                    },
                    
                    max: function (el) {
                        return '<span style="display: none;" class="help-block nos-help msg-max-' + el.name + '">' + (el.label || el.placeholder) + ' must be no more than ' + el.max + '</span>';
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
                    var reqInput = $('input:not(:radio, :checkbox, :button, :submit, :reset, :file, :image), textarea').filter('[required]:visible'),
                        reqSR = $('select').filter('[required]:visible'),
                        fileField = $(':file').filter('[required]:visible'),
                        cbgroup = $(':checkbox').parents('fieldset'),
                        cb = $(':checkbox, :radio').filter('[required]:visible').parents('fieldset');
                    
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
                            cba[i].length < 1 && $(cmsg[i]).slideDown();
                            $(checkboxes).change(function () {
                                $.inArray(this, cba[i]) > -1 ? cba[i].splice(this, 1) : cba[i].push(this);
                                cba[i].length > 0 && $(cmsg[i]).slideUp();
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
                        var field = reqInput[i];
                        var msg = '.msg-required-' + field.name;
                        field.value = self.validator.sanitize(field.value);
                        if ($(field).val().length < 1) {
                            $(msg).slideDown();
                            $(field).addClass('required-field-border');
                            $(this).bind('keyup keydown change blur', function () {
                                this.value.length >= 0 && ($(msg).slideUp(), $(field).removeClass('required-field-border'));
                            });
                        }
                    });
                
                    // select Required field validation
                    $(reqSR).each(function (i) {
                        var sfield = reqSR[i];
                        var msg = '.msg-required-' + sfield.name;
                        if ($(sfield).val() === '') {
                            $(msg).slideDown();
                            $(sfield).addClass('required-field-border');
                            $(this).change(function () {
                                $(this).val() !== '' && ($(msg).slideUp(), $(sfield).removeClass('required-field-border'));
                            });
                        }    
                    });
                    
                    // file Required field validation
                    $(fileField).each(function (i) {
                        var field = fileField[i];
                        var msg = '.msg-required-' + field.name;
                        var filelist = (document.getElementById(field.id).files || document.getElementById(field.id).value); // ie8 doesn't support 'files'
                        if (filelist.length === 0) {
                            $(msg).slideDown();
                            $(field).addClass('required-field-border');
                            $(this).change(function () {
                                $(this).val() !== '' && ($(msg).slideUp(), $(field).removeClass('required-field-border'));
                            });
                        } 
                        formdata[field.name] = filelist;   
                    });
                    
                    // send form submit object back to user if all fields are valid
                    if (!$('input, select, textarea').hasClass('required-field-border') && !$('.nos-help').is(':visible')) {
                         userdata.submit(formdata);
                    }
                };
                
                // this function handles interactive error messages while user is typing
                this.validate = function (fields) {
                    
                    // resets form
                    function reset () {
                        $(':reset').click(function () {
                            $(this).closest('form').find(':input:not(:submit, :reset, :button, :image), textarea, select').val('');
                            $('.nos-help').slideUp('fast');
                            $('input, select, textarea').removeClass('required-field-border');
                        });
                    }
                    
                    // checks maxlength on fields if browser doesn't catch/support it
                    function maxLength (v) {
                        var maxLengthId = (v.id || v.name);
                        $('#' + maxLengthId).keydown(function (e) {
                            if (this.value.length > v.maxlength) {
                                e.preventDefault();
                            }
                        });
                    }
                    
                    // validates that the minlength has been met and displays/hides message to user
                    function minLength (v) {
                        var msg = '.msg-minlength-' + v.name;
                        var id = '#' + (v.id || v.name);
                        $(id).keyup(function () {
                            var minval = this.value.length;
                            minval < v.minlength ? $(msg).slideDown() : $(msg).slideUp();
                        });
                    }
                    
                    // calls email/zip/phone validation functions and hides/displays messages to user
                    function validateFields (v) {
                        var nm = v.name;
                        var msg = '.msg-invalid-' + nm;
                        var id = '#' + (v.id || nm);
                        var emval;
                        $(id).bind('keyup change keydown blur', function () {
                            switch (v.type) {
                                case 'email':
                                    emval = $(this).val();
                                    if (emval.length > 0) {
                                        self.validator.email(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                    }
                                        emval === '' && $(msg).slideUp();
                                    break;
                                case 'zip':
                                    emval = $(this).val();
                                    if (emval.length > 0) {
                                        self.validator.zipcode(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                    }
                                        emval === '' && $(msg).slideUp();
                                    break;
                                case 'tel':
                                    emval = $(this).val();
                                    if (emval.length > 0) {
                                        self.validator.phone(emval) ? $(msg).slideUp() : $(msg).slideDown();
                                    }
                                        emval === '' && $(msg).slideUp();
                                    break;
                            }
                        });
                    }
                    
                    // calls the validation functions
                    function callValidation(k, v) {
                        
                        // set mask
                        // I really thought this would take more code...nope
                        if (v.mask) {
                            $.mask ? $('#'+(v.id || v.name)).mask(v.mask): console.warn('You must include the masked input plugin to use "mask". Go here: https://github.com/digitalBush/jquery.maskedinput');  
                        }
                        
                        // call reset function
                        v.type === 'reset' && reset();
        
                        // call email/zip/phone validation function
                        if (v.type === 'email' || v.type === 'zip' || v.type === 'tel') {
                            validateFields(v);
                        }
                        
                        // call maxLength function
                        v.maxlength && maxLength(v);
                        
                        // call minLength function 
                        v.minlength && minLength(v);
                        
                    }
                    
                    // find out if the form is one column or multi-column
                    // multi-column forms send multiple objects
                    $.each(fields, function (k, v) {
                        
                        if (this.column) {
                            
                            $.each(this.column, function (key, value) {
                                
                                callValidation(key, value);
                                
                            });
                            
                        }
                        
                        else {
                            
                            callValidation(k, v);
                                
                        }
                        
                    });
                    
                };
                
                // builds form
                this.build = function () {
                    
                    // create empty form string to build upon
                    var form = '', 
                    
                        // user supplied json fields
                        field = (this.settings.fields);
                    
                    // loop through all field objects
                    $.each(field, function () {
                       
                       // check for a column property
                       // this signals a multi-column form
                       if (this.column) {
                           
                           // add a div with a supplied class to separate columns
                           form += '<div class="' + this.classname + '">';
                           
                           $.each(this.column, function () {
                               
                               var each = this;
                               
                                // loop through all element arrays and categorize each element type
                                $.each(self.elements, function (k) {
                                    
                                    // when element type is matched to an array, it is sent to be built in the associated 'getElements' function
                                    if ($.inArray(each.type, this) > -1) { 
                                        form += self.getElements[k](each); 
                                    }
                                    
                                    
                           
                                });
                                
                           });
                           
                           form += '</div>';
                       }
                       
                       // standard one column layout
                       else {
                           
                            var each = this;
                       
                            // loop through all element arrays and categorize each element type
                            $.each(self.elements, function (k) {
                                
                                // when element type is matched to an array, it is sent to be built in the associated 'getElements' function
                                if ($.inArray(each.type, this) > -1) { 
                                    form += self.getElements[k](each); 
                                }
                           
                            });
                       }
                       
                    });
                    
                    // call to render the form (below)
                    this.render(form);
                };
                
                // renders form
                this.render = function (input) {
                    $(element).append(input);  
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
                    
                    // toggle the html browser validation
                    this.htmlValidation();
                    
                    // build the form
                    this.build();
                    
                    // run validation
                    this.settings.validate && this.validate(this.settings.fields);
                    
                    // form submit function
                    // runs validation and passes submit object to user
                    this.form.submit(function(e) {
                        
                        // prevent default form submit
                        e.preventDefault();
                        
                        // run submit form validation, unless user specifies not to
                        userdata.validate && self.submitValidation($(this));
                    
                    });
                },
                
                // error messages to warn of incorrect types in the configuration
                errorMessages: function () {
                    var settings = this.settings;
                    typeof settings.fields !== 'object' && console.warn('Your form data is not an object!');
                    typeof settings.validate !== 'boolean' && console.warn('"validate" must have a boolean value!');
                    typeof settings.htmlValidation !== 'boolean' && console.warn('"htmlValidation" must have a boolean value!');
                    typeof settings.submit !== 'function' && console.warn('"submit" must be a function!');
                }
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
                return this.each(function() {
                        if ( !$.data( this, "plugin_" + pluginName ) ) {
                                $.data( this, "plugin_" + pluginName, new Nos( this, options ) );
                        }
                });
        };

})( jQuery, window, document );
