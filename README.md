# Jquery.smartSticky
Free, easy to use, javascript library for toggling between relative and fixed position, because of limited support of sticky position even in newer browsers.

### Features
Jquery.smartSticky supports:
* Highly customizable visibility and placement of the element
* Toggling between top and bottom position
* Displaying of fixed element only inside of container area
* Implementation of own callbacks

### Installation and dependencies
SmartSticky is built on and works properly with [jQuery](http://jquery.com/).

#### 1. Include JS/CSS
Include the following code in the `<head>` tag of your HTML:

```html
<!-- include jQuery -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- include jquery.smartSticky css/js-->
<link rel="stylesheet" href="/dist/css/jquery.smartSticky.min.css">
<script type="text/javascript" src="/dist/js/jquery.smartSticky.min.js"></script>
```

#### 2. Usage

```javascript
$(element).smartSticky([options])
```

- **options** (optional)
  - Type: `Object`
  - Default options to be changed
  
  
#### 3. Initialization

Use the following code with default settings.

`null` properties are computed automatically.

```javascript
$(function() {
    $('#myElem').smartSticky({
	show: {
            delay: 50,
            original: {
                under: true,
                above: false
            },
            fixed: 'top',
            scrolling: {
                up: false,
                down: true
            }
        },
        container: null,
        css: {
            fixed: {
                width: null,
                left: null
            }
        }
    });
});
```


### Options

#### show.delay
- Type: `Number`
- Default: `50`

ScrollTop value that postpones showing of the fixed element and accelerates its hiding on return. Use `0` to deactivate.

#### show.original.above
- Type: `Boolean`
- Default: `false`

Determines if the element can be shown above its original position.

#### show.original.under
- Type: `Boolean`
- Default: `false`

Determines if the element can be shown under its original position.

#### show.fixed
- Type: `String`
- Default: `'top'`

Determines placement of the fixed element.

Possible values are `'top'`, `'bottom'` and `'toggle'`.

`'toggle'` places fixed element top while scrolling down and bottom while scrolling up. If used, options `show.scrolling.up` and `show.scrolling.down` must be set to `true`, eventually, callback `show.scrolling` must return `true` for properly behaviour.

#### show.fixed (elementManager, scrollingDown)
- Returns: `String`

One of the accepted values of `show.fixed` option property.

This callback is fired at initialization, when activated and on window scroll and resize separately for each fixed element.

```javascript
show: {
    fixed: function () {
         if ($(window).width() < 768) {
	      /* on mobile phones */
              return 'bottom';
         }
	 return 'toggle';
    }
}
```

#### show.scrolling.up
- Type: `Boolean`
- Default: `false`

Determines if the fixed element can be shown while scrolling up. 

If `show.fixed` is set to `'toggle'`, this option must be set to `true` for properly behaviour.

#### show.scrolling.down
- Type: `Boolean`
- Default: `true`

Determines if the fixed element can be shown while scrolling down. 

If `show.fixed` is set to `'toggle'`, this option must be set to `true` for properly behaviour.

#### show.scrolling (elementManager, scrollingDown)
- Returns: `Boolean`

Determines visibility of the fixed element while scrolling.

Use `true` to show and `false` to hide.

This callback is fired at initialization, when activated and on window scroll and resize separately for each fixed element.

If `show.fixed` is set to `'toggle'`, this callback must return `true` for properly behaviour.

```javascript
show: {
    scrolling: function (elementManager, scrollingDown) {    	
        if ($(window).width() < 768) {
	    /* on mobile phones */
            return !scrollingBottom;
        }
        return scrollingBottom;
    }
}
```

#### container
- Type: `HTMLelement`, `JQuery` or `String`
- Default: `null`

The fixed element can be displayed only inside of container area.

By default, the element's original parent is used.

Use `String` to find element by selector.

If more elements are included in `JQuery` collection or if they are found by `String` selector, first element is used.

If no element is included in `JQuery` collection or found by `String` selector, default container is used.

#### container (elementManager)
- Returns: `HTMLelement`, `JQuery` or `String`

This callback is fired at initialization, when deactivated and on window resize separately for each relative element.

```javascript
container: function (elementManager) {
    /*
    	<div class="row">
    	    <div class="col-3">
    	         <div class="sticky-smart"></div>
	    </div>
    	    <div class="col-9">
		
	    </div>
    	</div>
    */

    return elementManager.getElement().closest('.row');
}
```

#### css.fixed.left
- Type: `Number` or `String`
- Default: `null`

By default, the element's offset left in original position is used.

Sets css left property of the fixed element.

#### css.fixed.width
- Type: `Number` or `String`
- Default: `null`

By default, the element's outer width in original position is used.

Sets css width property of the fixed element.

#### css.fixed.left (elementManager, scrollingDown) and css.fixed.width (elementManager, scrollingDown)
- Return `Number` or `String`

Set css left and width property of the fixed element.

These callbacks are fired at initialization, when activated and on window resize separately for each fixed element.

```javascript
css: {
    fixed: {
    	left: function (elementManager, scrollingDown) {    	
    	    if ($(window).width() < 768) {
		/* on mobile phones */
    	        return 0;
    	    }
    	    return elementManager.getElement().offset().left;
    	},
	width: function (elementManager, scrollingDown) {    	
    	    if ($(window).width() < 768) {
		/* on mobile phones */
    	        return '100%';
    	    }
    	    return elementManager.getElement().outerWidth();
    	}
    }
}
```

### Defaults
If you want to change default settings, use the following code:
```javascript
$.extend( true, $.fn.smartSticky.defaults, {
    show: {
    	delay: 0
    }
} );
```

### Methods

Use only after **initialization**.

```javascript
$('.myElems').smartSticky('methodName', argument1, argument2, ...);

/* or */

$('.myElems').each(function () {
    $(this).smartSticky('instance').methodName(argument1, argument2, ...);
});

```


#### setOptions (options)
Updates dynamically options.

```javascript
$('#myElem').smartSticky('setOptions', {
    show: {
    	scrolling: {
	    up: true
	}
    }
});
```

#### enable ()
Enables component.

#### disable ()
Disables component.

#### hide ()
Hides fixed element.

### Events

Use the following code to set callback on event.

```javascript
$('#myElem').smartSticky().on('smartSticky.eventName', function (e, elementManager) {
	
});
```

#### activate
Fires when element becames fixed.

```javascript
$('#myElem').smartSticky().on('smartSticky.activate', function (e, elementManager) {
	$(this).css('border', '1px solid black');
});
```

#### deactivate
Fires when element becames relative.

### License
jquery.smartSticky may be freely distributed under the MIT license.
