jquery-chkMerge
===============

Merge the value of a checkbox group to an inputor.

##dependencies##
jQuery.js
``<input name="checked" />``and ``<input type="checkbox" />`` is required for using this plugin.
##usage##
###mackup###
```html
<form id="form">
    <div id="group">
        <label for="cb1"><input type="checkbox" id="cb1" />Option One</label>
        <label for="cb2"><input type="checkbox" id="cb2" />Option Two</label>
        <label for="cb3"><input type="checkbox" id="cb3" />Option Three</label>
        <label for="cb4"><input type="checkbox" id="cb4" />Option Four</label>
    </div>
    <input name="checked" id="checked" />
    <input name="unchecked" id="unchecked" />
    <button>Submit</button>
</form>
```
###via javascript###
```javascript
$('#checked').chkMerge('#group');
```
###via data attributes###
```html
<input name="checked" data-role="chkMerge" data-group="#group" data-ref="checked"/>
```
or
```html
<input name="unchecked" data-role="chkMerge" data-group="#group" data-ref="unchecked"/>
```
##Options##
```split```: The split symbol, default is ','.

```valuetag```: The tag to get the '@' value, default is 'checkbox' value in attribute 'id', and 'label' is also a choice.

```ref```: To input **checked** value or **uncheck** value.

```event```: The event in which the value of checkbox group could be merged. 

```trigger```: The element to trigger the ```event```. If define a **submit** event and not define ```trigger```, the closest form elemet will be the trigger.

```callback```: Callback function when event is triggered.
