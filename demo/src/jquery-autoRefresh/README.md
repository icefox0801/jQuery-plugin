jquery_autoRefresh_js
=====================

A jquery plugin to refresh a page at intervals synchronously or asynchronously.

##dependencies##
jQuery.js
##usage##
###via data attributes###
```html
<div data-role="autoRefresh" data-url="http://" data-target="#faq-list">
  <div class="span">
    <label class="control-label ">Refresh Switchor
      <input class="checkbox a-sw" type="checkbox" />
    </label>
  </div>
  <div class="span">
    <label class="control-label">Refresh Interval
      <select class="span a-intvl">
        <option value="30">30s</option>
        <option value="60">1min</option>
        <option value="180">3min</option>
        <option value="300">5min</option>
        <option value="600">10min</option>
      </select>
    </label>
  </div>
</div>
<ul id="faq-list">
  ...
</ul>
```
the ```<select>``` tag is not a must.
###via javascript###
```javascript
$('.autoRefresh').autoRefresh('#faq-list', {})
```
##Options##

```switchor```: The element open and close autoRefresh. **Default** is **'.a-sw'**.

```interval```: The element set the interval of refresh. **Default** is **'.a-intvl'**, not must be defined.

```countDown```: Enable showing the counting down text.

```url```: The url to retrieve data from.

```load```: Boolean type, if set to be **true**, will load data without reload the whole page, if **false**, reload the whold page.

```easyloadapi```: The element to support **jquery-easyLoad**(One of my another plugin) api for refresh.

```selector```: Define a element from where we will get useful data to send to the server.

```autoRefresh```: Boolean type to enable autoRefresh function or not.

```scrollLoad```: Boolean type to enable scrollLoad function or not.
