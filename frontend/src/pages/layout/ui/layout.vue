<template>
    <div class="wrapper">
        <header class="layout__header">

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

<style lang="css" scoped>

.wrapper {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas:
    "hd hd hd hd   hd   hd   hd   hd   hd"
    "sd sd sd main main main main main main"
    "ft ft ft ft   ft   ft   ft   ft   ft";
}


</style>