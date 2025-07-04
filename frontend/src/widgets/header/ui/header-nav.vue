<template>
    <nav class="header__nav">
        <ul class="header__nav--list">
            <li>
                <div class="header__nav--item__wrapper"> 
                    <toggle-aside-menu />
                    <bread-crumbs />
                </div>

            </li>

            <li>
                <!-- TODO History Aside Rigth -->
                <v-logout-btn />
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
import { BreadCrumbs, VLogoutBtn, ToggleAsideMenu } from '@/features'

</script>