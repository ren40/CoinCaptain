<template>
    <nav class="breadcrumb">
        <ul class="breadcrumb_list">
            <li class="breadcrumb_list--item" v-for="(crumb, index) in breadcrumbs" :key="index">
                <router-link :to="crumb.path" class="breadcrumb_item--link">
                    {{ crumb.name }}
                </router-link>
                <span v-if="index < breadcrumbs.length - 1"> / </span>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const breadcrumbs = computed(() => {
    let paths = []
    let matched = route.matched.filter(m => m.meta && m.meta.breadcrumb)

    for (let i = 0; i < matched.length; i++) {
        const routeMeta = matched[i].meta.breadcrumb as { name?: string } | undefined;
        if (routeMeta && routeMeta.name) {
            paths.push({
                name: routeMeta.name,
                path: matched[i].path
            });
        }
    }

    return paths
})

</script>
