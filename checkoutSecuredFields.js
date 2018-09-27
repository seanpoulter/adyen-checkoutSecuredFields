
window._a$checkoutShopperUrl = "https://checkoutshopper-test.adyen.com/checkoutshopper/";
/* global chckt, define, exports, module, self */
(function(){

    'use strict';

    /////////////////// Check globals - detection & export pattern from lodash 4.10.0 //////////////////////////////////////////

    /** Used to determine if values are of the language type `Object`. */
    var objectTypes = {
        'function': true,
        'object': true
    };

    /** Detect free variable `exports`. */
    var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : undefined;

    /** Detect free variable `module`. */
    var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : undefined;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : undefined;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

    /** Detect free variable `self`. */
    var freeSelf = checkGlobal(objectTypes[typeof self] && self);

    /** Detect free variable `window`. */
    var freeWindow = checkGlobal(objectTypes[typeof window] && window);

    /** Detect `this` as the global object. */
    var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

    /**
     * Used as a reference to the global object.
     *
     * The `this` value is used if it's the global object to avoid Greasemonkey's
     * restricted `window` object, otherwise the `window` object is used.
     */
    var root = freeGlobal ||
        ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
        freeSelf || thisGlobal;// || Function('return this')();

    /**
     * Checks if `value` is a global object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {null|Object} Returns `value` if it's a global object, else `null`.
     */
    function checkGlobal(value) {
        return (value && value.Object === Object) ? value : null;
    }

    //---------------------------------------------------------------------------


    // Create local, self-contained 'AMD' system to facilate modularisation of CSF code
    var noop = function(){return function(){};};

    var shared = {}, __define = noop, __require = noop;


    ///////////////////////// CheckoutSecureFields //////////////////////////////////////

    var _a$listenerRef = null;// Holder for a permanent ref to the 'message' listener we will use

    // NOTE: _window._a$checkoutShopperUrl is initialised when the (SDK) asset is served
    var _a$adyenURL = window._a$checkoutShopperUrl;
/* global shared, __define, __require */
(function(exports){

    "use strict";

    var modules = exports.__modules = {};

    function __require(name, optionalCallback){

        if(!name){
            return function(){
            };
        }

        if(typeof name === "string"){
            if(!modules.hasOwnProperty(name)){
                throw new Error("Adyen Sequencing Exception. Module '" + name + "' is not yet defined");
            }
            return modules[name];
        }

        var result = [];

        while(name.length > 0){
            result.push(__require(name.shift()));
        }

        if(typeof optionalCallback === "function"){
            optionalCallback.apply({}, result);
        }

        return result;
    }

    function __define(name, deps, item){
        var args = __require(deps);
        if(typeof item === "function"){
            modules[name] = item.apply({}, args);
        }else{
            modules[name] = item;
        }
    }

    exports.__require = __require;
    exports.__define = __define;

}(shared));

__define = shared.__define || __define;
__require = shared.__require || __require;

/* global __define */
__define( 'Constants', [], function () {

    "use strict";
    var constants = {};

    // Constants matching the data-hosted-ids used in the html to identify hosted input field holders
    // These coincide with the ids of the inputs in the iframe html
    constants.__HOSTED_NUMBER_FIELD_STR = 'encryptedCardNumber';
    constants.__HOSTED_DATE_FIELD_STR = 'encryptedExpiryDate';
    constants.__HOSTED_MONTH_FIELD_STR = 'encryptedExpiryMonth';
    constants.__HOSTED_YEAR_FIELD_STR = 'encryptedExpiryYear';
    constants.__HOSTED_CVC_FIELD_STR = 'encryptedSecurityCode';

    return constants;
} );
/* global __define */

/**
 * Since SDK is to be a distributable file and run in the merchant's environment
 * we should avoid modifying globals that we didn’t create, including polyfills for browser apis
 */
__define( 'shims', [], function () {

    "use strict";
    var Shims = {};

    // For IE8
    Shims.forEach = function(pArray, pFn, pThisArg){

        if(pArray.forEach){

            pArray.forEach(pFn, pThisArg);

        }else{

            for (var i = 0, n = pArray.length; i<n; i++){
                if (i in pArray){
                    pFn.call(pThisArg, pArray[i], i, pArray);
                }
            }
        }
    };

    // For IE8
    Shims.filter = function(pArray, pFn, pThisArg){

        var res;

        if(pArray.filter){

            res = pArray.filter(pFn);

        }else{

            var t = Object(pArray);
            var len = t.length >>> 0;
            if (typeof pFn !== 'function') {
                throw new TypeError();
            }

            res = [];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];

                    // NOTE: Technically this should Object.defineProperty at
                    //       the next index, as push can be affected by
                    //       properties on Object.prototype and Array.prototype.
                    //       But that method's new, and collisions should be
                    //       rare, so use the more-compatible alternative.
                    if (pFn.call(pThisArg, val, i, t)) {
                        res.push(val);
                    }
                }
            }
        }

        return res;
    };

    return Shims;
} );
/* global define */
__define( 'DOM', [], function () {

    "use strict";
    var DOM = {};
    DOM._select = function ( root, selector ) {

        if(!root){
            return [];
        }

        // Convert NodeList to array
        if(typeof root.querySelectorAll === "function"){
            return [].slice.call( root.querySelectorAll( selector ) );
        }

        // ELSE... IE8 - to convert StaticNodeList to array, from: https://jsperf.com/nodelist-to-array-ie8-compatible
        var arr = [];
        var n = root.querySelectorAll( selector );
        for(var z = n.length; z--;){
            arr.unshift(n[z]);
        }
        return arr;
    };

    DOM._selectOne = function ( root, selector ) {

        if(!root){
            return undefined;
        }

        return root.querySelector( selector );
    };

    DOM._closest = function ( node, selectorString ) {

        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        // Get closest match
        for ( ; node && node !== document; node = node.parentNode ) {
            if ( node.matches( selectorString ) ){
                return node;
            }
        }

        return null;
    };

    DOM._getAttribute = function ( node, attribute ) {

        if(!node){
            return;
        }
        return node.getAttribute( attribute ) || '';
    };

    DOM._on = function ( node, event, callback, useCapture ) {
        if ( typeof node.addEventListener === "function" ) {
            node.addEventListener( event, callback, useCapture );
        } else {
            if ( node.attachEvent ) {
                node.attachEvent( "on" + event, callback );
            } else {
                throw new Error( ": Unable to bind " + event + "-event" );
            }
        }
    };

    return DOM;
} );
/* global define */
__define( 'Utils', [], function () {

    "use strict";
    var Utils = {};

    Utils._isArray = function ( prop ) {
        return typeof prop === "object" && prop !== null && Object.prototype.toString.call( prop ) === "[object Array]";
    };

    // Util class to check if a set of required elements are defined on an object TODO: make it pretty (if more than one property isn't specified, add to array and throw error after looping through)
    Utils.__checkSetupObject = function (configObject, necessaryPropertyArray) {

        for (var i = 0; i < necessaryPropertyArray.length; i++) {
            var property = necessaryPropertyArray[i];

            if (!configObject[property]) {
                throw new Error("The property " + necessaryPropertyArray[i] + " is undefined");
            }
        }
    };

    Utils._capitaliseFirstLetter = function ( string ) {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
    };

    return Utils;
} );
/* global __define, _a$adyenURL, _a$listenerRef */
__define( 'checkoutSecuredFields_config', ['DOM', 'Utils', 'Constants', 'shims'], function ( DOM, Utils, Constants, Shims) {

    "use strict";

    /**
     *
     * @param pSharedScope - Object for sharing functionality between CSF modules
     * @param pSetupObj - CSF config object, passed when CSF is initiated against the global var csf
     * @param pSharedState - Object for sharing state between CSF modules
     */
    var module = function(pSharedScope, pSetupObj, pSharedState){

        var DEFAULT_CARD_GROUP_TYPES = ['amex', 'mc', 'visa'];

        var __cardGroupTypes = [];

        var __configPMs;

        var __iframeCount = 0;

        var __sfLogAtStart = false;

        var __recurringCardIndicator;

        var __noop = function(){return null;};

        var genRandomNumber = function() {

            if(!window.crypto){
                return Math.random()*0x100000000|0;
            }

            var ranNum = new Uint32Array(1);
            window.crypto.getRandomValues(ranNum);
            //TODO alt. for IE < 11
            return ranNum[0];
        };

        /**
         * Generate iframe
         * Find/Store rootNode - the element specified by the merchant as the parent for all checkout elements
         * Send call to place iframes in each hosted input field
         * If that is successful add listener for the window 'message' event
         */
        var __init = function () {

            if(!pSetupObj) {
                if(window.console && window.console.error){
                    window.console.error('ERROR: No securedFields configuration object defined');
                }
                return;
            }

            if(!pSetupObj.rootNode) {
                if(window.console && window.console.error){
                    window.console.error('ERROR: SecuredFields configuration object does not have a rootNode property');
                }
                return;
            }

            if(!pSetupObj.configObject) {
                if(window.console && window.console.error){
                    window.console.error('ERROR: SecuredFields configuration object does not have a configObject property');
                }
                return;
            }

            if(pSetupObj._b$dl === true){
                __sfLogAtStart = true;
            }

            // By default CSF is allowed to add the encrypted element to the DOM - user of CSF must explicitly 'opt-out' to prevent this happening
            pSharedScope.allowedDOMAccess = (pSetupObj.allowedDOMAccess === false || pSetupObj.allowedDOMAccess === 'false')? false : true;

            // By default CSF will NOT perform a console.warn when receiving postMessages with origin or numKey mismatches - user of CSF must explicitly 'opt-in' to get this
            pSharedScope.showWarnings = (pSetupObj.showWarnings === true || pSetupObj.showWarnings === 'true')? true : false;

            // NOTE: pSetupObj = {rootNode, configObject, paymentMethods}; // AND loadingContext if 'scoping' loadingContext for testing in development
            var configObj = pSetupObj.configObject;

            // Configuration object for individual txVariants: based on default, overwritable by merchant
            // Contains styling object & placeholders for securedFields inputs
            __configPMs = pSetupObj.paymentMethods;


            // Set the way we detect recurring cards e.g mc_r1
            __recurringCardIndicator = (pSetupObj.recurringCardIndicator)? pSetupObj.recurringCardIndicator : '_r';


            // Use 'scoped' loadingContext from configObject
            // Only applies in situation where CSF is part of SDK: in this scenario we no longer rely on
            // window._a$checkoutShopperUrl being created when the asset is served and if its not created then _a$adyenURL = undefined
            if(pSetupObj.loadingContext){

                if(window._b$dl && window.console && window.console.log){
                    window.console.log('### checkoutSecuredFields_config::__init:: _a$adyenURL=',_a$adyenURL);
                    window.console.log('### checkoutSecuredFields_config::__init:: pSetupObj.loadingContext=',pSetupObj.loadingContext);
                }
                _a$adyenURL = pSetupObj.loadingContext;
            }

            // If running as part of SDK window.chckt will contain a cardGroupTypes object...
            // ...otherwise check for passed cardGroupTypes OR create cardGroupTypes array by processing the passed paymentMethods object

            // c. Agents
            var checkSDKCardGroupTypes = function(pCardGroupTypes){

                return ( Utils._isArray(pCardGroupTypes) ) ? pCardGroupTypes : [];
            };

            // CSF not running as part of SDK: see if we've been passed an array of cardGroupTypes. If not - create one from the list of paymentMethods
            var createOwnCardGroupTypes = function(pCardGroupTypes, pPaymentMethods){

                return ( Utils._isArray(pCardGroupTypes) )? pCardGroupTypes : __getCardPms(pPaymentMethods);
            };

            // a. Situation
            var hasCardListFromSDK = (window.chckt && window.chckt.cardGroupTypes);

            // b. Decision
            __cardGroupTypes = (hasCardListFromSDK)? checkSDKCardGroupTypes(window.chckt.cardGroupTypes) : createOwnCardGroupTypes(configObj.cardGroupTypes, configObj.paymentMethods);

            if(window._b$dl && window.console && window.console.log){
                window.console.log('### checkoutSecuredFields_config::init:: cardGroupTypes=',__cardGroupTypes);
            }


            ////////// COMMENT IN FOR IE TESTING OF CSF-STANDALONE //////////
            // e.g. 192.168.56.1 (Terminal > ifconfig > vboxnet0 > inet)
//            _a$adyenURL = 'http://192.168.56.1:8080/checkoutshopper/';
            //---------------------------------------------------------------

            var csfPublicKeyToken = '';

            if (configObj.publicKeyToken) {
                csfPublicKeyToken = '?pkt=' + configObj.publicKeyToken;
            }

            var iframeSrc = _a$adyenURL + 'assets/html/' + configObj.originKey + '/securedFields.' + '1.3.1' + '.html' + csfPublicKeyToken;
            //TODO###### FOR QUICK LOCAL TESTING FROM xamples_csfOnly/sf DIR - COMMENT IN CODE BELOW ####################
            // iframeSrc = './sf/securedFields.' + '1.3.1' + '.html';
            //TODO#######################################################################################################

            if (window._b$dl && window.console && window.console.log) {
                window.console.log('\n############################');
                window.console.log('### checkoutSecuredFields_config::init:: configObj= + csfPubliKeyToken', configObj + ' csfPKT= ' + csfPublicKeyToken);
                window.console.log('### checkoutSecuredFields_config::init:: iframeSrc=', iframeSrc);
                window.console.log('### checkoutSecuredFields_config::init:: _a$adyenURL=',_a$adyenURL);
            }

            var iframeHtml = '<iframe src="' + iframeSrc + '" class="js-iframe" frameborder="0" scrolling="no" allowtransparency="true" style="border: none; height: 100%; width: 100%;"><p>Your browser does not support iframes.</p></iframe>';

            // Expect to be sent the actual html node...
            if (typeof pSetupObj.rootNode === 'object') {

                pSharedState.rootNode = pSetupObj.rootNode;

            } else if (typeof pSetupObj.rootNode === 'string') {

                // ... but if only sent a string - find it ourselves
                pSharedState.rootNode = document.querySelector(pSetupObj.rootNode);

                if (!pSharedState.rootNode) {
                    if(window.console && window.console.error){
                        window.console.error('ERROR: SecuredFields cannot find a valid rootNode element');
                    }
                    return;
                }
            }
            //--

            pSharedScope.numIframes = __populateIframes(iframeHtml);

            (pSharedScope.numIframes) ? __addMessageListeners() : __noop();

            //TEST
            //            setTimeout(function(){ pScope.__sendValueToFrame('card', 'hostedSecurityCodeField', '737');},2000);
        };

        /**
         * Create & populate state object - mostly used to store and detect validity of individual fields and the PM form as a whole
         * Detect hosted input fields & place iframes in each one
         * Store loaded iframe's contentWindow (the Window object of the <iframe> element)
         * Add listener for iframe 'load' event
         *
         * @param pIframeHtml: the iframe html, pointing to Adyen hosted content, that will be placed into each hosted input field
         * @private
         */
        var __populateIframes = function (pIframeHtml) {

            var encryptedAttrName = 'data-encrypted-field';

            var secureFields = DOM._select(pSharedState.rootNode, '[' + encryptedAttrName + ']');

            // Fallback to old attr name
            if(!secureFields.length){

                encryptedAttrName = 'data-cse';
                secureFields = DOM._select(pSharedState.rootNode, '[' + encryptedAttrName + ']');
            }

            // Need a shim for IE8
            Shims.forEach(secureFields, function (pItem) {

                // Check that the SF holder is located within an element with the correct identifying class...
                var form = DOM._closest(pItem, '.js-chckt-pm__pm-holder');

                // ...if this is not the case, for backward compatibility, check that the SF holder sits in a form element
                if(!form){
                    form = DOM._closest(pItem, 'form');
                }

                var txVariant = form.querySelector('[name="txvariant"]').value;// e.g. 'card' OR 'mc', 'visa' etc...

                var fieldType = DOM._getAttribute(pItem, encryptedAttrName);// e.g. 'encryptedCardNumber', 'encryptedExpiryDate', 'encryptedSecurityCode'

                var optional = DOM._getAttribute(pItem, 'data-optional'); // true | false

                // Usually false for single cards but with exceptions e.g. maestro
                // Always false for consolidated cards at start up.
                // Subsequent information about whether cvc is optional now comes from SF, in the Brand information (as the shopper inputs the CC number)
                var cvcIsOptional = (fieldType === Constants.__HOSTED_CVC_FIELD_STR && optional === 'true');

                // MAKE *ONE* STORAGE OBJECT FOR EACH txVariant. (See comments in 'core' file, where pSharedState.txVariantStateObject variable is declared)
                __createStateObject(pSharedState.txVariantStateObject, txVariant);

                // MAKE *ONE* STORAGE OBJECT FOR EACH txVariant TO STORE iframe REFS
                // NOTE: kept separate from state so we can, if we want, make all state change functions 'pure' i.e. non-mutating.
                // (That can't work while we have the iframe refs since these are Window objects and not so not
                // deep-clonable - we need to maintain the original ref)
                if (!pSharedState.txVariantIframeStore[txVariant]){
                    pSharedState.txVariantIframeStore[txVariant] = {};
                }

                //////// INITIALLY POPULATE STATE STORAGE OBJECT with false values, indicating field validity ///////////
                __populateStateObject(pSharedState.txVariantStateObject, txVariant, fieldType, cvcIsOptional);

                var iframe, iframeContent;

                // Place the iframe into the holder
                pItem.innerHTML = pIframeHtml;

                // Now examine the holder to get an actual DOM node
                iframe = DOM._selectOne(pItem, '.js-iframe');

                if (iframe) {

                    iframeContent = iframe.contentWindow;

                    // Store ref to specific, secureField, iframeContent
                    pSharedState.txVariantIframeStore[txVariant][fieldType + '_iframe'] = iframeContent;

                    DOM._on(iframe, 'load', __onIFrameLoaded(txVariant, fieldType, iframeContent), false);
                }
            });// forEach

            if (window._b$dl && window.console && window.console.log) {
                window.console.log('\n### checkoutSecuredFields_config::__populateIframes:: pSharedState.txVariantStateObject=', pSharedState.txVariantStateObject);
                window.console.log('\n### checkoutSecuredFields_config::__populateIframes:: pSharedState.txVariantIframeStore=', pSharedState.txVariantIframeStore);
            }

            return secureFields.length;
        };//__populateIframes

        /**
         * Listener for iframe 'load' event
         * Creates and sends config object to the secureField script that is intialised when the iframe loads
         * Calls callback function if all iframes have loaded
         *
         * @param pTxVariant - config var for secureFields
         * @param pFieldType - config var for secureFields
         * @returns {Function}
         * @private
         */
        var __onIFrameLoaded = function (pTxVariant, pFieldType) {

            // Strips the recurring card indicator e.g. _r1
            var rIndex = pTxVariant.indexOf(__recurringCardIndicator);
            var strippedTxVariant =  (rIndex > -1) ? pTxVariant.substring(0, rIndex) : pTxVariant;

            return function () {

                var dataObj = {
                    txVariant: pTxVariant,
                    fieldType: pFieldType,
                    cardGroupTypes: __cardGroupTypes,
                    recurringCardIndicator : __recurringCardIndicator,
                    pmConfig: (__configPMs)? __configPMs[strippedTxVariant] || __configPMs.card : {},
                    sfLogAtStart :__sfLogAtStart,
                    numKey: pSharedState.txVariantStateObject[pTxVariant][pFieldType + '_numKey']
                };
                if (window._b$dl && window.console && window.console.log) {
                    window.console.log('\n############################');
                    window.console.log('### checkoutSecuredFields_config::iframeLoaded:: dataObj=', dataObj);
                    window.console.log('### checkoutSecuredFields_config::iframeLoaded:: _a$adyenURL=', _a$adyenURL);
                }

                pSharedScope.postMessageToIframe(pTxVariant, pFieldType, dataObj);

                __iframeCount++;

                if (__iframeCount === pSharedScope.numIframes) {

                    pSharedScope.onLoadCallback( {iframesLoaded: true}) ;
                }
            };
        };

        var __addMessageListeners = function () {

            var isNotIE8 = (window.addEventListener) ? true : false;

            if (_a$listenerRef) {

                (isNotIE8) ? window.removeEventListener("message", _a$listenerRef, false) : window.detachEvent("onmessage", _a$listenerRef);
            }

            // Create reference to listener we're about to use. We will need it if we want to remove the listener at any stage
            _a$listenerRef = pSharedScope.iframePostMessageListener;

            (isNotIE8) ? window.addEventListener("message", pSharedScope.iframePostMessageListener, false) : window.attachEvent("onmessage", pSharedScope.iframePostMessageListener);
        };

        var __createStateObject = function (pTxVariantStateObject, pTxVariant) {

            //TODO - implement a 'pure function' approach of not mutating anything outside of the fn's scope

            if (!pTxVariantStateObject[pTxVariant]) {

                pTxVariantStateObject[pTxVariant] = {
                    brand: (pTxVariant !== 'card') ? pTxVariant : null,
                    actualValidStates: {},
                    currentValidStates: {},
                    allValid: false
                };
            }
            return pTxVariantStateObject;
        };

        var __populateStateObject = function (pStateObject, pTxVariant, pFieldType, pCvcIsOptional) {

            pStateObject[pTxVariant][pFieldType + '_numKey'] = genRandomNumber();

            if (window._b$dl && window.console && window.console.log ) {
                window.console.log( '### checkoutSecuredFields_config::pFieldType:: ',pFieldType);
                window.console.log( '### checkoutSecuredFields_config::numKey:: ',pStateObject[pTxVariant][pFieldType + '_numKey'] );
            }

            // Store whether CVC is a required field
            if (pFieldType === Constants.__HOSTED_CVC_FIELD_STR) {
                pStateObject[pTxVariant].cvcIsOptional = pCvcIsOptional;
            }

            return pSharedScope.setValidState(pStateObject, pTxVariant, pFieldType, false);
        };

        // Create an array of cardGroupTypes from the list of paymentMethods, else resort to a default list
        var __getCardPms = function(pPaymentMethods){

            var i, pItem, cardGroupTypes = [], len = (pPaymentMethods)? pPaymentMethods.length : 0;

            for(i = 0; i < len; i++){

                pItem = pPaymentMethods[i];

                // If the PM's *group.type* = 'card'
                if(pItem.group && pItem.group.type && pItem.group.type === 'card'){

                    cardGroupTypes.push(pItem.type);// store types to help with identifying brands when validating the card no.
                }
            }

            if(!cardGroupTypes.length){
                cardGroupTypes = DEFAULT_CARD_GROUP_TYPES;
            }

            return cardGroupTypes;
        };

        __init();
    };

    return module;
});
/* global __define, _a$adyenURL */
__define( 'checkoutSecuredFields_handleSFNew', ['DOM', 'Utils', 'Constants', 'shims'], function (DOM, Utils, Constants, Shims) {

    "use strict";

    /**
     *
     * @param pSharedScope - Object for sharing functionality between CSF modules
     * @param pSharedState - Object for sharing state between CSF modules
     */
    var module = function(pSharedScope, pSharedState){

        var __noop = function(){return null;};

        var that = {};

        var __iframeConfigCount = 0;

        /**
         * Listener for Window.postMessage.
         * A procedural routine that takes the data sent from secureFields and performs a set of actions based on the that data
         * The main driver for action after a user input information into a secureField
         *
         * @param event - the event sent from the postMessage from a secureFields instance
         * @private
         */
        that.iframePostMessageListener = function (event){

            // DO ORIGIN CHECK - EXIT IF FAILED /////////////
            var origin = event.origin || event.originalEvent.origin;

            var adyenDomain = _a$adyenURL.substring(0, _a$adyenURL.indexOf('/checkoutshopper/'));

            if(window._b$dl && window.console && window.console.log){
                window.console.log('\n############################');
                window.console.log('### checkoutSecuredFields_handleSFNew::__iframePostMessageListener:: event origin=', origin);
                window.console.log('### checkoutSecuredFields_handleSF::__iframePostMessageListener:: page origin=', adyenDomain);
            }

            //TODO###### FOR QUICK LOCAL TESTING FROM xamples_csfOnly/sf DIR - COMMENT OUT CODE BELOW ####################
            if(origin !== adyenDomain){

                if(window.console && window.console.warn && pSharedScope.showWarnings){
                    window.console.warn('####################################################################################');
                    window.console.warn('WARNING checkoutSecuredFields :: postMessage listener for iframe :: origin mismatch!\n Received message with origin:', origin, 'but the only allowed origin for messages to CSF is', adyenDomain);
                    window.console.warn('####################################################################################');
                }
                return;
            }
            //TODO#######################################################################################################
            //--

            // PARSE DATA OBJECT
            var feedbackObj = JSON.parse(event.data);

            if (window._b$dl &&  window.console && window.console.log) {
                window.console.log( '### checkoutSecuredFields_handleSF::iframePostMessageListener:: feedbackObj=',feedbackObj );
            }


            if( pSharedState.txVariantStateObject[feedbackObj.txVariant][feedbackObj.fieldType + '_numKey'] !== feedbackObj.numKey){

                if(window.console && window.console.warn && pSharedScope.showWarnings){
                    window.console.warn('####################################################################################');
                    window.console.warn('WARNING checkoutSecuredFields :: postMessage listener for iframe :: data mismatch!');
                    window.console.warn('####################################################################################');
                }
                return;
            }

            if(typeof feedbackObj.action !== 'undefined'){

                switch(feedbackObj.action){

                case 'encryption':
                    if(feedbackObj.encryptionSuccess === true){
                        __handleSuccessfulEncryption(feedbackObj);
                    }else{
                        __handleValidation(feedbackObj);
                    }
                    break;

                case 'focus':
                    __handleFocus(feedbackObj);
                    break;

                case 'config':
                    __handleIframeConfigFeedback();
                    break;

                // iOS only
                case 'click':
                    __handleIFrameClick(feedbackObj);
                    break;

                case 'binValue':
                    __handleBinValue(feedbackObj);

                    // validation
                default:
                    __handleValidation(feedbackObj);
                }
            }
        };

        var __handleIframeConfigFeedback = function(){

            __iframeConfigCount++;

            if (__iframeConfigCount === pSharedScope.numIframes) {

                pSharedScope.onConfigSuccessCallback( {iframesConfigured: true}) ;
            }
        };

        // If we're not handling a successful encryption then we're handling some form of validation...
        var __handleValidation = function(pFeedbackObj){

            var callbackObj;

            if (window._b$dl && window.console && window.console.log) {
                window.console.log('\n### checkoutSecuredFields_handleSF::__handleValidation:: pFeedbackObj=', pFeedbackObj);
            }

            // EXTRACT VARS
            var txVariant = pFeedbackObj.txVariant;
            var fieldType = pFeedbackObj.fieldType;


            // CHECK IF CVC IS OPTIONAL
            __checkOptionalCvcStatus(pFeedbackObj);


            // FIND FORM ELEMENTS
            var markerResObj = __getMarkerAndForm(txVariant);
            var markerNode = markerResObj.markerNode;
            var parentForm = markerResObj.parentForm;


            // PROCESS ERRORS
            callbackObj = __processErrors(pFeedbackObj, markerNode, fieldType);
            pSharedScope.onErrorCallback(callbackObj);

            if(window._b$dl && window.console && window.console.log){
                window.console.log('### checkoutSecuredFields_handleSF::__handleValidation:: error callbackObj=',callbackObj);
            }


            // PROCESS CARD BRANDS
            callbackObj = __processBrand(pFeedbackObj, markerNode);

            if(window._b$dl && window.console && window.console.log){
                window.console.log('### checkoutSecuredFields_handleSF::__handleValidation:: brand callbackObj=',callbackObj);
            }

            if(callbackObj){
                pSharedScope.onBrandCallback(callbackObj);
            }


            // SET VALID STATE OF INDIVIDUAL INPUT TO FALSE, REMOVE ANY EXISTING ENCRYPTED ELEMENT & CHECK VALIDITY OF THE FORM AS A WHOLE

            if(window._b$dl && window.console && window.console.log){
                window.console.log('### checkoutSecuredFields_handleSF::__handleValidation:: 5c removing valid states!!!!');
                window.console.log('### checkoutSecuredFields_handleSF::__handleValidation:: 5c fieldType=',fieldType);
            }


            // If we're validation handling (& not encryption handling) field must be invalid
            callbackObj = __removeValidState(pSharedState.txVariantStateObject, fieldType, parentForm, txVariant, markerNode);

            // If the 'invalid' state we're setting represents a change of state...
            // ...callbackObj will exist & will be an array containing 1 or 2 objects that need to be broadcast
            if(callbackObj){

                for(var i = 0, len = callbackObj.length; i < len; i++){

                    // ...BROADCAST VALID STATE OF INDIVIDUAL INPUTS
                    pSharedScope.onFieldValidCallback(callbackObj[i]);
                }
            }


            // STORE VALID STATE OF THE FORM AS A WHOLE ///////
            callbackObj = __assessFormValidity(txVariant);

            // BROADCAST VALID STATE OF THE FORM AS A WHOLE
            pSharedScope.onAllValidCallback(callbackObj);
        };


        var __handleSuccessfulEncryption = function(pFeedbackObj){

            var callbackObj;

            if (window._b$dl && window.console && window.console.log) {
                window.console.log('\n### checkoutSecuredFields_handleSF::__handleSuccessfulEncryption:: pFeedbackObj=', pFeedbackObj);
            }

            // EXTRACT VARS
            var txVariant = pFeedbackObj.txVariant;
            var fieldType = pFeedbackObj.fieldType;


            // FIND FORM ELEMENTS
            var markerResObj = __getMarkerAndForm(txVariant);
            var markerNode = markerResObj.markerNode;
            var parentForm = markerResObj.parentForm;


            // SET FOCUS ON OTHER INPUT - If user has just typed a correct expiryDate - set focus on the cvc field OR typr a correct expiryMonth - focus on year field
            (pFeedbackObj.type === 'year' || fieldType === Constants.__HOSTED_YEAR_FIELD_STR) ? pSharedScope.setFocusOnFrame(txVariant, Constants.__HOSTED_CVC_FIELD_STR, 'yearSet') : __noop();
            (fieldType === Constants.__HOSTED_MONTH_FIELD_STR) ? pSharedScope.setFocusOnFrame(txVariant, Constants.__HOSTED_YEAR_FIELD_STR) : __noop();
            //--


            var i, uuid, encryptedType, encryptedFieldName, encryptedBlob;

            var encryptedObjArr = pFeedbackObj[fieldType];
            var encryptedObjArrLen = encryptedObjArr.length;

            // Loop through array of objects with encrypted blobs - normally only contains one object
            // but in case of combined encryptedExpiryDate field will contain 2 objects: one each for month & year
            for(i = 0; i < encryptedObjArrLen; i++){

                encryptedType = encryptedObjArr[i].type;
                uuid = txVariant +'-encrypted-' + encryptedType;

                encryptedFieldName = encryptedObjArr[i].encryptedFieldName;
                encryptedBlob = encryptedObjArr[i].blob;

                // ADD HIDDEN INPUT TO PARENT FORM ELEMENT, if allowed
                if(pSharedScope.allowedDOMAccess){

                    __addEncryptedElement(parentForm, encryptedFieldName, encryptedBlob, uuid);
                }
            }


            // REMOVE ANY ERRORS ON FIELD e.g. was a full number that failed the luhnCheck, then we corrected the number and now it passes
            callbackObj = __processErrors({error : ''}, markerNode, fieldType);
            pSharedScope.onErrorCallback(callbackObj);

            if(window._b$dl && window.console && window.console.log){
                window.console.log('### checkoutSecuredFields_handleSF::__handleSuccessfulEncryption:: error callbackObj=',callbackObj);
            }


            // SET VALID STATE OF FIELD TO TRUE
            pSharedScope.setValidState(pSharedState.txVariantStateObject, txVariant, fieldType, true);


            // BROADCAST VALID STATE OF INDIVIDUAL INPUTS
            // NOTE: when considering "INDIVIDUAL INPUTS" we are concerned with the 4 fields that the checkoutAPI expects to receive for a credit card payment:
            // encryptedCardNumber, encryptedSecurityCode, encryptedExpiryMonth, encryptedExpiryYear
            for(i = 0; i < encryptedObjArrLen; i++) {

                encryptedType = encryptedObjArr[i].type;
                uuid = txVariant +'-encrypted-' + encryptedType;

                encryptedFieldName = encryptedObjArr[i].encryptedFieldName;
                encryptedBlob = encryptedObjArr[i].blob;

                pSharedScope.onFieldValidCallback({
                        blob: encryptedBlob,
                        encryptedFieldName: encryptedFieldName,// encryptedCardNumber, encryptedSecurityCode, encryptedExpiryMonth, encryptedExpiryYear
                        fieldType: fieldType, // encryptedCardNumber, encryptedSecurityCode, encryptedExpiryDate
                        uid: uuid,// card-encrypted-encryptedCardNumber, card-encrypted-encryptedSecurityCode, card-encrypted-month, card-encrypted-year, card-encrypted-encryptedExpiryMonth, card-encrypted-encryptedExpiryYear
                    valid: true,
                        txVariant: txVariant,
                    markerNode: markerNode,// What do we do with this? - see comments on __getMarkerAndForm
                        type: encryptedType// encryptedCardNumber, encryptedSecurityCode, month, year, encryptedExpiryMonth, encryptedExpiryYear
                });

            }


            // CHECK FOR CARD BRAND INFORMATION (Only a number related feedbackObj will contain brand info & then only after pasting a full number)
            if (pFeedbackObj.hasBrandInfo){

                // Remake feedbackObj dropping encryption data (roll on ES6 destructuring!!)
                // We just need this object to set brand through the normal route, checking cvcOptional status along the way
                var simplifedFeedbackObj = {
                    fieldType : fieldType,
                    txVariant : txVariant,
                    imageSrc : pFeedbackObj.imageSrc,
                    brand : pFeedbackObj.brand,
                    cvcText : pFeedbackObj.cvcText,
                    cvcIsOptional: pFeedbackObj.cvcIsOptional
                };

                // CHECK IF CVC IS OPTIONAL
                __checkOptionalCvcStatus(simplifedFeedbackObj);


                // PROCESS CARD BRANDS
                callbackObj = __processBrand(simplifedFeedbackObj, markerNode);

                if(window._b$dl && window.console && window.console.log){
                    window.console.log('### checkoutSecuredFields_handleSF::__handleSuccessfulEncryption:: brand callbackObj=',callbackObj);
                }

                if(callbackObj){
                    pSharedScope.onBrandCallback(callbackObj);
                }
            }


            // STORE VALID STATE OF THE FORM AS A WHOLE ///////
            callbackObj = __assessFormValidity(txVariant);


            // BROADCAST VALID STATE OF THE FORM AS A WHOLE
            pSharedScope.onAllValidCallback(callbackObj);
        };

        // iOS thing re. iOS/Safari blur & focus bug
        var __handleIFrameClick = function(pFeedbackObj){

            // if ( window.console && window.console.log ) {
            //     window.console.log( '### checkoutSecuredFields_handleSF::__handleIFrameClick:: pFeedbackObj=',pFeedbackObj );
            // }

            pSharedScope.broadcastClickEvent(pFeedbackObj.txVariant, pFeedbackObj.fieldType);
        };
        //--

        var __handleFocus = function(pFeedbackObj){

            delete pFeedbackObj.numKey;

            var markerResObj = __getMarkerAndForm(pFeedbackObj.txVariant);

            pFeedbackObj.markerNode = markerResObj.markerNode;
            pSharedScope.onFocusCallback(pFeedbackObj);

            // if ( window.console && window.console.log ) {
            //     window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus:: pFeedbackObj=',pFeedbackObj );
            //     window.console.log( '\n checkoutSecuredFields_handleSF::__handleFocus ####################################' );
            // }


            var focusString = pFeedbackObj.txVariant + '_' + pFeedbackObj.fieldType;

            // if ( window.console && window.console.log ) {
            //     window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus:: FOCUS EVENT FROM:', focusString, 'val=',pFeedbackObj.focus);
            //     window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus:: CURRENTLY HAS FOCUS:', pSharedState.currentFocusObject);
            // }

            if(pFeedbackObj.focus){

                if(pSharedState.currentFocusObject !== focusString){

                    pSharedState.currentFocusObject = focusString;

                    // if ( window.console && window.console.log ) {
                    //     window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus::  STORING NEW FOCUS pSharedState.currentFocusObject=',pSharedState.currentFocusObject );
                    // }

                }
                // else{
                //     if ( window.console && window.console.log ) {
                //         window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus:: HANDLE FOCUS FIELD ALREADY HAS FOCUS pSharedState.currentFocusObject=',pSharedState.currentFocusObject );
                //     }
                // }

            }else{

                if(pSharedState.currentFocusObject === focusString){
                    // if ( window.console && window.console.log ) {
                    //     window.console.log( '### checkoutSecuredFields_handleSF::__handleFocus::  HANDLE FOCUS REMOVING STORED FOCUS' );
                    // }
                    pSharedState.currentFocusObject = null;
                }
            }
        };

        var __handleBinValue = function(pFeedbackObject){
            pSharedScope.onBinValueCallback( {binValue : pFeedbackObject.binValue, txVariant : pFeedbackObject.txVariant} );
        }

        ///////////////////////// HELPERS FOR VALIDATION & ENCRYPTION ROUTINES ////////////////////////////

        // CHECK IF CVC IS OPTIONAL: Brand information (from setting the CC number) now contains information about
        // whether cvc is optional for that brand e.g. maestro
        // If it is optional, and we're dealing with the consolidated card type,
        // (re)set the flags that indicate this & affect when the form is considered valid
        var __checkOptionalCvcStatus = function(pFeedbackObj){

            var txVariant = pFeedbackObj.txVariant;
            var isConsolidatedCard = (txVariant === 'card');

            if(isConsolidatedCard && pFeedbackObj.hasOwnProperty('cvcIsOptional')){

                // Note if passed value is different
                var isDiff = (pFeedbackObj.cvcIsOptional !== pSharedState.txVariantStateObject[txVariant].cvcIsOptional);

                // Set the overall flag for this txvariant - used by pSharedScope.setValidState to see if it should force a 'true' value on the cvc field (because it is optional)
                pSharedState.txVariantStateObject[txVariant].cvcIsOptional = pFeedbackObj.cvcIsOptional;

                // Set 'base' validity of the cvc field
                // Use case: in a consolidated card, switching between txvariants where the cvc is, & isn't, optional...
                // ... but only if the new broadcast value is different from the stored value should we update the state object
                if(isDiff){

                    if(window._b$dl && window.console && window.console.log){
                        window.console.log('### checkoutSecuredFields_handleSF::__handleValidation:: BASE VALUE OF cvcIsOptional HAS CHANGED feedbackObj.cvcIsOptional=',pFeedbackObj.cvcIsOptional);
                    }

                    pSharedScope.setValidState(pSharedState.txVariantStateObject, txVariant, Constants.__HOSTED_CVC_FIELD_STR, pFeedbackObj.cvcIsOptional, true);
                }
            }
        };

        // If consolidated card type AND passed brand doesn't equal stored brand - send the new brand to the cvc input
        // Create object for CSF Brand Callback fn with image & text details
        var __processBrand = function(pFeedbackObj, pMarkerNode){

            var callbackObj;

            var txVariant = pFeedbackObj.txVariant;
            var fieldType = pFeedbackObj.fieldType;

            if(fieldType === Constants.__HOSTED_NUMBER_FIELD_STR){

                var isConsolidatedCard = (txVariant === 'card');

                // If we have a new brand send it to the CVC input
                var newBrand = __checkForBrandChange( pFeedbackObj.brand, txVariant, pSharedState.txVariantStateObject);
                if (isConsolidatedCard && newBrand) {
                    pSharedState.txVariantStateObject[txVariant].brand = newBrand;
                    __sendBrandToFrame(txVariant, Constants.__HOSTED_CVC_FIELD_STR, newBrand);
                }

                // Check for brand related properties
                callbackObj = (isConsolidatedCard) ? __setBrandImageAndText(pFeedbackObj) : __noop();

                // Return object to send to Callback fn
                if (callbackObj) {

                    callbackObj.markerNode = pMarkerNode;

                    return callbackObj;
                }
            }

            return null;
        };

        // NOTE: the primary purpose of the markerNode is for CSF to use it identify
        // the containing form element in order to  attach the hidden inputs holding the encrypted card data.
        // A secondary purpose is, that once detected, we can send this 'markerNode' to the CSF callback functions (error, brand, fieldValid, focus)
        // - where it can be used to identify where the securedFields holding elements are e.g. in order to attach error states
        var __getMarkerAndForm = function (pTxVariant) {

            var markerNode, parentForm,
                pmNodes = DOM._select(pSharedState.rootNode, '[name="txvariant"]');

            // Identify the hidden input further up the DOM with the correct txvariant value - we will use this as a marker to identify the correct form element
            markerNode = Shims.filter(pmNodes, function (pItem) {
                return pItem.value === pTxVariant;// find the single item that matches
            }).shift();// remove it from the array that Shims.filter created

            // Use the markerNode to identify the element to which we want to append (or remove) the fields containing encrypted data
            // It should be an element with the correct identifying class...
            parentForm = DOM._closest(markerNode, '.js-chckt-pm__pm-holder');

            // ...if this is not the case, for backward compatibility, check for a form element
            if(!parentForm){
                parentForm = DOM._closest(markerNode, 'form');
            }

            return {markerNode: markerNode, parentForm: parentForm};
        };

        var __processErrors = function (pFeedbackObj, pMarkerNode, pFieldType) {

            var dataObj = {markerNode: pMarkerNode, fieldType: pFieldType};

            var isError = pFeedbackObj.hasOwnProperty('error') && pFeedbackObj.error !== '';
            dataObj.error = (isError) ? pFeedbackObj.error : '';

            return dataObj;
        };

        // Should always refer to the 'current' valid states
        // Set validity flags back to false & remove any encrypted DOM elements for a particular field type
        var __removeValidState = function (pStateObject, pFieldType, pParentForm, pTxVariant, pMarkerNode) {

            var currentValidStateForField = pStateObject[pTxVariant].currentValidStates[pFieldType];

            // IF field is not valid - return
            if(!currentValidStateForField){

                if(window._b$dl && window.console && window.console.log){
                    window.console.log('### checkoutSecuredFields_handleSF::__removeValidState:: NOTHING TO REMOVE :: pFieldType=',pFieldType);
                }
                return null;
            }

            // ELSE - field is valid, so:
            // - set valid state,
            // - look for DOM elements to remove,
            // - create callback objects to report the changed valid state of the field

                if(window._b$dl && window.console && window.console.log){
                    window.console.log('### checkoutSecuredFields_handleSF:: __removeValidState:: REMOVE :: pFieldType=',pFieldType);
                    window.console.log('### checkoutSecuredFields_handleSF:: __removeValidState:: REMOVE :: pTxVariant=',pTxVariant);
                }

            // Set & store valid state of field
                pSharedScope.setValidState(pStateObject, pTxVariant, pFieldType, false);


            var isExpiryDateField = (pFieldType === Constants.__HOSTED_DATE_FIELD_STR);

            var callbackObjectsArr = [];

            var sepExpiryDateNames = ['month', 'year'];

            var i, uuid, encryptedType, encryptedFieldName, encryptedElem;

            // For expiryDate field we need to remove 2 DOM elements & create 2 objects (relating to month & year)
            // - for everything else we just need to remove 1 element & create 1 callback object
            var totalFields = (isExpiryDateField)? 2 : 1;

            for(i = 0; i < totalFields; i++){

                encryptedType = (isExpiryDateField)? sepExpiryDateNames[i] : pFieldType;// month , year OR encryptedCardNumber, encryptedSecurityCode, encryptedExpiryMonth, encryptedExpiryYear
                uuid = pTxVariant + '-encrypted-' + encryptedType;// card-encrypted-month, card-encrypted-year )R card-encrypted-encryptedCardNumber, card-encrypted-encryptedSecurityCode, card-encrypted-encryptedExpiryMonth, card-encrypted-encryptedExpiryYear

                encryptedFieldName = (isExpiryDateField)? 'encryptedExpiry' + Utils._capitaliseFirstLetter(sepExpiryDateNames[i]) : pFieldType;// encryptedExpiryMonth, encryptedExpiryYear OR encryptedCardNumber, encryptedSecurityCode, , encryptedExpiryMonth, encryptedExpiryYear

                // Remove DOM elements
                if(pSharedScope.allowedDOMAccess){

                    encryptedElem = DOM._selectOne(pParentForm, '#' + uuid);

                    if (encryptedElem) {
                        pParentForm.removeChild(encryptedElem);
                    }
                }

                // Create objects to broadcast valid state
                callbackObjectsArr.push(
                    {
                        fieldType : pFieldType,// encryptedCardNumber, encryptedSecurityCode, encryptedExpiryDate
                    encryptedFieldName : encryptedFieldName,
                        uid: uuid,
                    valid: false,
                        txVariant: pTxVariant,
                    markerNode : pMarkerNode,
                        type : encryptedType
                    }
                );
            }

            return callbackObjectsArr;
        };

        // Adds hidden input to parent form element.
        // This input has a attribute 'name' whose value equals a field-type e.g. encryptedCardNumber
        // and an attribute 'value' whose value is the encrypted data blob for that field
        var __addEncryptedElement = function (pForm, pName, pData, pId) {

            var element = DOM._selectOne(pForm, '#' + pId);

            if (!element) {
                element = document.createElement('input');
                element.type = 'hidden';
                element.name = pName;
                element.id = pId;
                pForm.appendChild(element);
            }

            element.setAttribute('value', pData);
        };

        var __assessFormValidity = function(pTxVariant){

            var isValid = __checkFormIsValid(pSharedState.txVariantStateObject, pTxVariant);
            pSharedState.txVariantStateObject[pTxVariant].allValid = isValid;

            if(window._b$dl && window.console && window.console.log){
                window.console.log('\n### checkoutSecuredFields_handleSF::__assessFormValidity:: assesing valid states of the form as a whole isValid=',isValid);
            }

            return {allValid: isValid, type: pTxVariant};
        };


        ///////////////////////////////// TASKS (TO HELP THE HELPERS!) ////////////////////////////////////

        // If brand sent with feedbackObj doesn't equal stored brand - extract the new brand ready to send to the cvc field
        var __checkForBrandChange = function (pBrand, pTxVariant, pStateObj) {

            if(pBrand && pBrand !== pStateObj[pTxVariant].brand){

                if(window._b$dl && window.console && window.console.log){
                    window.console.log('\n### checkoutSecuredFields_handleSF::__checkForBrandChange:: Brand Change! new brand=',pBrand, '---- old brand=',pStateObj[pTxVariant].brand);
                }

                return pBrand;
            }
            return false;
        };

        var __setBrandImageAndText = function (pFeedbackObj) {

            var dataObj = {};
            var hasProps = false;

            if (typeof pFeedbackObj.brand !== 'undefined') {

                dataObj.brandImage = pFeedbackObj.imageSrc;
                dataObj.brand = pFeedbackObj.brand;
                hasProps = true;
            }

            if (typeof pFeedbackObj.cvcText !== 'undefined') {

                dataObj.brandText = pFeedbackObj.cvcText;
                hasProps = true;
            }

            return (hasProps) ? dataObj : null;
        };

        var __sendBrandToFrame = function (pTxVariant, pFieldType, pBrand) {

            // ...perform postMessage to send brand on specified field
            var dataObj = {txVariant: pTxVariant, fieldType: pFieldType, brand: pBrand, numKey : pSharedState.txVariantStateObject[pTxVariant][pFieldType + '_numKey']};
            pSharedScope.postMessageToIframe(pTxVariant, pFieldType, dataObj);
        };

        // Should always refer to the 'actual' valid states
        var __checkFormIsValid = function (pStateObject, pTxVariant) {

            for (var key in pStateObject[pTxVariant].actualValidStates) {

                if (pStateObject[pTxVariant].actualValidStates.hasOwnProperty(key) && // first part keeps jsHint happy
                    !pStateObject[pTxVariant].actualValidStates[key]) {// 2nd part checks if any validities are false

                    return false;
                }
            }

            return true;
        };

        return that;
    };

    return module;
});
/* global _a$adyenURL, __define */
__define('checkoutSecuredFields_core',
    ['checkoutSecuredFields_config', 'checkoutSecuredFields_handleSFNew', 'Constants'],
    function(CSFConfig, CSFHandleSF, Constants){

        "use strict";

        var checkoutSecureFields = function () {

            //        var chckt = window.chckt || {};
            //        var localhost = chckt.__localhost || 'localhost';

            // Object for sharing functionality between modules
            var __sharedScope = {};

            // Object for sharing state between modules
            var __sharedState = void 0;

            // Object providing public interface for CSF
            var that = {};

            //**** FUNCTION THAT IS EXPOSED ON THE GLOBAL VAR csf ****
            var __init = function (pSetupObj) {

                if(!pSetupObj) {
                    throw new Error ('No securedFields configuration object defined');
                }

                // Set here in case of re-rendering templates (SDK use-case)
                __sharedState = {};
                __sharedState.rootNode = null;// set in config process

                /**
                 * NOTE: __sharedState.txVariantStateObject STORES WHICH FIELD TYPES ARE IN USE FOR WHICH PARTICULAR VARIATION OF THE CC FORM
                 * - an object will be stored under txVariant (e.g. 'visa', 'mc', 'card') containing a 'actualValidStates' object which will have some or all of the keys: encryptedCardNumber, encryptedSecurityCode, encryptedExpiryDate, encryptedExpiryMonth, encryptedExpiryYear
                 * We can use the booleans stored under these keys to assess whether a form has been fully completed or not
                 *
                 * Another object is also stored, 'currentValidStates', describing whether a particular field is currently valid.
                 * NOTE: A field can be 'actually' valid whilst still be currently 'invalid' e.g. in the case of an optional cvc field - it is always 'actually' valid since it is not required, but if the shopper starts to fill it out
                 * anyway then it will switch current valid states from 'invalid' to 'valid' as it is completed.
                 *
                 * The 'current' state is used to assess whether to remove existing encrypted inputs and whether to callback reporting the state of a particular field.
                 * The 'actual' state is used to assess whether a form has been sufficiently completed such that it can now be submitted.
                 *
                 * So, stored under txVariant, in __sharedState.txVariantStateObject:
                 * - actualValidStates
                 * - currentValidStates
                 * - brand. The current card brand i.e. for the txVariant 'card' (combined CC) the card brand will change as the user inputs different card numbers
                 * - cvcIsOptional. Whether for a particular txVariant e.g. maestro, the cvc is an optional field. Value comes with the card brand info from securedFields. Affects actualValidState - for an optional cvc the valid state for that field will always be true
                 * - allValid. Boolean stating whether the CC form for a particular txVariant is currently fully valid i.e. all fields filled out & validated (and encrypted blobs sent &/or placed in DOM)
                 * - _numKey (prefixed with the fieldType e.g. expiryDateField_numKey). A random generated number used to further verify communication from the individual iframes
                 */
                __sharedState.txVariantStateObject = {};
                /**
                 * Stores a ref, under txVariant, to each of the secureField's iframe's contentWindows
                 * NOTE: kept separate from state so we can, if we want, make all state change functions 'pure' i.e. non-mutating.
                 * (That can't work while we have the iframe refs since these are Window objects and so are not deep-clonable - we need to maintain the original ref)
                 */
                __sharedState.txVariantIframeStore = {};
                //--

                // Handle communication from SF
                var sfHandler = CSFHandleSF(__sharedScope, __sharedState);

                // Store iframe listener on shared object
                __sharedScope.iframePostMessageListener = sfHandler.iframePostMessageListener;
                __sharedScope.numIframes = 0;

                // Setup & config
                CSFConfig(__sharedScope, pSetupObj, __sharedState);
            };


            ////////////////////////// TASKS /////////////////////////////////////////////////

            var __sendValueToFrame = function (pTxVariant, pFieldType, pInputTxt) {

                // ...perform postMessage to send value to set in specified field
                var dataObj = {txVariant: pTxVariant, fieldType: pFieldType, setValue: pInputTxt};
                __sharedScope.postMessageToIframe(pTxVariant, pFieldType, dataObj);
            };

            var __set_b$dl = function(pTxVariant, pFieldType, pB$dl){

                var dataObj = {txVariant: pTxVariant, fieldType: pFieldType, _b$dl : pB$dl, numKey : getNumKey(pTxVariant, pFieldType) };
                __sharedScope.postMessageToIframe(pTxVariant, pFieldType, dataObj);
            };

            var getNumKey = function(pTxVariant, pFieldType){

                return __sharedState.txVariantStateObject[pTxVariant][pFieldType + '_numKey'];
            };

            /////// SHARED TASKS - USED BY Core, CSFConfig & CSFHandleSF MODULES ///////
            // By exposing these methods on the __sharedScope object they remain accessible
            // to the core as well as to the config & handleSF modules

            // Core & handleSF
            __sharedScope.setFocusOnFrame = function (pTxVariant, pFieldType, pReason) {

                // ...perform postMessage to set focus on specified field
                var dataObj = {txVariant: pTxVariant, fieldType: pFieldType, focus: true, numKey : getNumKey(pTxVariant, pFieldType) };

                var doSetFocus = (pFieldType === Constants.__HOSTED_CVC_FIELD_STR && __sharedState.txVariantStateObject[pTxVariant].cvcIsOptional) ? false : true;

                // if (window._b$dl && window.console && window.console.log) {
                //     window.console.log('\n### checkoutSecuredFields_core::setFocusOnFrame:: doSetFocus=', doSetFocus);
                // }

                if (doSetFocus) {

                    __sharedScope.postMessageToIframe(pTxVariant, pFieldType, dataObj);
                }
            };


            // iOS thing re. iOS/Safari blur & focus bug
            __sharedScope.broadcastClickEvent = function(pTxVariant, pFieldType){

                var dataObj = {txVariant: pTxVariant, fieldType: pFieldType, click: true, numKey : getNumKey(pTxVariant, pFieldType) };

                __sharedScope.postMessageToAllIframes(pTxVariant, dataObj);
            };
            //--


            // Core, config & handleSF
            __sharedScope.postMessageToIframe = function(pTxVariant, pFieldType, pDataObj){

                var iframe = __sharedState.txVariantIframeStore[pTxVariant][pFieldType + '_iframe'];

                // In some cases the iframe might not exist e.g. bcmc which has no cvc field
                if(iframe){

                    var dataObjStr = JSON.stringify(pDataObj);
                    __sharedState.txVariantIframeStore[pTxVariant][pFieldType + '_iframe'].postMessage(dataObjStr, _a$adyenURL);
                }
            };

            __sharedScope.postMessageToAllIframes = function(pTxVariant, pDataObj){

                var dataObjStr = JSON.stringify(pDataObj);

                var txVarIframeStore = __sharedState.txVariantIframeStore[pTxVariant];

                for(var iframe in txVarIframeStore){

                    if(txVarIframeStore.hasOwnProperty(iframe)){

                        txVarIframeStore[iframe].postMessage(dataObjStr, _a$adyenURL);
                    }
                }
            };


            // Config & handleSF
            __sharedScope.setValidState = function (pStateObject, pTxVariant, pFieldType, pVal, pDontSetCurrentState) {

                pStateObject[pTxVariant].actualValidStates[pFieldType] = pVal;

                if(!pDontSetCurrentState){

                    pStateObject[pTxVariant].currentValidStates[pFieldType] = pVal;
                }

                // Exception: If cvc is optional always mark its 'actual' validState as true
                if (pStateObject[pTxVariant].cvcIsOptional && pFieldType === Constants.__HOSTED_CVC_FIELD_STR) {
                    pStateObject[pTxVariant].actualValidStates[pFieldType] = true;
                }

                return pStateObject;
            };

            // Config
            __sharedScope.onLoadCallback = function(){};

            // handleSF
            __sharedScope.onConfigSuccessCallback = function(){};
            __sharedScope.onAllValidCallback = function(){};
            __sharedScope.onFieldValidCallback = function(){};
            __sharedScope.onBrandCallback = function(){};
            __sharedScope.onErrorCallback = function(){};
            __sharedScope.onFocusCallback = function(){};
            __sharedScope.onBinValueCallback = function(){};

            //------ end SHARED TASKS - USED BY CSFConfig &/OR CSFHandleSF MODULES --------


            //////////////// PUBLIC METHODS - EXPOSED WHEN CSF IS INITIALISED ///////////////
            that.init = function(pSetupObj){
                __init(pSetupObj);
                return that;
            };

            // Set focus on specific frame e.g. when form first loads
            that.setFocusOnFrame = function (pTxVariant, pHostedFieldId) {

                __sharedScope.setFocusOnFrame(pTxVariant, pHostedFieldId, 'Card PM selected');
            };

            ////// EVENTS THE USER (the one who initialises CSF) CAN SUBSCRIBE TO
            that.onLoad = function(pCallbackFn){
                __sharedScope.onLoadCallback = pCallbackFn;
                return that;
            };

            that.onConfigSuccess = function(pCallbackFn){
                __sharedScope.onConfigSuccessCallback = pCallbackFn;
                return that;
            };

            that.onAllValid = function(pCallbackFn){
                __sharedScope.onAllValidCallback = pCallbackFn;
                return that;
            };

            that.onFieldValid = function(pCallbackFn){
                __sharedScope.onFieldValidCallback = pCallbackFn;
                return that;
            };

            that.onBrand = function(pCallbackFn){
                __sharedScope.onBrandCallback = pCallbackFn;
                return that;
            };

            that.onError = function(pCallbackFn){
                __sharedScope.onErrorCallback = pCallbackFn;
                return that;
            };

            that.onFocus = function(pCallbackFn){
                __sharedScope.onFocusCallback = pCallbackFn;
                return that;
            };

            that.onBinValue = function(pCallbackFn){
                __sharedScope.onBinValueCallback = pCallbackFn;
                return that;
            };

            that._b$dl = function(pTxVariant, pHostedFieldId, pB$dl){
                __set_b$dl(pTxVariant, pHostedFieldId, pB$dl);
            };
            //--

            // Util
            that.getPaymentMethodDataByPm = function (pPms, pBrand) {

                var len = pPms.length, pm = null;

                for (var i = len; i-- > 0;) {

                    if (pPms[i].type === pBrand) {

                        pm = pPms[i];
                        break;
                    }
                }

                return pm.paymentMethodData;
            };

            //------- end PUBLIC METHODS - EXPOSED WHEN CSF IS INITIALISED -------

            return that;
        };

        return checkoutSecureFields;
    }
);
///////////////////////// Export ////////////////////////////////////////////
var chktSF = __require('checkoutSecuredFields_core');// require CSF
var sf = chktSF().init;// initialise CSF and get ref to that.init

// Expose checkoutSecureFields on the free variable `window` or `self` when available. This
// prevents errors in cases where checkoutSecureFields is loaded by a script tag in the presence
// of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch for more details.
(freeWindow || freeSelf || {}).csf = sf;

// Some AMD build optimizers like r.js check for condition patterns like the following:
if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "checkoutSecureFields" module.
    // e.g.
    // require.config({
    //   paths: { checkoutSecureFields : '...url to checkoutSecureFields WITHOUT the ".js" file extension'}
    // });
    //
    // require(['checkoutSecureFields'], function(sF){ sF(configObj); });
    define(function() {
        return sf;
    });
}
// Check for 'exports' after 'define' in case a build optimizer adds an 'exports' object.
else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
        (freeModule.exports = sf).csf = sf;
    }
    // Export for CommonJS support.
    freeExports.csf = sf;
}
else {
    // Export to the global object.
    root.csf = sf;
}

}());
