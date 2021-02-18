let queryUpdater = () => {};

export function setUpdater(func) {
  queryUpdater = func;
}

export function updateQuery(query) {
  if (queryUpdater && query && Object.keys(query).length) {
    queryUpdater(query);
  }
}

export function mapQueryToProps(map, query) {
  const props = {};
  for (const queryKey of Object.keys(query)) {
    for (const propKey of Object.keys(map)) {
      if (map[propKey].key === queryKey) {
        let newValue = null;
        if (map[propKey].values) {
          newValue = Object.keys(map[propKey].values).find(
            valueKey => (map[propKey].values[valueKey] === query[queryKey])
          );
        } else {
          newValue = query[queryKey];
        }
        switch (map[propKey].type) {
          case Number:
            newValue = parseInt(newValue, 10);
            break;
          case Boolean:
            newValue = (newValue || 1).toString() === '1';
            break;
          case Array:
            newValue = (newValue || '').split(',');
            break;
        }
        props[propKey] = newValue;
      }
    }
  }
  return props;
}

export function mapPropsToQuery(queryProps, props) {
  const qs = {};
  for (const name of Object.keys(props)) {
    if (name in queryProps) {
      if (queryProps[name].type === Boolean) {
        qs[queryProps[name].key] = props[name] ? '1' : '0';
      } else if (queryProps[name].type === Array) {
        qs[queryProps[name].key] = props[name].join(',');
      } else {
        qs[queryProps[name].key] = (
          queryProps[name].values ? queryProps[name].values[props[name]] : props[name]
        );
      }
    }
  }
  updateQuery(qs);
}
