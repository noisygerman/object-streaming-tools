describe( 'ForInStream instances', ()=>{
  
  const createForInStream
    = require( process.cl_test_util.generateUITPath( __filename ) );

  const isEqual
    = require( 'lodash/isEqual' );

  it( 'should emit properties of an object received', ( done )=>{

    const key1
      = 'key1';
    const value1
      = 'value1';
    const key2
      = 'key2';
    const value2
      = 'value2';

    const input = {
      [ key1 ]: value1,
      [ key2 ]: value2
    };
    
    const expected = [
      { key: key1, value: value1 },
      { key: key2, value: value2 }
    ];

    const output
      = [];

    const forIn = createForInStream()
      .on( 'data', ( property )=>output.push( property ) )
      .on( 'end', ()=>{

        expect( isEqual( output, expected ) )
          .toBe( true );

        done();

      } );

    forIn.write( input );
    forIn.end();

  } );

  it( 'should emit properties of multiple objects received', ( done )=>{

    const key
      = 'key';
    const value
      = 'value';
    
    const anotherKey
      = 'anotherKey';

    const inputs = [
      { [ key ]: value, [ anotherKey ]: value },
      { [ key ]: value }
    ];
    
    const expected = [
      { key, value },
      { key: anotherKey, value },
      { key, value }
    ];

    const output
      = [];

    const forIn = createForInStream()
      .on( 'data', ( property )=>output.push( property ) )
      .on( 'end', ()=>{

        expect( isEqual( output, expected ) )
          .toBe( true );

        done();

      } );

    inputs.forEach( forIn.write, forIn );
    forIn.end();

  } );

  it( 'should take toJSON functions into account', ( done )=>{

    const key
      = 'key';
    const value
      = 'value';
    
    const rawInput
      = { [ key ]: value };

    const inputWithToJson = {
      _data: rawInput,
      toJSON(){ return rawInput; } // eslint-disable-line padded-blocks
    };

    const inputs = [
      inputWithToJson,
      rawInput
    ];
    
    const expected = [
      { key, value },
      { key, value }
    ];

    const output
      = [];

    const forIn = createForInStream()
      .on( 'data', ( property )=>output.push( property ) )
      .on( 'end', ()=>{

        expect( output )
          .toEqual( expected );

        done();

      } );

    inputs.forEach( forIn.write, forIn );
    forIn.end();

  } );

  it( 'should iterate over inherited properties', ( done )=>{

    const key
      = 'key';
    const value
      = 'value';
    
    const superObj
      = { [ key ]: value };

    const inputWithIneritedProperties
      = Object.create( superObj ); 

    const inputs = [
      inputWithIneritedProperties,
      superObj
    ];
    
    const expected = [
      { key, value },
      { key, value }
    ];

    const output
      = [];

    const forIn = createForInStream()
      .on( 'data', ( property )=>output.push( property ) )
      .on( 'end', ()=>{

        expect( output )
          .toEqual( expected );

        done();

      } );

    inputs.forEach( forIn.write, forIn );
    forIn.end();

  } );
  
} );
