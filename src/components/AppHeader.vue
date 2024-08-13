<template>
  <!-- <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>My App</v-toolbar-title>
  </v-app-bar> -->
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>FFXIV CC Log</v-toolbar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" @click="navigate(item.path)">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
// /join, /history, /createに移動できるようにする
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)

const navigate = (path) => {
  router.push(path)
}

const items = [
  { title: 'ホーム', icon: 'mdi-home', path: '/' },
  { title: 'ロビー作成', icon: 'mdi-plus', path: '/create' },
  { title: 'ロビー参加', icon: 'mdi-account-multiple', path: '/join' },
  { title: '対戦履歴', icon: 'mdi-history', path: '/history' },
]
</script>