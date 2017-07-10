/*
 *  nos-forms-jquery - v2.0.1
 *  Build and validate DRY html forms in minutes with JSON, jQuery and Bootstrap
 *  http://ibidata.github.io/nos-forms-jquery/
 *
 *  Made by IBI Data
 *  Under MIT License
 */
/* global jQuery */
; (function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), window, document);
    } else {
        factory(jQuery, window, document);
    }
} (function ($, window, document, undefined) {

    "use strict";

    // Create the defaults
    var defaults = {
        fields: null,
        animationSpeed: 100,
        validate: true,
        htmlValidation: false,
        ajax: true,
        honeypot: false,
        messages: {
            required: 'Please fill out all required fields',
            invalid: 'Please correct errors'
        },
        messageLocation: {
            top: false,
            bottom: true
        },
        onlySubmitWithValue: false,
        init: null,
        submit: null
    };

    // The plugin constructor
    function Nos(element, options) {

        // need access to this later
        var self = this;

        // form id
        var $form = '#' + element.id;

        // form element
        this.form = $(element);

        // final plugin settings
        this.settings = $.extend(true, {}, defaults, options);


        // Store arrays of element types
        // These are used to determine which function will be called from the '_getElements' object below
        var _elements = {
            text: ['text', 'email', 'tel', 'password', 'number', 'hidden', 'zip', 'date', 'week', 'time', 'month', 'datetime-local', 'search', 'url'],
            textarea: ['textarea'],
            buttons: ['submit', 'reset', 'button'],
            select: ['select'],
            file: ['file'],
            check: ['checkbox', 'radio'],
            state: ['state'],
            clone: ['clone'],
            html: ['html'],
            other: ['range', 'color', 'image'],
            lbl: ['label'],
            buttonGroup: ['buttonGroup']
        };

        // takes user form object and converts to string fragments for creating html
        var _getAttrs = function (input) {

            return $.extend({}, input, {
                type: input.type ? ' type="' + input.type + '"' : '',
                name: input.name ? ' name="' + input.name + '"' : '',
                id: (input.id || input.name) ? ' id="' + (input.id || input.name) + '"' : '',
                minlength: (input.minlength || typeof input.minlength === 'number') ? ' minlength="' + input.minlength + '"' : '',
                maxlength: (input.maxlength || typeof input.maxlength === 'number') ? ' maxlength="' + input.maxlength + '"' : '',
                required: input.required ? ' required' : '',
                value: (input.value || typeof input.value === 'number') ? ' value="' + input.value + '"' : '',
                placeholder: input.placeholder ? ' placeholder="' + input.placeholder + '"' : '',
                formGroup: (input.formGroup || input.formGroup === undefined) ? _getElements.formGroup() : { start: '', end: '' },
                label: input.label ? _getElements.label(input) : '',
                helpBlock: input.helpBlock ? '<span id="' + (input.id || input.name) + '-help-block" class="help-block nos-help-block">' + input.helpBlock + '</span>' : '',
                classname: input.classname ? ' class="' + input.classname + '"' : '',
                multiple: input.multiple ? ' multiple' : '',
                autofocus: input.autofocus ? ' autofocus' : '',
                disabled: input.disabled ? ' disabled' : '',
                readonly: input.readonly ? ' readonly' : '',
                title: input.title ? ' title="' + input.title + '"' : '',
                size: input.size ? ' size="' + input.size + '"' : '',
                data: input.data ? _getElements.data(input.data) : '',
                message: self.settings.validate ? _getUserErrorMessages(input) : { required: '', minlength: '', maxlength: '', min: '', max: '', valid: '' }, // returns object that stores user error messages
                tabindex: input.tabindex ? ' tabindex="' + input.tabindex + '"' : ''
            });

        };

        // assigns an object to the 'message' property above
        // this will contain the user error messages that will display on the form
        var _getUserErrorMessages = function (element) {
            return $.extend({}, {
                required: element.required ? _userErrorMessage.required(element) : '',
                valid: (element.type === 'email' || element.type === 'zip' || element.type === 'tel' || element.pattern || element.match) ? _userErrorMessage.valid(element) : '',
                minlength: (element.minlength && element.minlength > 1) ? _userErrorMessage.minlength(element) : '',
                maxlength: (element.maxlength && element.maxlength > 1) ? _userErrorMessage.maxlength(element) : '',
                min: (element.min && element.min > 1) ? _userErrorMessage.min(element) : '',
                max: element.max ? _userErrorMessage.max(element) : ''
            });
        };

        // Group of functions used to return a form element
        var _getElements = {

            self: this,

            // returns bootstrap form-group div
            formGroup: function () {
                return {
                    start: '<div class="form-group nos-group">',
                    end: '</div>'
                };
            },

            // returns honeypot fields
            honeypot: function () {
                return '<div class="nos-div-hp-css"><label for="nos-text-css[]">Please leave this field blank</label><input type="text" class="nos-text-css" name="nos-text-css[]" value=""></div><div class="nos-div-hp-js"><label for="nos-email-js[]">Please leave this field unchanged</label><input type="email" class="nos-email-js" name="nos-email-js[]" value="validemail@email.com"></div>';
            },

            // returns a div with a class
            div: function (classname) {
                return {
                    start: '<div class="' + classname + '">',
                    end: '</div>'
                };
            },

            data: function (input) {
                var dataAttr = '';

                $.each(input, function (k, v) {
                    dataAttr += ' data-' + k + '="' + v + '"';
                });
                return dataAttr;
            },

            // returns bootstrap input group
            inputGroup: function (input) {
                var leftkeys = input.left ? Object.keys(input.left) : '',
                    rightkeys = input.right ? Object.keys(input.right) : '',
                    leftchoice = input.left ? leftkeys[$.inArray('text', leftkeys)] || leftkeys[$.inArray('button', leftkeys)] : '',
                    rightchoice = input.right ? rightkeys[$.inArray('text', rightkeys)] || rightkeys[$.inArray('button', rightkeys)] : '',
                    options = {
                        left: input.left ? {
                            text: '<span class="input-group-addon ' + (input.left.classname || '') + '">' + (input.left.text || '') + '</span>',
                            button: '<span class="input-group-btn"><button class="' + (input.left.classname || '') + '" type="button">' + (input.left.button || '') + '</button></span>'
                        } : '',
                        right: input.right ? {
                            text: '<span class="input-group-addon ' + (input.right.classname || '') + '">' + (input.right.text || '') + '</span>',
                            button: '<span class="input-group-btn"><button class="' + (input.right.classname || '') + '" type="button">' + (input.right.button || '') + '</button></span>'
                        } : ''
                    },
                    sizes = {
                        large: 'input-group-lg',
                        lg: 'input-group-lg',
                        small: 'input-group-sm',
                        sm: 'input-group-sm'
                };
                return {
                    start: input && '<div class="input-group ' + (input.size && sizes[input.size] || '') + '">',
                    left: input.left ? options.left[leftchoice] : '',
                    right: input.right ? options.right[rightchoice] : '',
                    end: input && '</div>'
                };
            },

            // fieldsets are used with checkboxes/radios
            fieldset: function (id, submitType) {
                return {
                    start: '<fieldset id="' + id + '" class="nos-fieldset nos-submit-' + (submitType || "object") + '">',
                    end: '</fieldset>'
                };
            },

            // returns a label
            label: function (input) {
                return '<label for="' + (input.id || input.name) + '" class="nos-label' + (input.required && ' required-field' || '') + '">' + input.label + '</label>';
            },

            // returns a label element
            lbl: function (input) {
                return '<label class="nos-label label-' + (input.name || input.id) + ' ' + (input.classname || '') + '">' + input.value + '</label>';
            },

            // returns text-based elements
            text: function (input) {
                var el = $.extend(_getAttrs(input), {
                    pattern: input.pattern ? ' pattern="' + input.pattern + '"' : '',
                    autocomplete: input.autocomplete ? ' autocomplete="' + input.autocomplete + '"' : '',
                    step: input.step ? ' step="' + input.step + '"' : '',
                    min: input.min ? ' min="' + input.min + '"' : '',
                    max: input.max ? ' max="' + input.max + '"' : '',
                    classname: input.classname ? ' class="form-control ' + input.classname + '"' : ' class="form-control"',
                    inputGroup: input.inputGroup ? this.inputGroup(input.inputGroup) : { start: '', left: '', right: '', end: '' }
                });
                var element = el.formGroup.start + el.label + el.inputGroup.start + el.inputGroup.left +
                    '<input data-nos' + el.type + el.name + el.id + el.data + el.minlength + el.maxlength + el.placeholder + el.classname + el.tabindex +
                    el.value + el.title + el.min + el.max + el.step + el.size + el.pattern + el.autocomplete + el.multiple + el.readonly +
                    el.disabled + el.autofocus + el.required + '>' + el.inputGroup.right + el.inputGroup.end + el.helpBlock +
                    el.message.required + el.message.minlength + el.message.maxlength + el.message.valid + el.message.min + el.message.max +
                    el.formGroup.end;
                return element;
            },

            // returns buttons
            buttons: function (input) {
                var nosgroup = input.formGroup ? 'nos-form-group nos-group ' : '',
                    inline = input.inline ? 'nos-inline ' : '',
                    align = input.align ? 'pull-' + input.align : '',
                    prespace = input.align === 'right' ? '&nbsp;' : '',
                    postspace = input.align === 'left' || input.align === undefined ? '&nbsp;' : '';
                var el = $.extend(_getAttrs(input), {
                    formaction: input.formaction ? ' formaction="' + input.formaction + '"' : '',
                    formenctype: input.formenctype ? ' formenctype="' + input.formenctype + '"' : '',
                    formmethod: input.formmethod ? ' formmethod="' + input.formmethod + '"' : '',
                    formnovalidate: input.formnovalidate ? ' formnovalidate' : '',
                    formtarget: input.formtarget ? ' formtarget="' + input.formtarget + '"' : '',
                    value: input.value ? input.value : '',
                    formGroup: (input.formGroup || input.inline) ? this.div(nosgroup + inline + align) : { start: '', end: '' }
                });
                var element = el.formGroup.start +
                    prespace + '<button data-nos' + el.type + el.id + el.data + el.classname + el.title + el.formtarget + el.formmethod + el.formaction + el.tabindex +
                    el.formenctype + el.formnovalidate + el.disabled + '>' + el.value + '</button>' + postspace + el.formGroup.end;
                return element;
            },

            // returns a button group
            buttonGroup: function (input) {
                var nosgroup = input.formGroup ? 'nos-form-group nos-group ' : '',
                    align = input.align ? 'pull-' + input.align : '',
                    vert = input.vertical ? '-vertical ' : ' ';
                var i, buttons = '', button = input.buttons;
                var el = $.extend(_getAttrs(input), {
                    classname: input.classname ? ' class="btn-group' + vert + input.classname + '"' : ' class="btn-group' + vert + '"',
                    formGroup: (input.formGroup || input.align) ? this.div(nosgroup + align) : { start: '', end: '' }
                });
                for (i = 0; i < button.length; i++) {
                    buttons += '<button data-nos type="' + button[i].type + '" class="' + button[i].classname + '" tabindex="' + button[i].tabindex + '">' + button[i].value + '</button>';
                }
                var element = el.formGroup.start + el.label + '<br>' +
                    '<div ' + el.classname + ' role="group">' +
                    buttons +
                    el.formGroup.end;
                return element;
            },

            // returns textarea elements
            textarea: function (input) {
                var el = $.extend(_getAttrs(input), {
                    rows: input.rows ? ' rows="' + input.rows + '"' : '',
                    cols: input.cols ? ' cols="' + input.cols + '"' : '',
                    wrap: input.wrap ? ' wrap="' + input.wrap + '"' : '',
                    classname: input.classname ? ' class="form-control ' + input.classname + '"' : ' class="form-control"',
                    value: (input.value || typeof input.value === 'number') ? input.value : ''
                });
                var element = el.formGroup.start + el.label +
                    '<textarea data-nos' +
                    el.name + el.id + el.title + el.data + el.minlength + el.maxlength + el.placeholder + el.classname + el.tabindex + el.rows + el.cols + el.wrap + el.readonly + el.disabled + el.autofocus + el.required +
                    '>' + el.value + '</textarea>' + el.helpBlock +
                    el.message.required + el.message.minlength + el.message.maxlength +
                    el.formGroup.end;
                return element;
            },

            // returns select elements
            select: function (input) {
                var selOptions = {},
                    temp = {};
                if (input.options.length) {
                    $.each(input.options, function () {
                        if (typeof this === 'object') {
                            $.extend(selOptions, this);
                        } else {
                            temp[this] = this;
                            $.extend(selOptions, temp);
                        }
                    });
                } else {
                    selOptions = input.options;
                }
                var options = '';
                var el = $.extend(_getAttrs(input), {
                    classname: input.classname ? ' class="form-control ' + input.classname + '"' : ' class="form-control"',
                    selected: input.selected ? input.selected.toString().toLowerCase() : '',
                    inputGroup: input.inputGroup ? this.inputGroup(input.inputGroup) : { start: '', left: '', right: '', end: '' }
                });
                $.each(selOptions, function (k, v) {
                    options += '<option value="' + k + '" ' + ((el.selected === k.toString().toLowerCase() || el.selected === v.toString().toLowerCase()) ? ' selected' : '') + '>' + v + '</option>';
                });
                var element = el.formGroup.start + el.label + el.inputGroup.start + el.inputGroup.left +
                    '<select data-nos' +
                    el.name + el.id + el.data + el.classname + el.multiple + el.title + el.size + el.readonly + el.tabindex + el.disabled + el.autofocus + el.required + '>' +
                    options +
                    '</select>' + el.inputGroup.right + el.inputGroup.end + el.helpBlock +
                    el.message.required +
                    el.formGroup.end;
                return element;
            },

            // returns checkbox and radio elements
            check: function (input) {
                var inputOptions = {},
                    temp = {};
                if (input.options.length) {
                    $.each(input.options, function () {
                        if (typeof this === 'object') {
                            $.extend(inputOptions, this);
                        } else {
                            temp[this] = this;
                            $.extend(inputOptions, temp);
                        }
                    });
                } else {
                    inputOptions = input.options;
                }
                var checked = '';
                var el = $.extend(_getAttrs(input), {
                    inline: input.inline ? ' class="' + input.type + '-inline"' : '',
                    name: (input.name && input.type === 'checkbox') ? ' name="' + input.name + '[]' + '"' : ' name="' + input.name + '"',
                    id: ' id="' + input.name + '-',
                    div: !input.inline ? this.div(input.type) : { start: '', end: '' },
                    fieldset: this.fieldset(input.name, input.submitType) || { start: '', end: '' }
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
                        el.type + el.name + el.data + el.title + el.id + k + '" ' + el.classname + ' value="' + k + '"' + checked + el.disabled + el.autofocus + el.required +
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
                var el = $.extend(_getAttrs(input), {
                    accept: input.accept && ' accept="' + input.accept + '"' || '',
                    div: input.classname && this.div(input.classname) || { start: '', end: '' }
                });
                var element = el.formGroup.start + el.label +
                    el.div.start +
                    '<input data-nos' + el.type + el.name + el.id + el.data + el.title + el.accept + el.multiple + el.tabindex + el.disabled + el.autofocus + el.required +
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

            // returns input type range & color
            other: function (input) {
                var el = $.extend(_getAttrs(input), {
                    step: input.step ? ' step="' + input.step + '"' : '',
                    min: (input.min || typeof input.min === 'number') ? ' min="' + input.min + '"' : '',
                    max: (input.max || typeof input.max === 'number') ? ' max="' + input.max + '"' : '',
                    height: (input.height || typeof input.height === 'number') ? ' height="' + input.height + '"' : '',
                    width: (input.width || typeof input.width === 'number') ? ' width="' + input.width + '"' : '',
                    src: input.src ? ' src="' + input.src + '"' : '',
                    alt: input.alt ? ' alt="' + input.alt + '"' : ''
                });
                var element = el.formGroup.start + el.label +
                    '<input data-nos' + el.type + el.name + el.id + el.data + el.classname +
                    el.value + el.title + el.height + el.width + el.src + el.alt +
                    el.tabindex + el.min + el.max + el.step + el.readonly +
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
                var el = $.extend(_getAttrs(input), {
                    placeholder: input.placeholder ? input.placeholder : '',
                    classname: input.classname ? input.classname : 'form-control',
                    addValue: input.addButtonValue ? input.addButtonValue : 'Add Field',
                    removeValue: input.removeButtonValue ? input.removeButtonValue : 'Remove Field',
                    addButtonClass: input.addButtonClass ? input.addButtonClass : 'btn btn-primary',
                    removeButtonClass: input.removeButtonClass ? input.removeButtonClass : 'btn btn-danger',
                    name: input.name ? ' name="' + input.name : '',
                    message: {
                        required: '<div style="display: none;" class="alert alert-danger nos-help nos-required msg-required-' + input.name + '">' + (input.label || 'This') + ' is a required field</div>'
                    }
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

                        '<span class="input-group-addon nos-input-group-addon">' + (el.placeholder || '') + ' ' + addon + '</span>' +
                        '<input data-nos type="text" class="nos-clone ' + el.classname + '"' + el.data + el.name + i + '[]" ' + el.required + '>' +

                        div.end +

                        el.formGroup.end;

                }

                element += el.formGroup.end;

                element += el.helpBlock;

                element += '<input type="button" data-nos-add-button class="' + el.addButtonClass + ' nos-form-group" value="' + el.addValue + '">&nbsp;<input type="button" data-nos-remove-button value="' + el.removeValue + '" class="' + el.removeButtonClass + ' nos-form-group">';

                element += el.message.required;

                return element;

            },

            // returns select box with 50 states/territories/Canadian Provinces
            // the user specifies what to include, and this function will combine the appropriate objects to create the select element
            state: function (input) {

                var defaultToUs = input.us || input.us === undefined;

                var territories = { "American Samoa": "AS", "Federated States Of Micronesia": "FM", "Guam": "GU", "Marshall Islands": "MH", "Northern Mariana Islands": "MP", "Palau": "PW", "Puerto Rico": "PR", "Virgin Islands": "VI" };

                var states = { "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "District Of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY" };

                var provinces = { "Alberta": "AB", "British Columbia": "BC", "Manitoba": "MB", "New Brunswick": "NB", "Newfoundland and Labrador": "NL", "Nova Scotia": "NS", "Northwest Territories": "NT", "Nunavut": "NU", "Ontario": "ON", "Prince Edward Island": "PE", "Quebec": "QC", "Saskatchewan": "SK", "Yukon": "YT" };

                var mexico = { "Aguascalientes": "AG", "Baja California": "BC", "Baja California Sur": "BS", "Campeche": "CM", "Chiapas": "CS", "Chihuahua": "CH", "Coahuila": "MX", "Colima": "CL", "Federal District": "DF", "Durango": "DG", "Guanajuato": "GT", "Guerrero": "GR", "Hidalgo": "HG", "Jalisco": "JA", "Mexico": "ME", "Michoacán": "MI", "Morelos": "MO", "Nayarit": "NA", "Nuevo León": "NL", "Oaxaca": "OA", "Puebla": "PU", "Querétaro": "QE", "Quintana Roo": "QR", "San Luis Potosí": "SL", "Sinaloa": "SI", "Sonora": "SO", "Tabasco": "TB", "Tamaulipas": "TM", "Tlaxcala": "TL", "Veracruz": "VE", "Yucatán": "YU", "Zacatecas": "ZA" };



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
                var stateObj = sortObject($.extend((defaultToUs && states), (input.usTerritory && territories), (input.canada && provinces), (input.mexico && mexico))),
                    options = '<option value="">' + (input.defaultSelected || "Select One...") + '</option>';

                var el = $.extend(_getAttrs(input), {
                    classname: input.classname ? ' class="form-control ' + input.classname + '"' : ' class="form-control"',
                    selected: input.selected ? input.selected.toString().toLowerCase() : ''
                });

                $.each(stateObj, function (k, v) {
                    options += '<option value="' + v + '" ' + ((el.selected === v.toString().toLowerCase() || el.selected === k.toString().toLowerCase()) ? ' selected' : '') + '>' + k + '</option>';
                });

                var element = el.formGroup.start + el.label +
                    '<select data-nos ' + el.name + el.id + el.data + el.classname + el.size + el.multiple + el.readonly + el.tabindex + el.disabled + el.autofocus + el.required +
                    '>' +
                    options +
                    '</select>' + el.helpBlock +
                    el.message.required +
                    el.formGroup.end;
                return element;
            }
        };

        // field validation messages
        var _userErrorMessage = {

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

            maxlength: function (el) {
                var message;
                el.messages ? message = el.messages.maxlength : message = null;
                return '<div style="display: none;" class="alert alert-warning nos-help nos-invalid msg-maxlength-' + el.name + '">' + (message || (el.label || el.placeholder || 'This field') + ' must have a maximum of ' + el.maxlength + ' characters') + '</div>';
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
        var _validator = {

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

        // this function handles real time error messages while user is typing
        this._validate = function (fields) {

            // manage touched/untouched classes
            function manageTouchedFields() {
                var allFields = $($form + ' [data-nos]:not(:submit, :reset, :button, :image, :checkbox, :radio, input[type=color], input[type=range])');
                allFields
                    .addClass('nos-untouched')
                    .on('focus change', function () {
                        $(this).alterClass('nos-untouched', 'nos-touched');
                    });
            }

            // resets form
            function reset() {
                $($form + ' :reset[data-nos]').off('click').on('click', function () {
                    $(this).closest('form').find(':input:not(:submit, :reset, :button, :image)').val('').alterClass('nos-*', '').addClass('nos-untouched');
                    $($form + ' .nos-help').nosSlideUp();
                });
            }

            // checks maxlength on fields if browser doesn't catch/support it
            function maxLength(v) {
                var maxLengthId = (v.id || v.name);
                var msg = '.msg-maxlength-' + v.name;
                $('#' + maxLengthId)
                    .on('keydown', function (e) {
                        if ($(this).val().length > v.maxlength) {
                            $(this).val($(this).val().substring(0, v.maxlength));
                            e.preventDefault();
                        }
                    })
                    .on('blur keydown', function () {
                        $(this).val().length > v.maxlength ? $(msg).nosSlideDown() : $(msg).nosSlideUp();
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
                    msg = $form + ' .msg-invalid-' + nm,
                    id = '#' + (v.id || nm),
                    emval;
                $(id).on('keyup input change blur paste focus', function () {
                    switch (v.type) {

                        // once the user starts to type, email/zip/tel will be sent through a validator and a
                        // message will be displayed to warn user about invalid input
                        // message will disappear once input is valid
                        case 'email':
                            emval = $(this).val();
                            if (emval.length > 0) {
                                _validator.email(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-email', 'nos-valid-email')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-email', 'nos-invalid-email'));
                            }
                            emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-email nos-valid-email'));
                            break;

                        case 'zip':
                            emval = $(this).val();
                            if (emval.length > 0) {
                                _validator.zipcode(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-zip', 'nos-valid-zip')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-zip', 'nos-invalid-zip'));
                            }
                            emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-zip nos-valid-zip'));
                            break;

                        case 'tel':
                            emval = $(this).val();
                            if (emval.length > 0) {
                                _validator.phone(emval) ? ($(msg).nosSlideUp(), $(this).alterClass('nos-invalid-tel', 'nos-valid-tel')) : ($(msg).nosSlideDown(), $(this).alterClass('nos-valid-tel', 'nos-invalid-tel'));
                            }
                            emval === '' && ($(msg).nosSlideUp(), $(this).removeClass('nos-invalid-tel nos-valid-tel'));
                            break;

                    }
                }).on('blur change', function () {
                    $(this).removeClass('nos-valid-email nos-valid-zip nos-valid-tel');
                });
            }

            function addMask(v) {
                if ($.maskWatchers) {
                    $('#' + (v.id || v.name)).mask(v.mask);
                    $('#' + (v.id || v.name)).attr('data-mask', true);
                } else {
                    console.warn('You must include jQUery-Mask-Plugin to use "mask". Go here: https://igorescobar.github.io/jQuery-Mask-Plugin/');
                }
            }

            function cloneButtons() {
                // clone field add button functionality
                $($form + ' [data-nos-add-button]').off('click').on('click', function () {
                    $($form + ' .nos-input-group.hidden').length > 0 && $('.nos-input-group.hidden').eq(0).removeClass('hidden');
                    $($form + ' .nos-input-group.hidden').length === 0 && $(this).addClass('disabled');
                    $($form + ' .nos-input-group:not(.hidden)').length > 1 && $('[data-nos-remove-button]').removeClass('disabled');
                });

                // clone field remove button functionality
                $($form + ' [data-nos-remove-button]').off('click').on('click', function () {
                    $($form + ' .nos-input-group:not(.hidden)').length > 1 && $('.nos-input-group:not(.hidden)').eq(-1).addClass('hidden');
                    $($form + ' .nos-input-group:not(.hidden)').length === 1 && $(this).addClass('disabled');
                    $($form + ' .nos-input-group.hidden').length > 0 && $('[data-nos-add-button]').removeClass('disabled');
                });
            }

            // calls the validation functions
            function callValidation(k, v) {

                // clone add/remove button functionality
                if (v.type === 'clone') cloneButtons();

                // set mask
                if (v.mask) addMask(v);

                // call reset function
                if (v.type === 'reset') reset();

                // call email/zip/phone validation function
                if ((v.type === 'email' || v.type === 'zip' || v.type === 'tel') && (v.validate || v.validate === undefined)) {
                    validateFields(v);
                }

                // call pattern validation
                if (v.pattern) validatePattern(v);

                // call maxLength function
                if (v.maxlength) maxLength(v);

                // call minLength function
                if (v.minlength) minLength(v);

                // call min / max function
                if (v.min || v.max) minMax(v);

                // call password match function
                if (v.match) passwordMatch(v);

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


            // add touched/untouched classes
            manageTouchedFields();

        };

        // validation that runs on form submit
        this._submitValidation = function (data, evt) {

            // initializing form submit object
            var form = $(data).serializeArray(),
                formdata = {},

                // selectors for required fields
                reqInput = $($form + ' [data-nos]:not(:radio, :checkbox, :button, :submit, :reset, :file, :image, select, .nos-clone)').filter('[required]:visible'),
                reqSR = $($form + ' select[data-nos]').filter('[required]:visible'),
                fileField = $($form + ' :file[data-nos]'),
                cbgroup = $($form + ' :checkbox[data-nos]').parents('fieldset'),
                cb = $($form + ' :checkbox[data-nos]').filter('[required]:visible').parents('fieldset'),
                radio = $($form + ' :radio[data-nos]').filter('[required]:visible').parents('fieldset'),
                requiredFields = $($form + ' [data-nos]:not(:file, input[type=range], input[type=color])').filter('[required]:visible'),
                clone = $($form + ' .nos-clone');

            // assign serialized form object properties to new form submit object, unless it is a checkbox field
            function init() {
                $.each(form, function (key, value) {
                    if (value.name.indexOf('[]') === -1 && (self.settings.onlySubmitWithValue ? (value.value && value.value !== "") : value)) {
                        if (value.name.indexOf('.') > -1) {
                            var notation = value.name.split('.');
                            if (!formdata[notation[0]]) formdata[notation[0]] = {};
                            formdata[notation[0]][notation[1]] = value.value;
                        } else {
                            formdata[value.name] = value.value;
                        }
                    }
                });
                submitForm();
            }

            function checkRequiredFields() {
                requiredFields.each(function () {
                    ($(this).val().length < 1) ? $(this).alterClass('nos-valid-required', 'nos-invalid-required') : $(this).alterClass('nos-invalid-required', 'nos-valid-required');
                    $(this).on('change keyup keydown blur paste input', function () {
                        ($(this).val().length < 1) ? $(this).alterClass('nos-valid-required', 'nos-invalid-required') : $(this).alterClass('nos-invalid-required', 'nos-valid-required');
                    });
                });
            }

            // build submit object for clone types
            function buildClone() {
                var cloneName = $(clone).parents().siblings('.nos-label').attr('for');
                formdata[cloneName] = {};
                $.each(clone, function () {
                    var cloneFieldName = $(this).attr('name').split('[]');
                    if ($(this).val() !== "") {
                        formdata[cloneName][cloneFieldName[0]] = $(this).val();
                    }
                });
            }

            // create checkbox object for form submit response
            function cbSubmitObject() {
                var obj = {};

                // checks if object is full of false values
                function allFalse(obj) {
                    for (var i in obj) {
                        if (obj[i] === true) return false;
                    }
                    return true;
                }

                cbgroup.each(function (i) {
                    var str = $(this).attr('id'),
                        fcb = $(this).find(':checkbox'),
                        notation = str.split('.'),
                        isStrObj = str.indexOf('.') > -1;

                    if ($(this).hasClass('nos-submit-string')) {
                        var arr = [];
                        fcb.each(function () {
                            if (this.checked) {
                                arr.push($(this).attr('value'));
                            }
                        });
                        if (!isStrObj) formdata[str] = arr.toString();
                        else {
                            if (!formdata[notation[0]]) formdata[notation[0]] = {};
                            formdata[notation[0]][notation[1]] = arr.toString();
                        }
                        if (self.settings.onlySubmitWithValue && !formdata[str]) delete formdata[str];
                    }
                    else if ($(this).hasClass('nos-submit-array')) {
                        var arr2 = [];
                        fcb.each(function () {
                            if (this.checked) {
                                arr2.push($(this).attr('value'));
                            }
                        });
                        if (!isStrObj) formdata[str] = arr2;
                        else {
                            if (!formdata[notation[0]]) formdata[notation[0]] = {};
                            formdata[notation[0]][notation[1]] = arr2;
                        }
                        if (self.settings.onlySubmitWithValue && formdata[str].length < 1) delete formdata[str];
                    }
                    else {
                        obj[i] = {};
                        fcb.each(function () {
                            var uid = $(this).attr('value');
                            obj[i][uid] = this.checked;
                        });
                        if (!isStrObj) formdata[str] = obj[i];
                        else {
                            if (!formdata[notation[0]]) formdata[notation[0]] = {};
                            formdata[notation[0]][notation[1]] = obj[i];
                        }
                        if (self.settings.onlySubmitWithValue && allFalse(formdata[str])) delete formdata[str];
                    }
                });
            }

            // checkbox validation
            // build individual arrays for each required field and check to see if arrays are empty on form submit
            function validateCheckbox() {
                var cba = {},
                    cmsg = {};
                cb.each(function (i) {
                    var checkboxes = $(this).find(':checkbox');
                    cmsg[i] = '.msg-required-' + $(this).attr('id');
                    cba[i] = [];
                    $(checkboxes).each(function () {
                        if ($(this).is(':checked')) cba[i].push($(this).val());
                        $(this).off('change').on('change', function () {
                            $.inArray($(this).val(), cba[i]) > -1 ? cba[i].splice($.inArray($(this).val(), cba[i]), 1) : cba[i].push($(this).val());
                            cba[i].length > 0 ? $(cmsg[i]).nosSlideUp() : $(cmsg[i]).nosSlideDown();
                        });
                    });
                    if (cba[i].length < 1) $(cmsg[i]).nosSlideDown();
                });
            }

            // radio validation
            function validateRadio() {
                var arr = [];
                radio.each(function () {
                    var controls = $(this).find(':radio'),
                        msg = '.msg-required-' + $(this).attr('id');
                    $(controls).each(function () {
                        if ($(this).is(':checked')) arr.push(this.value);
                        $(this).on('change', function () {
                            if ($(this).is(':checked')) arr.push(this.value), $(msg).nosSlideUp();
                        });
                    });
                    if (arr.length < 1) $(msg).nosSlideDown();
                });
            }

            // check all text-based fields for a blank value
            function validateRequiredFields() {
                $(reqInput).each(function (i) {
                    var field = reqInput[i],
                        msg = $form + ' .msg-required-' + field.name;
                    field.value = _validator.sanitize(field.value);
                    if ($(field).val().length < 1) {
                        $(msg).nosSlideDown();
                        $(this).on('keyup keydown change blur paste input', function () {
                            if (this.value.length > 0) $(msg).nosSlideUp();
                            if (this.value.length < 1) $(msg).nosSlideDown();
                        });
                    }

                });
            }

            // select Required field validation
            function validateSelectFields() {
                $(reqSR).each(function (i) {
                    var sfield = reqSR[i],
                        msg = $form + ' .msg-required-' + sfield.name;
                    if ($(sfield).val() === '') {
                        $(msg).nosSlideDown();
                        $(this).off('change').on('change', function () {
                            if ($(this).val() !== '') $(msg).nosSlideUp();
                            if ($(this).val() === '') $(msg).nosSlideDown();
                        });
                    }
                });
            }

            // file Required field validation
            function validateFileFields() {
                $(fileField).each(function (i) {
                    var field = fileField[i];
                    var msg = $form + ' .msg-required-' + field.name;
                    var filelist = (document.getElementById(field.id || field.name).files || document.getElementById(field.id || field.name).value); // ie8 doesn't support 'files'
                    if (filelist.length === 0 && $(field).attr('required', true)) {
                        $(msg).nosSlideDown();
                        $(this).off('change').on('change', function () {
                            if ($(this).val() !== '') $(msg).nosSlideUp();
                            if ($(this).val() === '') $(msg).nosSlideDown();
                        });
                    }
                    formdata[field.name] = filelist;
                });
            }

            // send form submit object back to user if all fields are valid
            function submitForm() {

                if (okToSend()) { send(); }

                else if (!$($form + ' .nos-help').is(':visible') && $($form + ' .nos-untouched[required]').is(':visible')) {
                    $($form + ' [data-nos]').each(function () {
                        $(this).trigger('change');
                        $(this).alterClass('nos-untouched', 'nos-touched');
                    });
                    if (okToSend()) { send(); }
                }

                else {
                    $($form + ' .nos-required').is(':visible') && $($form + ' .nos-form-required').nosSlideDown();
                    $($form + ' .nos-invalid').is(':visible') && $($form + ' .nos-form-invalid').nosSlideDown();
                    $($form + ' [data-nos]').on('change input keyup blur focus paste', function () {
                        $($form + ' .nos-invalid').is(':visible') ? $($form + ' .nos-form-invalid').nosSlideDown() : $($form + ' .nos-form-invalid').nosSlideUp();
                        $($form + ' .nos-required').is(':visible') ? $($form + ' .nos-form-required').nosSlideDown() : $($form + ' .nos-form-required').nosSlideUp();
                    });
                }
            }

            // check if the form is ready to send
            function okToSend() {
                return !$($form + ' .nos-help').is(':visible') && !$($form + ' .nos-untouched[required]').is(':visible');
            }

            // send the form
            function send() {
                if (self.settings.honeypot) {
                    if ($($form + ' .nos-text-css').val() === '' && $($form + ' .nos-email-js').val() === 'validemail@email.com') {
                        if (self.settings.ajax) {
                            self.settings.submit(formdata, $($form), evt);
                            self.form.trigger('nos.submit', [
                                {
                                    formdata: formdata,
                                    form: $($form),
                                    submitEvent: evt
                                }
                            ]);
                        } else {
                            $('div.nos-div-hp-css').remove();
                            $('div.nos-div-hp-js').remove();
                            classicSubmit();
                        }
                    } else {
                        if (self.settings.ajax) {
                            self.settings.submit({ honeypot: true }, $($form), evt);
                            self.form.trigger('nos.submit', [
                                {
                                    formdata: formdata,
                                    form: $($form),
                                    submitEvent: evt
                                }
                            ]);
                        } else {
                            self.form.empty();
                            self.form.append('<input type="text" value="true" name="honeypot">');
                            classicSubmit();
                        }
                    }
                }
                else {
                    if (self.settings.ajax) {
                        self.settings.submit(formdata, $($form), evt);
                        self.form.trigger('nos.submit', [
                            {
                                formdata: formdata,
                                form: $($form),
                                submitEvent: evt
                            }
                        ]);
                    } else {
                        classicSubmit();
                    }
                }
            }

            // classic submit (no ajax)
            function classicSubmit() {

                // Unbind submit event
                self.form.off('submit nos.submit');

                // If there is a submit handler, just call it.
                // Gives user opportunity to do some processing before manually submitting the form
                if (self.settings.submit) {
                    self.settings.submit(formdata, $($form), evt);
                } else {
                    self.form.submit();
                }
            }

            if (clone.length) buildClone();

            if (cbgroup) cbSubmitObject();

            if (this.settings.validate) {

                checkRequiredFields(),
                    validateRequiredFields(),
                    validateCheckbox(),
                    validateRadio(),
                    validateSelectFields(),
                    validateFileFields();

            }

            // call submit & validation functions
            init();

        };

        this._bindEvents = function () {

            var self = this;

            // Init event
            self.form.on('nos.init', function () {
                self.settings.init(self.form);
            });


            // form submit function
            // runs validation and passes submit object to user
            self.form.on('submit', function (e) {

                // prevent default form submit
                e.preventDefault();

                // run submit form validation, unless user specifies not to
                self._submitValidation($(this), e);

            });

        };

        // error messages to warn of incorrect types in the configuration
        this._errorMessages = function () {

            var settings = this.settings;
            if (typeof settings.fields !== 'object') console.warn('Your form data is not an object!');
            if (!settings.fields) console.warn('You must supply form fields!');
            if (settings.validate && typeof settings.validate !== 'boolean') console.warn('"validate" must have a boolean value!');
            if (settings.htmlValidation && typeof settings.htmlValidation !== 'boolean') console.warn('"htmlValidation" must have a boolean value!');
            if (settings.submit && typeof settings.submit !== 'function') console.warn('"submit" must be a function!');
            if (settings.init && typeof settings.init !== 'function') console.warn('"init" must be a function!');
            if (settings.animationSpeed && typeof settings.animationSpeed !== 'number') console.warn('"animationSpeed" must be a number!');
            if (settings.messages && typeof settings.messages !== 'object') console.warn('"messages" must be an object!');
            if (settings.messageLocation && typeof settings.messageLocation !== 'object') console.warn('"messageLocation" must be an object!');
            if (settings.ajax && typeof settings.ajax !== 'boolean') console.warn('"ajax" must have a boolean value!');
            if (settings.honeypot && typeof settings.honeypot !== 'boolean') console.warn('"honeypot" must have a boolean value!');
            if (settings.onlySubmitWithValue && typeof settings.onlySubmitWithValue !== 'boolean') console.warn('"onlySubmitWithValue" must have a boolean value!');

        };

        // set some plugin behavior
        this._setBehavior = function (settings) {

            // toggles browser validation on/off based on user input - default is 'off'
            if (!this.settings.htmlValidation) this.form.attr('novalidate', '');

            // hide honeypot fields
            if (this.settings.honeypot) $('#' + this.form[0].id + ' .nos-div-hp-js').css('display', 'none');

            // Object.keys IE8 Polyfill
            // IE8 doesn't support Object.keys (used in input groups)
            if (!Object.keys) {
                Object.keys = function (obj) {
                    var keys = [];

                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            keys.push(i);
                        }
                    }

                    return keys;
                };
            }

            // helper function
            // changes names of classes and selects with wildcards
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

            // controls animation speed of the slideDown/slideUp effects
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

        };

        // renders form
        var _render = function (input) {
            $(element).html(input);
        };

        // set of functions to build form
        this._build = {

            // need to access this later
            self: this,
            // accepts objects that contain a form field
            // runs them through the proper build functions
            buildElements: function (obj) {

                var element = '';

                // loop through all element arrays and categorize each element type
                $.each(_elements, function (k) {

                    // when element type is matched to an array, it is sent to be built in the associated '_getElements' function
                    if ($.inArray(obj.type, this) > -1) {
                        element += _getElements[k](obj);
                    }

                });

                return element;

            },

            // this function is used for nested columns
            // it will loop through and check each object to see if there is another nested column
            // if there is, it will run it and apply the proper rows
            buildBlock: function (block) {

                var str = block.row ? '<div class="row nos-row">' : '',

                    self = this;

                // initial function call
                buildColumn(block);

                // function to check each new branch of elements for another nested column
                // this function will repeat until it reaches the end of the tree
                function buildColumn(col) {

                    // first column class
                    str += col.classname ? '<div class="' + col.classname + '">' : '';

                    $.each(col.column, function () {

                        if (this.column) {

                            // if there is another nested column with a row specified, add a row and check the next level
                            str += this.row ? '<div class="row nos-row">' : '';

                            // check the next level
                            buildColumn(this);

                            // end div for row
                            str += this.row ? '</div>' : '';

                        }

                        else {

                            // if no other nested column exists, build what we found
                            str += self.buildElements(this);

                        }

                    });

                    // end div for first column class
                    str += col.classname ? '</div>' : '';

                }

                // end divs for the rows
                str += block.row ? '</div>' : '';

                return str;

            },

            // the main build function
            // accepts the main form configuration object and sends the pieces where they need to go
            form: function () {

                var self = this,

                    // our form string
                    formStr = this.self.settings.honeypot ? _getElements.honeypot() : '',

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
                _render(formStr);

            }

        };


        // adds form validation messages to the end of the form tag
        this._addMessage = function () {

            function hasCols() {
                return $($form).find('[class^="col-"]').length > 0;
            }

            // determines if you are using row classes in your form and mimics this
            var message = {
                row: {
                    start: $($form).find('.nos-row').length ? '<div class="row">' : '',
                    end: $($form).find('.nos-row').length ? '</div>' : ''
                },

                // if entire form is wrapped in a col-* class, apply the same class to the form messages
                // this ensures that the form messages have the same placement and width as the form itself
                structure: this.settings.fields.length === 1 ? this.settings.fields[0].classname : hasCols() && 'col-md-12 col-sm-12 col-xs-12' || ''
            };

            var reqMsg = '<div class="clearfix"></div>' + message.row.start + '<div class="' + message.structure + '">' + _userErrorMessage.form.required(this.form[0]) + '</div>' + message.row.end,
                invMsg = '<div class="clearfix"></div>' + message.row.start + '<div class="' + message.structure + '">' + _userErrorMessage.form.invalid(this.form[0]) + '</div>' + message.row.end;

            // append an error message onto the form for required and invalid fields
            if (this.settings.messageLocation.bottom) {
                $(this.form[0]).append(reqMsg).append(invMsg);
            }

            // prepend an error message onto the form for required and invalid fields
            if (this.settings.messageLocation.top) {
                $(this.form[0]).prepend(reqMsg).prepend(invMsg);
            }

        };

        // initialize the plugin
        this._init();

    }

    // Avoid Plugin.prototype conflicts
    $.extend(Nos.prototype, {
        _init: function () {

            // displays error messages if the config object has incorrect types
            this._errorMessages();

            // set some form behaviors
            this._setBehavior(this.settings);

            // build the form
            this._build.form();

            // bind all events
            this._bindEvents();

            // Trigger init event
            this.form.trigger('nos.init');

            // run validation
            if (this.settings.validate) {

                this._validate(this.settings.fields);

                this._addMessage();

            }

            return this;

        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.nosForm = function Run(options) {

        return this.each(function () {

            if (!$.data(this, "plugin_nosForm")) {
                $.data(this, "plugin_nosForm", new Nos(this, options));
            }

            // DESTROY METHOD
            if (options === 'destroy') {
                $(this).off().empty();
                $.data(this, 'plugin_nosForm', null);
            }


        });
    };



}));


//# sourceMappingURL=nosform-jquery.js.map