# WGSA Middle End

## Entities

```
                1 +------------+
      +-----------|    User    |----------+
      | n         +------------+ 1        | n
 +----------+                       +------------+
 |  Genome  |                       | Collection |
 +----------+                       +------------+
    1 |                                 1 |
      | 1                                 | 1
+-------------+                   1 +------------+
| Genome File |---------------------|   Genome*  |
+-------------+ 1                   +------------+

*Collection Genome - copy of user genome record
```
