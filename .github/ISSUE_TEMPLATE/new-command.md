---
name: New Command
about: Suggest an idea for a new command
title: "[New Command]:  <Name>"
labels: command
assignees: ''

---

### New command's description/purpose
Tracks the counts of things, allowing increment and decrement of the current count

### New command's options
`/counter create <name> <description> <initVal>`
- `<name>` - description: the name of the counter
  - type: string
  - required? true
- `<description>` - a description for the counter
  - type: string
  - required? true
- `<initVal>` - the value to initialize the counter to 
  - type: integer
  - required? false: default=0

`/counter increment <name> <val>`
...

### Anything else?
