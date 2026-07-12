<script setup lang="ts">
definePage({
  redirect: '/admin/settings', // Забороняє доступ до сторінки /admin і перенаправляє на /admin/settings
  meta: {
    requiresAuth: true,     // Прапорець: потрібна авторизація
    roles: ['admin'],       // Дозволені ролі
    title: 'Admin panel'
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <h2>Admin panel</h2>

    <q-page-container>
       <span>Admin panel page</span>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
