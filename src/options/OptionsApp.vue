<template>
  <main class="bg-gray-lightest flex py-9 w-full h-screen overflow-auto dark:bg-black">
    <div class="flex flex-col w-1/4 pt-12 pr-6"></div>
    <div class="flex flex-col w-1/2">
      <header class="flex flex-row justify-between items-center mb-3.5">
        <div class="flex items-baseline">
          <h1 class="text-blue text-2xl font-bold mr-1">
            录像机
          </h1>
          <span class="text-gray-dark dark:text-gray-light text-sm">v{{ version }}</span>
        </div>
        <span
          role="alert"
          class="text-gray-darkest dark:text-white text-base font-semibold"
          v-show="saving"
          >保存中...</span
        >
      </header>

      <section>
        <h2>预设内容</h2>
        <label for="custom-data-attribute">自定义首部公共case</label>
        <div class="mb-6">
          <textarea
            id="custom-data-attribute"
            class="w-full placeholder-gray-darkish bg-gray-lighter h-100 rounded px-2 mb-2 text-sm"
            v-model.trim="options.code.headerText"
            @change="save"
          />
          <p>
            输入的内容会自动设置到起始处。
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { version } from '../../package.json'

import storage from '@/services/storage'
import { isDarkMode } from '@/services/constants'
import { defaults as code } from '@/modules/code-generator/base-generator'
import { merge } from 'lodash'

// import Button from '@/components/Button'
// import Toggle from '@/components/Toggle'

const defaultOptions = {
  code,
  extension: {
    telemetry: true,
    darkMode: isDarkMode(),
  },
}

export default {
  name: 'OptionsApp',

  data() {
    return {
      version,
      loading: true,
      saving: false,
      options: defaultOptions,
      recordingKeyCodePress: false,
    }
  },

  watch: {
    options: {
      handler() {
        this.save()
      },
      deep: true,
    },

    'options.extension.darkMode': {
      handler(newVal) {
        document.body.classList[newVal ? 'add' : 'remove']('dark')
      },
      immediate: true,
    },
  },

  mounted() {
    this.load()
    chrome.storage.onChanged.addListener(({ options = null }) => {
      if (options && options.newValue.extension.darkMode !== this.options.extension.darkMode) {
        this.options.extension.darkMode = options.newValue.extension.darkMode
      }
    })
  },

  methods: {
    async save() {
      this.saving = true
      await storage.set({ options: this.options })

      setTimeout(() => (this.saving = false), 500)
    },

    async load() {
      const { options } = await storage.get('options')
      merge(defaultOptions, options)
      this.options = Object.assign({}, this.options, defaultOptions)

      this.loading = false
    },

    listenForKeyCodePress() {
      this.recordingKeyCodePress = true

      const keyDownFunction = e => {
        this.recordingKeyCodePress = false
        this.updateKeyCodeWithNumber(e)
        window.removeEventListener('keydown', keyDownFunction, false)
        e.preventDefault()
      }

      window.addEventListener('keydown', keyDownFunction, false)
    },

    updateKeyCodeWithNumber(evt) {
      this.options.code.keyCode = parseInt(evt.keyCode, 10)
      this.save()
    },
  },
}
</script>

<style scoped>
body {
  background: #f9fafc;
  height: 100vh;
}

body.dark {
  background: #161616;
}

code {
  @apply font-semibold;
}

a {
  @apply text-blue underline text-sm text-right;
}

h2 {
  @apply text-gray-darkish text-xl font-semibold mb-5 dark:text-gray-light;
}

label {
  color: #000;
  @apply font-semibold text-sm mb-2 block dark:text-gray-lightest;
}

section {
  @apply bg-white border-gray-light border border-solid rounded-md p-4 pb-10 mb-6 dark:bg-black-shady dark:border-gray-dark;
}

p {
  @apply text-gray-darkish text-xs mb-2 dark:text-white;
}
</style>
