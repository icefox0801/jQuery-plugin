jquery-pagination
===
> *A jquery plugin to create pagination list.*
##Options
---
```page```: the page number of current page.

```total```: total page number.

```prev```: text in the link to the prev page.

```next```: text in the link to the next page.

```href```: define a expression with placeholder '{page}' to render a href with page number, define *{ href: 'linkTo/{page}' }* will render href *linkTo/1*, *linkTo/2* e.g.Default is '{page}'.

```length```: to define the length of both sides around the page number, if *{ length: 2}* is defined, a 5-element list will be rendered.Default value is 2.
##Usage
---
1. ```$('#pagination2').pagination({page: '1', total: '4', ajax: 'true'}, '#paginationList2');```

+ ```<ul class="pagination" data-role="pagination" data-page="1" data-total="4" data-ajax="true" data-target="#paginationList1"></ul>```


