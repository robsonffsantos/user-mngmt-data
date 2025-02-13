<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const darkMode = ref(false)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  theme.global.name.value = darkMode.value ? 'dark' : 'light'
}
</script>

<template>
  <v-app>
    <v-container>
      <v-app-bar color="primary" dark>
        <v-toolbar-title>User Management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleDarkMode">
          <v-icon>{{ darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main>
        <RouterView />
      </v-main>
    </v-container>
  </v-app>
</template>

<style>
/* Adicione estilos globais aqui se necessário */
</style>
