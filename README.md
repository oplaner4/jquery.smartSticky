### jquery.smartSticky Initialization

```javascript
$(function() {
	  $('#myElem').smartSticky({
			{
			    show: {
			        position: 'top',
			        origPosition: {
			            under: true,
			            above: false
			        },
			        scrolling: {
			            delay: 50,
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
			}
	  });
});
```

### License
jquery.smartSticky may be freely distributed under the MIT license.
