/* @flow */
/* eslint-disable consistent-return */
import objectEach from 'fast-loops/lib/objectEach'
import {
  RULE_TYPE,
  KEYFRAME_TYPE,
  FONT_TYPE,
  STATIC_TYPE,
  CLEAR_TYPE,
  getRuleScore,
  generateCSSRule,
} from 'fela-utils'

import getDOMNode from './getDOMNode'
import generateRule from './generateRule'

import type { DOMRenderer } from '../../../../flowtypes/DOMRenderer'

const changeHandlers = {
  [RULE_TYPE]: (
    node,
    { selector, declaration, support, pseudo },
    ruleOrder
  ) => {
    const cssRule = generateRule(selector, declaration, support)

    // only use insertRule in production as browser devtools might have
    // weird behavior if used together with insertRule at runtime
    if (process.env.NODE_ENV !== 'production') {
      node.textContent += cssRule
      return
    }

    try {
      const score = getRuleScore(ruleOrder, pseudo)
      const cssRules = node.sheet.cssRules

      let index = cssRules.length

      for (let i = 0, len = cssRules.length; i < len; ++i) {
        if (cssRules[i].score > score) {
          index = i
          break
        }
      }

      node.sheet.insertRule(cssRule, index)
      cssRules[index].score = score
    } catch (e) {
      // TODO: warning?
    }
  },
  [KEYFRAME_TYPE]: (node, { keyframe }) => {
    node.textContent += keyframe
  },
  [FONT_TYPE]: (node, { fontFace }) => {
    node.textContent += fontFace
  },
  [STATIC_TYPE]: (node, { selector, css }) => {
    if (selector) {
      node.textContent += generateCSSRule(selector, css)
    } else {
      node.textContent += css
    }
  },
}

export default function createDOMSubscription(renderer: DOMRenderer): Function {
  const baseNode = renderer.nodes[RULE_TYPE]

  return function changeSubscription(change) {
    if (change.type === CLEAR_TYPE) {
      return objectEach(renderer.nodes, node => {
        node.textContent = ''
      })
    }

    const handleChange = changeHandlers[change.type]

    if (handleChange) {
      const node = getDOMNode(
        renderer.nodes,
        baseNode,
        change.type,
        change.media,
        !!change.support
      )

      handleChange(node, change, renderer.ruleOrder)
    }
  }
}
