<template>
    <div class="dashboard">
        <budget />
        <transactions-list />
    </div>
</template>
<script lang="ts" setup>
import { TransactionsList, Budget } from '@/widgets'

</script>
<style scoped>
.dashboard {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}
</style>