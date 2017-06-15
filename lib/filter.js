const assert
  = require( 'assert' );

const isFunction
  = require( 'lodash/isFunction' );

/**
 * Emits only those inputs that match the given predicate
 * 
 * @param {PredicateFunction} predicate
 *  Async function to filter out piped in data
 * 
 * @returns {object}
 *  returns a Transform stream that applies the provided predicate
 * 
 * @callback PredicateFunction
 * @param {any} item
 *  input parameter for the items to filter out
 * @param {PredicateResultCallback} next
 *  NodeJs callback
 * @returns {void}
 * 
 * @callback PredicateResultCallback
 * @param {any} err
 *  set if an error occurred
 * 
 * @param {any} result
 *  truthy if the item should be emitted, falsey otherwise   
 * 
 * @returns {void}
 */
function createFilterStream( predicate ){

  assert( isFunction( predicate ), 'Predicate must be a function' );

  function transform( item, _, next ){

    predicate( item, ( err, result )=>{

      if( err ) return next( err );
      if( result ) this.push( item );
      next();
      
    } );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createFilterStream;
