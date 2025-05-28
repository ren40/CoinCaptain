<template>
    <div class="wrapper">
        <header class="layout__header">
            <header-nav />
        </header>
        <main class="layout__main">
            <aside class="layout__nav">

            </aside>
            <div class="layout__content">

            </div>
        </main>
        <footer class="layout__footer">

        </footer>
    </div>
</template>

<script lang="ts" setup>
import { HeaderNav } from '@/widgets'
import { useAxios } from '@/shared'
import { onMounted } from 'vue';

const { axiosInstance } = useAxios()

onMounted(() => {
    axiosInstance.get('/api/transations').then(response => {
        console.log('Data fetched:', response.data);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
})
</script>

<style lang="css" scoped>
.wrapper {
    display: grid;
    flex-grow: 1;
    grid-template-columns: repeat(9, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas:
        "hd hd hd hd hd hd hd hd hd"
        "sd sd sd main main main main main main"
        "sd sd sd ft ft ft ft ft ft";
}

.layout__header {
    grid-area: hd;
    background-color: #8ca0ff;
}

.layout__nav {
    grid-area: sd;
    background-color: #8ca1;
}

.layout__main {
    grid-area: main;
    background-color: #afb4d0;
}

.layout__footer {
    grid-area: ft;
    background-color: #0325e6;
}
</style>