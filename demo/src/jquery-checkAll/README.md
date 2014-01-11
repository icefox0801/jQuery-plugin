jquery-checkAll
===============

To check or uncheck all the related checkbox with a checkbox or button

##usage##
###mackup###
Include jquery.js and jquery.checkAll.js in the html ``<head>`` tag
```html
<script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/jquery.checkAll.js"></script>
```
HTML for this plugin in ``body`` tag:
```html
<label for="checkAll1"><input type="checkbox" id="checkAll" />全选</label>
<div id="group">
	<label for="cb1"><input id="cb1" type="checkbox" />option 1</label>
	<label for="cb2"><input id="cb2" type="checkbox" />option 2</label>
	<label for="cb3"><input id="cb3" type="checkbox" />option 3</label>
	<label for="cb4"><input id="cb4" type="checkbox" />option 4</label>
</div>
```
###via javascript###
```javascript
$('.checkbox').checkAll('#group');
```
###via data attributes###
```html
<input type="checkbox" data-role="checkAll"  data-group="#group">
```
