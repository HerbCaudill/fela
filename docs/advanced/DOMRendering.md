# DOM Rendering

Knowing all the basics, we are already able to build up our whole styling environment. But we still do not know how to actually render our styles into the DOM. Luckily this is really simple as all we have to do is call a single function.<br>
The `fela-dom` package is used for any DOM specific methods.
It provides a `render` function which takes the renderer as a parameter.

## Automatic Updates
Once rendered to the DOM, a change listener will subscribe to changes. The DOM nodes will automatically be updated on changes.

#### Development vs. Production
> These two modes exist as [Chrome Developer Tools does not support `CSSStyleSheet.insertRule`](https://bugs.chromium.org/p/chromium/issues/detail?id=387952).

**In production** it uses an optimized rendering mechanism based on [`CSSStyleSheet.insertRule`](https://developer.mozilla.org/en-US/docs/Web/api/CSSStyleSheet/insertRule) to update as performant as possible.

**In development** it uses `node.textContent` to update styles. This also implies that Fela is even faster in production, so be sure to use the production environment for production builds.

## Example

```javascript
import { createRenderer } from 'fela'
import { render } from 'fela-dom'

const rule = props => ({
  backgroundColor: 'red',
  fontSize: props.size,
  color: 'blue'
})

const renderer = createRenderer()

renderer.render(rule, { size: '12px' }) // => a b c

render(renderer)

// automatically adds the rule to the mountNode
renderer.renderRule(rule, { size: '15px '}) // => a d c
```

<br>

---

### Related
* [API reference - `render`](../api/fela-dom/render.md)
* [API reference - `rehydrate`](../api/fela-dom/rehydrate)
