<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.card {
    border-radius: .7rem;
    background-color: var(--color-background-mute);
}
</style>