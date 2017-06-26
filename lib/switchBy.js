/** 
 * Creates a stream that executes functions based on of the match of an
 * associated key to the result of a predicate.
 * 
 * @param {SwitchPredicate} predicate
 *    function to determine, which case to evaluate  
 * @param {SwitchCase[]} switchCases
 *    collection of SwitchCases available to the stream
 * @param {SwitchCaseFunction} [defaultCase]
 *    [optional] default case behavior, executed if no switchCase is found. If
 *    not defined, the stream will continue without error when no SwitchCase
 *    is found, just like a regular `switch` statement
 * 
 * @returns {object} the stream created
 */
function switchBy( predicate, switchCases, defaultCase ){

}

module.exports = switchBy;

/**
 * The input expected by the SwitchStream
 * @typedef {any} SwitchStreamInput
 */

/**
 * @callback SwitchPredicate
 * @param {SwitchStreamInput} input
 *    the value the predicate is evaluated against
 * @param {SwitchPredicateCallback } next
 *    callback for the result of the predicate evaluation
 * @returns {void}
 */

/**
 * Standard NodeJs callback
 * @callback SwitchPredicateCallback 
 * 
 * @param {object} err
 *    set if an error occurred 
 * @param {any} result
 *    set to the result of the predicate function if no error occurred 
 * @returns {void}
 * 
 */

/**
 * Key/Function|Functions[] pair describing switch cases for the stream
 * @typedef SwitchCase
 * @property {any} if
 *    the key to evaluate the SwitchCase by - if the key matches the result
 *    of the predicate provided, then the associated onKeyMatch function(s) will be
 *    Note that keys and predicate results are compared using deep comparison,
 *    meaning that objects and arrays would be compared by their own properties,
 *    and primitive values will be compared by strict equality. 
 * @property {(SwitchCaseFunction|SwitchCaseFunction[])} then
 *    the function(s) to execute if the key is a match  
 */

/**
 * Standard NodeJs callback
 * @callback SwitchCaseFunction
 * 
 * @param {SwitchStreamInput} input
 *    the value the SwitchCaseCallback is executing with
 * @param {SwitchCaseFunctionCallback} next
 *    callback for the result of the execution of SwitchCaseFunction
 * @returns {void}
 */

/**
 * Standard NodeJs callback
 * @callback SwitchCaseFunctionCallback
 * @param {object} err
 *    set if an error occurred 
 * @param {any} result
 *    set to the result of the SwitchCaseFunction function if no error occurred 
 * @returns {void}
 */
