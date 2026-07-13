<script setup lang="ts">
const counterStore = useCounterStore();
console.log('counterStore:', counterStore.counter)
const authStore = useAuthStore();
console.log('authStore:', authStore.isAuthenticated)
</script>

<template>
  <span>Test Auth index page</span>
  <button>Login</button>
</template>
