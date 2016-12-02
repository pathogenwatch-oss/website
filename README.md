# WGSA Middle End

## Entities

```
                1 +------------+
      +-----------|    User    |-----------+
      | n         +------------+ 1         | n
+------------+                       +------------+
|  Assembly  |                       | Collection |
+------------+                       +------------+
    1 |                                   1 |
      | 1                                   | 1
+------------+                     1 +------------+
| Fasta File |-----------------------|  Assembly* |
+------------+ 1                     +------------+

*Collection Assembly - copy of user assembly record
```
