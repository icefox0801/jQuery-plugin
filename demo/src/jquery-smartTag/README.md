jquery-smartTag
===
> *A jquery plugin for adding and remove tags, or simple DOM manipulation.*
##Options:
---
```total```: total page number.

```tagsOption```: Default is ".smartTag", the selector of tags.

```type``` : Request method, default is "POST".

```remove``` : Request URL for removing tags.

```add``` : Request URL for adding tags.
##Usage:
---
1. ```<div data-role="smartTag" data-target="#smartTagGroup1" data-add="/addTag" data-remove="/removeTag"></div>```

+ ```$('#smartTagDiv').smartTag('#smartTagGroup2', {target: "#smartTagGroup2",add: "/addTag",remove: "/removeTag"});```