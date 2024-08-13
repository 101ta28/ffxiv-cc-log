<template>
  <v-container>
    <v-form>
      <v-text-field label="ロビーID" v-model="lobbyId"></v-text-field>
      <v-btn @click="fetchHistory" color="primary">履歴表示</v-btn>
      <v-alert v-if="errorMessage" type="error" dismissible @click:close="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>
    </v-form>

    <v-divider class="my-4"></v-divider>
    <v-data-table :headers="headers" :items="filteredMatchHistory" :items-per-page="itemsPerPage" :page.sync="page"
      :items-length="filteredMatchHistory.length">
      <template v-slot:top>
        <div class="pa-2">
          <h3>対戦履歴</h3>
        </div>
      </template>

      <!-- チーム列にカスタムスロットを追加 -->
      <template v-slot:item.team="{ item }">
        <v-chip :color="item.team === 'Astra' ? 'red' : 'blue'" dark>
          {{ item.team }}
        </v-chip>
      </template>

      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </template>
    </v-data-table>

    <!-- マクロ書き出しボタン -->
    <div class="text-center">
      <v-btn @click="generateMacroData" color="secondary" class="mr-2">マクロとして書き出し</v-btn>
    </div>

    <!-- ダイアログで共有データを表示 -->
    <v-dialog v-model="shareDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">マクロデータ</v-card-title>
        <v-card-text>
          <v-textarea v-model="shareData" label="共有データ" rows="10" readonly></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="copyShareData" color="primary">コピー</v-btn>
          <v-btn @click="shareDialog = false" color="secondary">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/utils/supabase';
import jobOptions from '@/assets/job.json';

const route = useRoute();
const lobbyId = ref(route.query.lobbyId || ''); // クエリパラメータからlobbyIdを取得
const errorMessage = ref('');
const matchHistory = ref([]);
const page = ref(1);
const itemsPerPage = 10;
const pageCount = ref(0);

const headers = [
  { title: '試合番号', key: 'match_number', align: 'start' },
  { title: 'プレイヤー名', key: 'player_name', align: 'start' },
  { title: 'チーム', key: 'team', align: 'start' },
  { title: 'ジョブ', key: 'job_label', align: 'start' },
  { title: '点数', key: 'points', align: 'end' },
];

const shareDialog = ref(false);
const shareData = ref('');

const filteredMatchHistory = computed(() => {
  return matchHistory.value.filter(match => match.match_number === page.value);
});

const fetchHistory = async () => {
  errorMessage.value = '';
  matchHistory.value = [];

  try {
    const { data, error } = await supabase
      .from('match_histories')
      .select('match_number, job, points, players(name, team)')
      .eq('lobby_id', lobbyId.value)
      .order('match_number', { ascending: true });

    if (error) {
      errorMessage.value = '履歴の取得に失敗しました。';
      return;
    }

    matchHistory.value = data.map(match => {
      const jobLabel = jobOptions.find(j => j.value === match.job)?.label || 'ジョブ選択無し';
      return {
        match_number: match.match_number,
        player_name: match.players.name,
        team: match.players.team,
        job_label: jobLabel,
        points: match.points,
      };
    });

    const maxMatchNumber = Math.max(...matchHistory.value.map(match => match.match_number));
    pageCount.value = maxMatchNumber;

  } catch (err) {
    errorMessage.value = 'エラーが発生しました。';
  }
};

const generateMacroData = () => {
  const data = filteredMatchHistory.value;
  if (data.length === 0) {
    errorMessage.value = '表示されている試合のデータがありません。';
    return;
  }

  let macroText = `/a ====${page.value}試合====\n`;
  const astraData = data.filter(record => record.team === 'Astra');
  const umbraData = data.filter(record => record.team === 'Umbra');

  macroText += `/a ====Astra====\n`;
  astraData.forEach(record => {
    macroText += `/a ${record.player_name} 持ち点: ${record.points}\n`;
  });

  macroText += `/a ====Umbra====\n`;
  umbraData.forEach(record => {
    macroText += `/a ${record.player_name} 持ち点: ${record.points}\n`;
  });

  shareData.value = macroText;
  shareDialog.value = true;
};

const copyShareData = () => {
  navigator.clipboard.writeText(shareData.value)
    .then(() => {
      successMessage.value = '共有データをコピーしました。';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    })
    .catch(err => {
      console.error('コピーエラー:', err);
      errorMessage.value = 'データのコピーに失敗しました。';
    });
};

// ページがマウントされたときに自動的に履歴を取得
onMounted(() => {
  if (lobbyId.value) {
    fetchHistory();
  }
});
</script>