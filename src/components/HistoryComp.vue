<template>
  <v-container>
    <v-form>
      <v-text-field label="ロビーID" v-model="lobbyId"></v-text-field>
      <v-btn @click="fetchHistory" color="primary">履歴表示</v-btn>
      <div class="mt-2"></div>
      <v-alert v-if="errorMessage" type="error" dismissible @click:close="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>
    </v-form>

    <v-divider class="my-4"></v-divider>
    <v-data-table :headers="headers" :items="filteredMatchHistory" :page.sync="page" :items-per-page="-1"
      :items-length="filteredMatchHistory.length">
      <template v-slot:top>
        <div class="pa-2">
          <h3>対戦履歴</h3>
        </div>
      </template>

      <template v-slot:item.team="{ item }">
        <v-chip :color="item.is_battled ? (item.team === 'Astra' ? 'red' : 'blue') : 'grey'" dark>
          {{ item.is_battled ? item.team : '待機' }}
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
      <v-btn @click="generateMatchSpecificMacroData" color="info" class="mr-2">各試合マクロ生成</v-btn>
      <v-btn @click="generatePlayerScoresMacroData" color="warning" class="mr-2">各試合プレイヤー点数マクロ生成</v-btn>
    </div>

    <!-- 各試合マクロ ダイアログ -->
    <v-dialog v-model="shareMatchDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">各試合マクロ</v-card-title>
        <v-card-text>
          <v-textarea v-model="shareData" label="共有データ" rows="10" readonly></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="shareMatchDialog = false" color="secondary">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 各試合プレイヤー点数マクロ ダイアログ -->
    <v-dialog v-model="sharePlayerScoresDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">各試合プレイヤー点数マクロ</v-card-title>
        <v-card-text>
          <v-textarea v-model="displayedPlayerScores" label="共有データ" rows="10" readonly></v-textarea>
          <v-pagination v-model="playerScoresPage" :length="playerScoresPageCount"></v-pagination>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="sharePlayerScoresDialog = false" color="secondary">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/utils/supabase';
import jobOptions from '@/assets/job.json';

const route = useRoute();
const lobbyId = ref(route.query.lobbyId || ''); // クエリパラメータからlobbyIdを取得
const errorMessage = ref('');
const matchHistory = ref([]);
const page = ref(1);
const pageCount = ref(0);
const itemsPerPage = 15; // 1ページに表示する行数

const headers = [
  { title: 'プレイヤー名', key: 'player_name', align: 'start' },
  { title: 'チーム', key: 'team', align: 'start' },
  { title: 'ジョブ', key: 'job_label', align: 'start' },
  { title: '点数', key: 'points', align: 'end' },
];

const shareMatchDialog = ref(false);
const sharePlayerScoresDialog = ref(false);
const shareData = ref('');

// プレイヤー点数マクロ用のページネーション設定
const playerScoresPage = ref(1);
const playerScoresPageCount = ref(0);
const playerScoresPerPage = 15; // 1ページに表示するプレイヤーの数
const allPlayerScores = ref('');
const displayedPlayerScores = ref('');

// 現在のページ番号に対応する試合番号をフィルタリング
const filteredMatchHistory = computed(() => {
  const currentMatchData = matchHistory.value.filter(match => match.match_number === page.value);

  // is_battledがtrueのものを上に表示するためにソート
  return currentMatchData.sort((a, b) => b.is_battled - a.is_battled);
});

// プレイヤー点数マクロのページ表示を更新
const updateDisplayedPlayerScores = () => {
  const start = (playerScoresPage.value - 1) * playerScoresPerPage;
  const end = start + playerScoresPerPage;
  const lines = allPlayerScores.value.split('\n');
  displayedPlayerScores.value = lines.slice(start, end).join('\n');
};

watch(playerScoresPage, updateDisplayedPlayerScores);

const fetchHistory = async () => {
  errorMessage.value = '';
  matchHistory.value = [];

  try {
    const { data, error } = await supabase
      .from('match_histories')
      .select(`
        match_number,
        team,
        job,
        points,
        is_battled,
        player_id(name)
      `)
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
        player_name: match.player_id?.name || '不明',
        team: match.team,
        job_label: jobLabel,
        points: match.points,
        is_battled: match.is_battled,
      };
    });

    const maxMatchNumber = Math.max(...matchHistory.value.map(match => match.match_number));
    pageCount.value = maxMatchNumber;

  } catch (err) {
    errorMessage.value = 'エラーが発生しました。';
  }
};

// 各試合マクロ生成
const generateMatchSpecificMacroData = () => {
  const matchData = filteredMatchHistory.value.filter(record => record.is_battled); // is_battledがtrueのプレイヤーのみ
  let macroText = `/a ====${page.value}試合====\n`;

  const astraData = matchData.filter(record => record.team === 'Astra');
  const umbraData = matchData.filter(record => record.team === 'Umbra');

  macroText += `/a ====Astra====\n`;
  astraData.forEach(record => {
    macroText += `/a ${record.player_name} 持ち点: ${record.points}\n`;
  });

  macroText += `/a ====Umbra====\n`;
  umbraData.forEach(record => {
    macroText += `/a ${record.player_name} 持ち点: ${record.points}\n`;
  });

  shareData.value = macroText.trim();
  shareMatchDialog.value = true;
};

// 各試合プレイヤー点数マクロ生成
const generatePlayerScoresMacroData = () => {
  const matchData = filteredMatchHistory.value;
  let macroText = `/a ====${page.value}試合時点====\n`;

  const playerScores = matchData.reduce((acc, record) => {
    acc[record.player_name] = (acc[record.player_name] || 0) + record.points;
    return acc;
  }, {});

  allPlayerScores.value = Object.entries(playerScores)
    .map(([playerName, totalPoints]) => {
      const playerTeam = matchData.find(record => record.player_name === playerName)?.team || '不明';
      return `/a ${playerName} (${playerTeam}) 持ち点: ${totalPoints}`;
    })
    .join('\n');

  // ページネーション設定
  const totalLines = allPlayerScores.value.split('\n').length;
  playerScoresPageCount.value = Math.ceil(totalLines / playerScoresPerPage);
  playerScoresPage.value = 1; // 初期ページは1
  updateDisplayedPlayerScores();

  sharePlayerScoresDialog.value = true;
};

// ページがマウントされたときに自動的に履歴を取得
onMounted(() => {
  if (lobbyId.value) {
    fetchHistory();
  }
});
</script>