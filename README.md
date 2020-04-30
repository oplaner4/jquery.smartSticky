# Jquery.smartSticky
Free, easy to use, javascript library for toggling between relative and fixed position, because support of sticky position is, even in newer browsers, still limited.

### Features
Jquery.smartSticky supports these features:
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
<link rel="stylesheet" href="/dist/jquery.smartSticky.min.css">
<script type="text/javascript" src="/dist/jquery.smartSticky.min.js"></script>
```

#### 2. Usage

```javascript
$(element).smartSticky([options])
```

- **options** (optional)
  - Type: `Object`

#### 3. Initialization

Use the following code with default settings.
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
        container: false,
        css: {
            fixed: {
                width: false,
                left: false
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

Possible values: `'top'`, `'bottom'` and `'toggle'`

If `'toggle'` is used and `show.scrolling` is not `Function`, option `show.scrolling.up` and `show.scrolling.down` must be set to `true` for properly behaviour.

#### show.fixed (elementManager, scrollingDown)
- Returns: `String`

One of the accepted values of `show.fixed` option property.

This function is called always on window scroll and window resize for each element..

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

Determines if the element is shown when scrolling up. 

If `show.fixed` is set to `'toggle'`, this option must be set to `true` for properly behaviour.

#### show.scrolling.down
- Type: `Boolean`
- Default: `true`

Determines if the element is shown when scrolling down. 

If `show.fixed` is set to `'toggle'`, this option must be set to `true` for properly behaviour.

#### show.scrolling (elementManager, scrollingDown)
- Returns: `Boolean`

Determines visibility of the element when scrolling.

Use `true` to show element and `false` to hide.

This function is called always on window scroll and window resize for each element.

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

By default, the element's parent is used.

The fixed element can be displayed only inside of container area.

Use `String` to find element by selector.

#### container (elementManager)
- Returns: `HTMLelement` or `jQuery`

This function is called always on window resize for each element.

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

These functions are called always on window resize for each element.

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

### Methods

Use only after initialization.

```javascript
$('#myElem').smartSticky('methodName', argument1, argument2, ....);



```


### License
jquery.smartSticky may be freely distributed under the MIT license.
