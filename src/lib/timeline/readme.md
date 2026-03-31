## Граф зависимостей

```
components/ -> controllers/ -> context/ -> logic/
                                  ↓           ↓
                                state/    (pure fns)
```

Зависимости идут строго в одном из направлений:

| Папка        | Может импортировать из |
| ------------ | ---------------------- |
| state/       | ничего (из timeline)   |
| logic/       | state/ (только типы)   |
| context/     | state/, logic/         |
| controllers/ | context/               |
| components/  | /, controllers/        |
