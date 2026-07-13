<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: false, // Прапорець: потрібна авторизація
    onlyGuests: true, // Прапорець: доступно лише для гостей (неавторизованих користувачів)
    title: 'Авторизація'
  }
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>

    <q-page-container>
       <span>Test Auth index page</span>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
