import Block from '@/modules/code-generator/block'
import { headlessActions } from '@/modules/code-generator/constants'
import BaseGenerator from '@/modules/code-generator/base-generator'
import { headlessTypes } from './constants'

const importPlaywright = `const { chromium } = require('playwright');\n`

const header = `const browser = await chromium.launch()
const page = await browser.newPage()`

const footer = `await browser.close()`

const wrappedHeader = `(async () => {
  ${header}\n`

const wrappedFooter = `  ${footer}
})()`

export default class PlaywrightCodeGenerator extends BaseGenerator {
  constructor(options) {
    super(options)
    this._header = header
    this._footer = footer
    this._wrappedHeader = wrappedHeader
    this._wrappedFooter = wrappedFooter
  }

  generate(events) {
    return (
      importPlaywright +
      this._getHeader(headlessTypes.PLAYWRIGHT) +
      this._parseEvents(events, headlessTypes.PLAYWRIGHT) +
      this._getFooter()
    )
    // return importPlaywright + this._getHeader() + this._parseEvents(events)
  }

  _handleViewport(width, height) {
    return new Block(this._frameId, {
      type: headlessActions.VIEWPORT,
      value: `await ${this._frame}.setViewportSize({ width: ${width}, height: ${height} })`,
      text: '最大化浏览器窗口',
    })
  }

  _handleChange(selector, value) {
    return new Block(this._frameId, {
      type: headlessActions.CHANGE,
      value: `await ${this._frame}.selectOption('${selector}', '${value}')`,
    })
  }
}
