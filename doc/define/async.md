@property can-define-object/define/async async
@parent can-define-object/object.behaviors

@description async

Specifies an *asynchronous* property whose value will be resolved later. `async`
properties are computed and automatically update themselves when a dependent
observable value is changed.

@signature `async( resolve(value), lastSetValue )`

Asynchronously defines the behavior when a value is read on an instance.

Only observed properties (via [can-event-queue/map/map.on], [can-event-queue/map/map.addEventListener], etc) will be passed the `resolve` function.  It will be `undefined` if the value is not observed. This is for memory safety.

Specify `async` like:

```js
define = {
	propertyName: {
		async( resolve, lastSetValue ) { /* ... */ }
	}
}
```

  @param {function|undefined} resolve(value) Updates the value of the property. This can be called
  multiple times if needed. Will be `undefined` if the value is not observed.

  @param {*} lastSetValue The value last set by `instance.propertyName = value`.

  @return {*} The value of the property before `resolve` is called.  Or a value for unobserved property reads
  to return.

@body

## Use

Async methods are useful for:

- Virtual properties that derive their value from an asynchronous action.
- Defining properties that store a value from another property that is a Promise.

## Asynchronous virtual properties

Often, a virtual property's value only becomes available after some period of time.  For example,
given a `personId`, one might want to retrieve a related person:

```js
import { DefineObject } from "can";

class AppState extends DefineObject {
  static define = {
    personId: Number,
    person: {
      async( resolve, lastSetValue ) {
        Person.get( { id: this.personId } )
          .then( function( person ) {
            resolve( person );
          } );
      }
    }
  };
}
```

Asynchronous properties should be bound to before reading their value.  If
they are not bound to, the `async` function will be called each time.

The following example will make multiple `Person.get` requests:

```js
const state = new AppState( { personId: 5 } );
state.person; //-> undefined

// called sometime later /* ... */
state.person; //-> undefined
```

However, by binding, the compute only reruns the `async` function once `personId` changes:

```js
const state = new AppState( { personId: 5 } );

state.on( "person", function() {} );

state.person; //-> undefined

// called sometime later
state.person; //-> Person<{id: 5}>
```

A template like [can-stache] will automatically bind for you, so you can pass
`state` to the template like the following without binding:

```js
const template = stache( "<span>{{person.fullName}}</span>" );
const state = new AppState( {} );
const frag = template( state );

state.personId = 5;
frag.childNodes[ 0 ].innerHTML; //=> ""

// sometime later
frag.childNodes[ 0 ].innerHTML; //=> "Lincoln Meyer"
```

The magic tags are updated as `personId`, `person`, and `fullName` change.