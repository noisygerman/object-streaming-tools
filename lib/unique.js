const DuplicateEventKey = 'rejected';

/**
 * Emits only unique inputs based on the given attributeName via the 'data' event
 * and through the pipe. Duplicated items are emitted via the 'duplicate' event.
 *
 * @constant {String} DuplicateEventKey
 *  The key of the event emitted when duplicate items are found.
 *
 * @returns {object}
 *  returns a Transform stream that emits only unique items
 *
 * @returns {void}
 */

function createUniqueStream(){

  const cache = [];

  function transform( item, _, next ){
    
    if( cache.includes( item ) ){

      this.emit( DuplicateEventKey, item );
    
    } else {

      cache.push( item );
      this.push( item );
    
    }
    next();
  
  }

  return require( 'stream' ).Transform( {
    objectMode: true,
    transform
  } );

}

module.exports = createUniqueStream;
module.exports.DuplicateEventKey = DuplicateEventKey;
