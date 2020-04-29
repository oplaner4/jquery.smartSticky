# Jquery.smartSticky
Free, easy to use, javascript library for toggling between relative and fixed position.

### Features
Jquery.smartSticky has these features:
* Customizable visibility
* Toggling between top and bottom position
* Allowed only in parent element or set container

### Installation and dependencies
SmartSticky is built on [jQuery](http://jquery.com/).


#### 1. Include JS/CSS

Include the following code in the `<head>` tag of your HTML:

```html
<!-- include jQuery -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- include jquery.smartSticky css/js-->
<link rel="stylesheet" href="/dist/jquery.smartSticky.min.css">
<script type="text/javascript" src="/dist/jquery.smartSticky.min.js"></script>
```

#### 2. Initialization

```javascript
$(function() {
    $('#myElem').smartSticky(
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
                classes: {
                    root: 'sticky-smart',
                    placeholder: 'sticky-smart-placeholder',
                    invisible: 'sticky-smart-invisible',
                    active: 'sticky-smart-active',
                    bottom: 'sticky-smart-bottom',
                    top: 'sticky-smart-top',
                    background: 'sticky-smart-background'
                },
                fixed: {
                    width: false,
                    left: false
                }
            }
        });
});
```

### License
jquery.smartSticky may be freely distributed under the MIT license.
