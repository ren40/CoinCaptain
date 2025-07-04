<template>
    <ul class="error-boundary__list" v-if="errorsArray.length > 0">
        <li class="error-boundary__list--item" v-for="(item, indx) in errorsArray" :key="indx">
            {{ item }}
            <div>
                <button @click="onClose(indx)">Close</button>
            </div>
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

const onClose = (indx: number) => {
    errorsArray.value.splice(indx, 1)
}

onErrorCaptured((error: Error, vm, info: string) => {
    console.log(info, error, vm)
    errorsArray.value.push({ name: 'error', message: 'err' + error })
})
</script>