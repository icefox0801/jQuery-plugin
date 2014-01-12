jquery-easyForm
===
A light weight plugin to change the way the form is submitted.
##Options##
---
```event```: The event to trigger submitting the form.

```ajax```: Ajax submitting, default is **false**.

```method```: The method that form is submitted.

```disabled```: The element(s) to be disabled when the form is submitted. The *name* attribute is accepted, to disable multiple elements, just type in **data-disabled="name1 name2 name3"** e.g.
##usage##
---
1. ```$('#easyFormBtn').easyForm({action: 'link/to/first', method: 'POST', disabled: 'name', ajax: true});```

+ ```<button data-role="easyForm" data-action="link/to/second" data-disabled="age" data-method="GET">Submit</button>```