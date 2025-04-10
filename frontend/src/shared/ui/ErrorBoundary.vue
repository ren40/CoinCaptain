<template>
    <ul v-if="errorsArray.length > 0">
        <li v-for="item in errorsArray">
            {{ item }}
        </li>
    </ul>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onErrorCaptured, ref } from 'vue'

const errorsArray = ref<Array<{
    name: string, message: string
}>>([])

onErrorCaptured((error: Error, vm, info: string) => {
    console.log(info, error, vm)
    errorsArray.value.push({ name: 'error', message: 'err' + error })
})
</script>