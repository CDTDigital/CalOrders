/* 
 * The OnCore Consulting LLC License
 *
 * Copyright 2016 OnCore Consulting LLC, All Rights Reserved.
 *
 * Permission IS NOT GRANTED to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, unless the following conditions are met:
 *
 * Written permission is obtained from  
 * OnCore Consulting LLC and the above copyright 
 * notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'reference/ReferenceData'],
        function (oj, ko, $) {

            function ProductAddViewModel() {
                var self = this;

                self.applicationVersion = ko.observable("1.0");

                var serviceEndPoints = new ServiceEndPoints();

                //self.serviceURL = serviceEndPoints.getEndPoint('createEmployee');
                //self.employeeServiceURL = serviceEndPoints.getEndPoint('doesUserIdExist');

                self.router = oj.Router.rootInstance;
                self.tracker = ko.observable();

                //self.groupTypes = ko.observableArray(ReferenceData.getGroupTypes());

                self.productName = ko.observable();
                self.productNameMessage = ko.observable();
                self.productCategory = ko.observable();
                self.categories = ko.observableArray(ReferenceData.getCategories());
                self.productCategoryMessages = ko.observableArray([]);
                self.vendor = ko.observable();
                self.vendors = ko.observableArray(ReferenceData.getVendors());
                self.vendorMessages = ko.observableArray([]);
                self.productPrice = ko.observable();
                self.productDescription = ko.observable();
                self.productFullDesc = ko.observable();
                self.relatedServices = ko.observableArray([]);
                self.avaliableRelatedServices = ko.observableArray(ReferenceData.getRelatedServices());
                self.productImage = ko.observable();



                // Below are a subset of the ViewModel methods invoked by the ojModule binding
                // Please reference the ojModule jsDoc for additionaly available methods.

                /**
                 * Optional ViewModel method invoked when this ViewModel is about to be
                 * used for the View transition.  The application can put data fetch logic
                 * here that can return a Promise which will delay the handleAttached function
                 * call below until the Promise is resolved.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
                 * the promise is resolved
                 */
                self.handleActivated = function (info) {
                    // Implement if needed
                    // initialize session storage

                };

                /**
                 * Optional ViewModel method invoked after the View is inserted into the
                 * document DOM.  The application can put logic that requires the DOM being
                 * attached here.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
                 */
                self.handleAttached = function (info) {
                    // Implement if needed
                };


                /**
                 * Optional ViewModel method invoked after the bindings are applied on this View. 
                 * If the current View is retrieved from cache, the bindings will not be re-applied
                 * and this callback will not be invoked.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 */
                self.handleBindingsApplied = function (info) {
                    // Implement if needed
                };

                /*
                 * Optional ViewModel method invoked after the View is removed from the
                 * document DOM.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
                 */
                self.handleDetached = function (info) {
                    // Implement if needed
                };

                self.buttonClick = function (data, event) {
                    if (event.currentTarget.id === 'save')
                    {
                        var trackerObj = ko.utils.unwrapObservable(self.tracker);

                        // Perform form level validation
                        if (!this.showComponentValidationErrors(trackerObj))
                        {
                            return;
                        }
                        return true;

                    } else if (event.currentTarget.id === 'cancel')
                    {
                        // Do nothing and go back to search page
                       return self.router.go('productSearch');
                    }
                };

                self.validateProductName = {
                    validate: function (value)
                    {

                        parseProduct = function (response)
                        {
                            if (response != undefined)
                            {
                                var errorMsg = new oj.Message("That product name is already taken.", "", oj.Message.SEVERITY_TYPE.ERROR);
                                self.productNameMessage([errorMsg]);
                                return false;
                            }
                        };

                        var ProductService = oj.Model.extend({
                            urlRoot: self.productServiceURL + "/" + value,
                            parse: parseProduct,
                            idAttribute: 'empUid'});

                        var productService = new ProductService();
                        productService.fetch();

                        return true;
                    }
                };

                /*
                 * Perform form level validation
                 * 
                 * @param {type} trackerObj
                 * @returns {Boolean}
                 */
                self.showComponentValidationErrors = function (trackerObj)
                {
                    trackerObj.showMessages();

                    if (trackerObj.focusOnFirstInvalid())
                        return false;

                    return true;
                };



                self.validateProductCategory = {validate: function (value)
                    {
                        var validProductCategory = true;

                        // Hack for states dropdown and can't figure out how
                        // required error message is thrown by itself
                        if (typeof value === "undefined"
                                || value === "")
                        {
                            this.productCategoryMessages([
                                new oj.Message(
                                        "Value is required.",
                                        "You must select a value.",
                                        oj.Message.SEVERITY_TYPE.ERROR)]);
                            validProductCategory = false;

                        }
                        return validProductCategory;
                    }};

                self.validateVendor = {validate: function (value)
                    {
                        var validVendor = true;

                        // Hack for states dropdown and can't figure out how
                        // required error message is thrown by itself
                        if (typeof value === "undefined"
                                || value === "")
                        {
                            this.vendorMessages([
                                new oj.Message(
                                        "Value is required.",
                                        "You must select a value.",
                                        oj.Message.SEVERITY_TYPE.ERROR)]);
                            validVendor = false;

                        }
                        return validVendor;
                    }};

                self.router = oj.Router.rootInstance;


                /**
                 * The closeClickEvent method handles the click event
                 * generated from the close button.
                 * 
                 * @param {type} data
                 * @param {type} event
                 * @returns {unresolved}
                 */
                self.closeClickEvent = function (data, event) {
                    $("#modalDialog1").ojDialog("close");

                    return self.router.go('productSearch');
                };

            }



            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new ProductAddViewModel();
        }
);