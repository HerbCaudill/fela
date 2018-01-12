import { createRenderer } from 'fela'
import { html as beautify } from 'js-beautify'

import renderToMarkup from '../renderToMarkup'

describe('Rendering to HTML markup', () => {
  it('should return a single HTML markup string', () => {
    const rule = props => ({
      color: props.color,
      '@supports (display:flex)': {
        color: 'yellow',
      },
      '@supports (display:grid)': {
        color: 'brown',
      },
      '@media (min-height: 300px)': {
        color: 'blue',
        '@supports (display:flex)': {
          color: 'green',
        },
        '@supports (display:grid)': {
          color: 'black',
        },
      },
    })

    const renderer = createRenderer()
    renderer.renderRule(rule, {
      color: 'red',
    })
    renderer.renderStatic('*{box-sizing:border-box}')
    renderer.renderStatic(
      {
        display: 'flex',
      },
      'div'
    )

    expect(beautify(renderToMarkup(renderer))).toMatchSnapshot()
  })

  it('should return a single HTML markup string', () => {
    const rule = () => ({
      color: 'yellow',
      ':hover': {
        color: 'blue',
      },
      ':focus-within': {
        color: 'blue',
      },
      ':active': {
        color: 'red',
      },
      '@media (min-width: 300px)': {
        color: 'darkgrey',
        ':active': {
          color: 'blue',
        },
        ':hover': {
          color: 'red',
        },
        ':focus-within': {
          color: 'purple',
        },
      },
    })

    const rule2 = () => ({
      color: 'grey',
      ':hover': {
        color: 'black',
      },
      ':focus-within': {
        color: 'brown',
      },
      ':active': {
        color: 'white',
      },
    })

    const renderer = createRenderer()

    renderer.renderRule(rule)
    renderer.renderRule(rule2)

    expect(beautify(renderToMarkup(renderer))).toMatchSnapshot()
  })
})
