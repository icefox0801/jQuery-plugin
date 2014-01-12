jquery-chkMerge
===
> *Merge the value of a group of checkboxes into an input element.*
##Options
---
```split```: The seperator, default is ','.

```valuetag```: The tag to get the '@' value, default is 'checkbox' value in attribute 'id', and 'label' is also a choice.

```ref```: To input **checked** value or **uncheck** value.

```event```: The event in which the value of checkbox group could be merged.

```trigger```: The element to trigger the ```event```. If define a **submit** event and not define ```trigger```, the closest form elemet will be the trigger.

```callback```: Callback function when event is triggered.
##Usages
---
1. ```$('#cbMergeChecked1').chkMerge('.chkMergeGroup');```

	```$('#cbMergeUnchecked1').chkMerge('.chkMergeGroup', false);```

2. ```<input name="checked" data-role="chkMerge" data-group=".chkMergeGroup2" data-ref="checked"/>```

	```<input name="unchecked" data-role="chkMerge" data-group=".chkMergeGroup2" data-ref="unchecked"/>```

3. ```<input name="merged" data-role="chkMerge" data-group=".chkMergeInputGroup" data-valuetag="text">```