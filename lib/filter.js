const assert
  = require( 'assert' );

const isFunction
  = require( 'lodash/isFunction' );

const RejectedEventKey = 'rejected';

/**
 * Emits only those inputs that match the given predicate via the 'data' event
 * and through the pipe. Rejected items are emitted via the 'rejected' event.
 * 
 * @param {PredicateFunction} predicate
 *  Async function to filter out piped in data
 * 
 * @constant {String} RejectedEventKey
 *  The key of the event emitted when items are rejected.
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
 *  truthy if the item should be emitted, falsy otherwise   
 * 
 * @returns {void}
 */
function createFilterStream( predicate ){

  assert( isFunction( predicate ), 'Predicate must be a function' );

  function transform( item, _, next ){

    predicate( item, ( err, result )=>{

      if( err ) return next( err );
      
      const emit = result
        ? this.push.bind( this )
        : this.emit.bind( this, RejectedEventKey );

      emit( item );
      next();
      
    } );

  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports
  = createFilterStream;
module.exports.RejectedEventKey
  = RejectedEventKey;

