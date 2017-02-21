# WGSA Middle End

## Entities

```
               1 +------------+
      +----------|    User    |----------+
      | N        +------------+ 1        | N
 +----------+                      +------------+   1 +-----------+
 |  Genome  |                      | Collection |-----|  Species  |
 +----------+                      +------------+ N   +-----------+
    N |                                1 |
      | 1                                | N
+-------------+                +-------------------+
| Genome File |                | Collection Genome |
+-------------+                +-------------------+
```
