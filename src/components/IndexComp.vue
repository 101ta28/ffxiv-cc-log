<template>
  <v-container>
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <v-img class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">FFXIV CC Log</h1>
        <div class="py-2" />
        <p class="text-h5">FF14のクリスタルコンフリクトのカスタムマッチ支援ツールです。</p>
        <p class="text-h5">対戦履歴は30日後に自動で削除されます。</p>
        <p class="text-h6">全プレイヤーシャッフルと指定チーム内シャッフルに対応しています。</p>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="6">
          <v-card @click="createLobby" class="py-4 text-center" color="surface-variant" prepend-icon="mdi-plus"
            rounded="lg" title="ロビー作成" variant="text">
            <v-overlay opacity=".3" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card @click="joinLobby" class="py-4 text-center" color="surface-variant"
            prepend-icon="mdi-account-multiple" rounded="lg" title="ロビー参加" variant="text">
            <v-overlay opacity=".3" scrim="secondary" contained model-value persistent />
          </v-card>
        </v-col>

        <!-- <v-col cols="6">
          <v-card @click="deleteLobby" class="py-4 text-center" color="surface-variant"
            prepend-icon="mdi-text-box-outline" rounded="lg" title="ロビー削除" variant="text">
            <v-overlay opacity=".3" scrim="red-darken-1" contained model-value persistent />
          </v-card>
        </v-col> -->

        <v-col cols="6">
          <v-card @click="historyLobby" class="py-4 text-center" color="surface-variant" prepend-icon="mdi-history"
            rounded="lg" title="対戦履歴" variant="text">
            <v-overlay opacity=".3" scrim="amber-lighten-1" contained model-value persistent />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const createLobby = () => {
  router.push({ name: '/create' });
};

const joinLobby = () => {
  router.push({ name: '/join' });
};

const deleteLobby = () => {
  router.push({ name: '/delete' });
};

const historyLobby = () => {
  router.push({ name: '/history' });
};
</script>