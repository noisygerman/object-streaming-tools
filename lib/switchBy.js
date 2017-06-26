const just
  = require( './just' );

const apply
  = require( './apply' );

const findIndex
  = require( './findIndex' );

const flatten
  = require( './flatten' );

const toArray
  = require( './toArray' );

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

  function transform( input, _, next ){

    just( input )
      .on( 'error', next )
      .pipe( apply( predicate ) )
      .on( 'error', next )
      .pipe( findIndex( switchCases, compare ) )
      .on( 'error', next )
      .pipe( apply( getExecutionContext( switchCases, defaultCase ) ) )
      .on( 'error', next )
      .pipe( flatten() )
      .on( 'error', next )
      .pipe( apply( ( execute, next )=>execute( input, next ) ) )
      .on( 'error', next )
      .pipe( toArray() )
      .on( 'data', ( res )=>( res.length === 1 ? this.push( res[0] ) : this.push( res ) ) )
      .on( 'end', next );

  }
  
  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = switchBy;

/* internal functions */

const isEqual
  = require( 'lodash/isEqual' );

function compare( predicateResult, candidate, next ){

  next( null, isEqual( predicateResult, candidate.ifMatches ) );

}

function getExecutionContext( switchCases, defaultCase ){

  function getExecutionContext( index, next ){

    const execute = index < 0
      ? defaultCase || noop
      : switchCases[ index ].thenDo;

    next( null, execute );

  }

  return getExecutionContext;
  
}

function noop( _, next ){

  next();

}

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
 * @property {any} ifMatches
 *    the key to evaluate the SwitchCase by - if the key matches the result
 *    of the predicate provided, then the associated onKeyMatch function(s) will be
 *    Note that keys and predicate results are compared using deep comparison,
 *    meaning that objects and arrays would be compared by their own properties,
 *    and primitive values will be compared by strict equality. 
 * @property {(SwitchCaseFunction|SwitchCaseFunction[])} thenDo
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
