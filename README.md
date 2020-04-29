# Jquery.smartSticky
Free, easy to use, javascript library for toggling between relative and sticky position, whose support is, even in newer browsers, still limited.

### Supports
Jquery.smartSticky has these features:
* Showing on scroll direction

### Installation and dependencies
SmartSticky is built on [jQuery](http://jquery.com/).


#### 1. Include JS/CSS

Include the following code in the `<head>` tag of your HTML:

```html
<!-- include jQuery -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- include jquery.smartSticky css/js-->
<link rel="stylesheet" href="/dist/jquery.smartSticky.min.css">
<script type="javascript/js" src="/dist/jquery.smartSticky.min.js"></script>
```

#### 2. Initialization

```javascript
$(function() {
    $('#myElem').smartSticky({
	    show: {
                position: {
                    original: {
                        under: true,
                        above: false
                    },
                    sticky: 'top'
                },
                scrolling: {
                    sticky: {
                        delay: 50
                    },
                    up: false,
                    down: true
                } 
            },
            container: false,
            css: {
                classes: {
                    root: 'sticky-smart',
                    placeholder: 'sticky-smart-placeholder',
                    invisible: 'sticky-smart-invisible',
                    active: 'sticky-smart-active',
                    bottom: 'sticky-smart-bottom',
                    top: 'sticky-smart-top'
                },
                sticky: {
                    width: false,
                    left: false
                }
	    }
      });
});
```

### License
jquery.smartSticky may be freely distributed under the MIT license.
