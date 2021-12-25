import SmartAutoCodeGenerator from '@/modules/code-generator/smartAuto'
import PlaywrightCodeGenerator from '@/modules/code-generator/playwright'

export default class CodeGenerator {
  constructor(options = {}) {
    this.smartAutoGenerator = new SmartAutoCodeGenerator(options)
    this.playwrightGenerator = new PlaywrightCodeGenerator(options)
  }

  generate(recording) {
    return {
      smartAuto: this.smartAutoGenerator.generate(recording),
      playwright: this.playwrightGenerator.generate(recording),
    }
  }
}
