/**
 * Creates a write stream that will write all input piped in to an array,
 * after 'finish', will emit a 'data' event containing the collected data
 *
 * @returns {object}
 *  The stream created
 */
function createWriteToArrayStream(){

  let arr
    = [];

  function write( item, _, next ){

    arr.push( item );
    next();

  }

  function onFinished(){

    const result = arr; // eslint-disable-line newline-after-var
    arr          = null;

    this.emit( 'data', result );
    this.emit( 'end' );

  }

  return require( 'stream' ).Writable( {
    objectMode: true,
    write
  } ).on( 'finish', onFinished );

}

module.exports = createWriteToArrayStream;
