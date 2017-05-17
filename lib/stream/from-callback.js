const States = [
  'isReading',
  'hasRead'
].reduce( ( states, stateKey, i )=>Object.assign( states, { [ stateKey ]: i } ), {} );

/**
 * Invokes a given function, emitting the result in a stream.
 *
 * Note that the function will be executed once only.
 *
 * @param {function} func
 *  A function taking a standard callback function as its only argument
 *
 * @returns {object}
 *  The readable stream
 */
function createCallbackResultStream( func ){

  let state
    = null;

  function read(){

    switch( state ){
      
      case States.isReading: 
        return;

      case States.hasRead:
        this.push( null );
        break;
        
      default:
        state = States.isReading;
        return func( ( err, result )=>{
          
          process.nextTick( ()=>{
          
            if( err ) return this.emit( 'error', err );
            state = States.hasRead;
            this.push( result );
          
          } );

        } );
    
    }


  }

  return require( 'stream' ).Readable( {
    objectMode: true,
    read
  } );

}

module.exports = createCallbackResultStream;
