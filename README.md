# Jquery.smartSticky
Free, easy to use, javascript library for toggling between relative and fixed position, because of limited support of sticky position even in newer browsers.

Current stable version: **2.4.0**

### Features
Jquery.smartSticky supports:
* Highly customizable visibility and placement of the element
* Toggling between top and bottom position
* Displaying of fixed element only inside of container area
* Implementation of own callbacks and positions
* Inner overflowing containers

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
$('#myElem').smartSticky([options])
```

- **options** (optional)
  - Type: `Object`
  - Default options to be changed, see the list of available options below.
  
  
#### 3. Initialization

You can use the following code with default options.

`null` properties are computed automatically by library.

```javascript
$(function() {
    $('#myElem').smartSticky({
        show: {
            delay: 50,
	    immediately: false,
            original: {
                under: true,
                above: false
            },
            fixed: 'top',
            scrolling: {
                up: true,
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

#### show.immediately
- Type: `Boolean`
- Default: `false`

Determines if the element becomes fixed immediately when its original position is reached. If set to `'true'` option `'show.delay'` is ignored.

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

Possible predefined values are `'top'`, `'bottom'` and `'toggle'`.

`'toggle'` places fixed element top while scrolling down and bottom while scrolling up. If used, options `show.scrolling.up` and `show.scrolling.down` should be set to `true`, eventually, callback `show.scrolling` should return `true` for properly behaviour.

If you want to define your own placement position callback, extend default positions object like with the following code:

```javascript
$.fn.smartSticky.positions['myAwesomePosition1'] = function (positionManager) {
    if (positionManager.getScrollingManager().scrollingDown()) {
    	 return { top: 10 };
    }
    return { bottom: 10 };
};

$.fn.smartSticky.positions['myAwesomePosition2'] = function (positionManager) {
	if (positionManager.getSettingsManager().isContainerOverflowing()) {
	     return { top: 0 };
	}
	
	return 'toggle';
};

```
This callback can be used in two different ways: 
- return `Object` with `'top'` or `'bottom'` property which is applied as css together with fixed position.
- return `String` with name of other defined position to apply.



#### show.fixed (settingsManager, scrollingManager)
- Returns: `String`

One of the accepted values of `show.fixed` option property.

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
- Default: `true`

Determines if the fixed element can be shown while scrolling up. 

If `show.fixed` is set to `'toggle'`, this option should be set to `true` for properly behaviour.

#### show.scrolling.down
- Type: `Boolean`
- Default: `true`

Determines if the fixed element can be shown while scrolling down. 

If `show.fixed` is set to `'toggle'`, this option should be set to `true` for properly behaviour.

#### show.scrolling (settingsManager, scrollingManager)
- Returns: `Boolean`

Determines visibility of the fixed element while scrolling.

Use `true` to show and `false` to hide.

If `show.fixed` is set to `'toggle'`, this callback should return `true` for properly behaviour.

```javascript
show: {
    scrolling: function (settingsManager, scrollingManager) {
        if ($(window).width() < 768) {
	    /* on mobile phones */
            return !scrollingManager.scrollingDown();
        }
        return scrollingManager.scrollingDown();
    }
}
```

#### container
- Type: `HTMLelement`, `HTMLCollection`, `JQuery` or `String`
- Default: `null`

The fixed element can be displayed only inside of container area.

By default, the element's original parent is used.

Use `String` to find element by selector.

If more elements are included in `JQuery` collection or if they are found by `String` selector, first element is used.

If no element is included in `JQuery` collection or found by `String` selector, default container is used.

When container is overflowing, this element is used for scrolling instead of window whose scrolling is ignored.

#### container (settingsManager)
- Returns: `HTMLelement`, `HTMLCollection`, `JQuery` or `String`

```javascript
container: function (settingsManager) {
    /*
    	<div class="row">
    	    <div class="col-3">
    	         <div class="sticky-smart"></div>
			</div>
    	    <div class="col-9">
		
			</div>
    	</div>
    */

    return settingsManager.getElement().closest('.row');
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

#### css.fixed.left (settingsManager) and css.fixed.width (settingsManager)
- Return `Number` or `String`

Set css left and width property of the fixed element.

If you want to change top or bottom property of the fixed element, define your own placement position callback as described above.

```javascript
css: {
    fixed: {
    	left: function (settingsManager) {
    	    if ($(window).width() < 768) {
				/* on mobile phones */
    	        return 0;
    	    }
    	    return settingsManager.getElement().offset().left;
    	},
	width: function (settingsManager) {
    	    if ($(window).width() < 768) {
				/* on mobile phones */
    	        return '100%';
    	    }
    	    return settingsManager.getElement().outerWidth();
    	}
    }
}
```

### Options callbacks arguments

smartSticky library works with the following managers which are provided in callbacks as arguments. You can access their methods (getters and boolean queries) to find out useful information.

**Attention:** Using of other manager's methods then listed below (etc. private setters), or modifying its private underline properties can cause unexpectable behaviour.

#### settingsManager
- Type: `Object`
- Methods: `getElement()`, `getContainer()`, `getOptions()` and `isContainerOverflowing()`


#### scrollingManager
- Type: `Object`
- Methods: `scrollingDown()` and `getCurrentScrollTop()`


#### positionManager
- Type: `Object`
- Methods: `getSettingsManager()`, `getScrollingManager()`, `getFixedPosition()` and `getYCoordManager()`


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
Hides fixed element until it is about to be shown again.

### Events

Use the following code to set callback on event.

```javascript
$('#myElem').smartSticky().on('smartSticky.eventName', function (e, settingsManager) {
	
});
```

#### activate
Fires when element becames fixed.

```javascript
$('#myElem').smartSticky().on('smartSticky.activate', function (e, settingsManager) {
	$(this).css('border', '1px solid black');
});
```

#### deactivate
Fires when element becames relative.

### License
jquery.smartSticky may be freely distributed under the MIT license.
