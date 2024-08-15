<template>
	<v-container>
		<v-row class="my-4">
			<v-col cols="12">
				<h2 class="text-center">{{ currentMatchNumber }}試合目</h2>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" md="6">
				<v-card>
					<v-card-title class="text-h5">Astra</v-card-title>
					<v-card-text>
						<v-list>
							<v-list-item v-for="(player, index) in astraPlayers" :key="player.id">
								<v-row class="d-flex align-center">
									<v-col cols="6">
										<v-text-field v-model="player.name" label="プレイヤー名"></v-text-field>
									</v-col>
									<v-col cols="6">
										<v-select :items="jobOptions" v-model="player.job" label="ジョブを選択" item-title="label"
											item-value="value" @update:modelValue="handleJobChange(player, $event)"></v-select>
									</v-col>
								</v-row>
								<v-row class="d-flex align-center mt-2">
									<v-col cols="4">
										<v-text-field v-model="player.points" label="点数" readonly></v-text-field>
									</v-col>
									<v-col cols="8">
										<v-btn @click="addPoint(player)" color="success" variant="outlined" class="mr-2">+1点</v-btn>
										<v-btn @click="removePoint(player)" color="error" variant="outlined" class="mr-2">-1点</v-btn>
										<v-btn @click="swapWithSubstitute('Astra', index)" color="warning"
											variant="outlined">待機と入れ替え</v-btn>
									</v-col>
								</v-row>
							</v-list-item>
						</v-list>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="addTeamPoints('astra')" color="primary" variant="outlined" class="mr-2">チーム全員に+1点</v-btn>
						<v-btn @click="removeTeamPoints('astra')" color="error" variant="outlined">チーム全員から-1点</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card>
					<v-card-title class="text-h5">Umbra</v-card-title>
					<v-card-text>
						<v-list>
							<v-list-item v-for="(player, index) in umbraPlayers" :key="player.id">
								<v-row class="d-flex align-center">
									<v-col cols="6">
										<v-text-field v-model="player.name" label="プレイヤー名"></v-text-field>
									</v-col>
									<v-col cols="6">
										<v-select :items="jobOptions" v-model="player.job" label="ジョブを選択" item-title="label"
											item-value="value" @update:modelValue="handleJobChange(player, $event)"></v-select>
									</v-col>
								</v-row>
								<v-row class="d-flex align-center mt-2">
									<v-col cols="4">
										<v-text-field v-model="player.points" label="点数" readonly></v-text-field>
									</v-col>
									<v-col cols="8">
										<v-btn @click="addPoint(player)" color="success" variant="outlined" class="mr-2">+1点</v-btn>
										<v-btn @click="removePoint(player)" color="error" variant="outlined" class="mr-2">-1点</v-btn>
										<v-btn @click="swapWithSubstitute('Umbra', index)" color="warning"
											variant="outlined">待機と入れ替え</v-btn>
									</v-col>
								</v-row>
							</v-list-item>
						</v-list>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="addTeamPoints('umbra')" color="primary" variant="outlined" class="mr-2">チーム全員に+1点</v-btn>
						<v-btn @click="removeTeamPoints('umbra')" color="error" variant="outlined">チーム全員から-1点</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- 待機プレイヤーカード -->
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-title class="text-h5">待機プレイヤー</v-card-title>
					<v-card-text>
						<v-list>
							<v-list-item v-for="(player, index) in substitutePlayers" :key="'substitute-' + player.id">
								<v-row class="d-flex align-center">
									<v-col cols="4">
										<v-text-field v-model="player.name" label="プレイヤー名"></v-text-field>
									</v-col>
									<v-col cols="4">
										<v-select :items="jobOptions" v-model="player.job" label="ジョブを選択" item-title="label"
											item-value="value" @update:modelValue="handleJobChange(player, $event)"></v-select>
									</v-col>
									<v-col cols="3">
										<v-select :items="teamOptions" v-model="player.team" label="チームを選択" item-title="label"
											item-value="value"></v-select>
									</v-col>
									<v-col cols="1">
										<v-btn @click="removeSubstitutePlayer(index)" color="error">削除</v-btn>
									</v-col>
								</v-row>
								<v-row class="d-flex align-center mt-2">
									<v-col cols="4">
										<v-text-field v-model="player.points" label="点数" readonly></v-text-field>
									</v-col>
									<v-col cols="8">
										<v-btn @click="addPoint(player)" color="success" variant="outlined" class="mr-2">+1点</v-btn>
										<v-btn @click="removePoint(player)" color="error" variant="outlined" class="mr-2">-1点</v-btn>
									</v-col>
								</v-row>
							</v-list-item>
						</v-list>
						<v-btn @click="addSubstitutePlayer" color="secondary">待機プレイヤー追加</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row v-for="alert in jobChangeAlerts" :key="alert.id" class="my-4">
			<v-col cols="12">
				<v-alert type="info" closable @click:close="dismissAlert(alert.id)">
					{{ alert.message }}
				</v-alert>
			</v-col>
		</v-row>

		<v-row v-if="errorMessage" class="my-4">
			<v-col cols="12">
				<v-alert type="error" closable @click:close="dismissError">
					{{ errorMessage }}
				</v-alert>
			</v-col>
		</v-row>

		<v-row v-if="successMessage" class="my-4">
			<v-col cols="12">
				<v-alert type="success" closable @click:close="dismissSuccess">
					{{ successMessage }}
				</v-alert>
			</v-col>
		</v-row>

		<v-row class="text-center">
			<v-col cols="12" class="text-center">
				<v-switch v-model="shuffleType" :label="shuffleType ? '全体シャッフル' : 'チーム内シャッフル'" inset></v-switch>
			</v-col>
			<v-col>
				<v-btn @click="openShareScoresDialog" color="info" variant="elevated" class="mr-2">各試合マクロ生成</v-btn>
				<v-btn @click="openPlayerScoresDialog" color="info" variant="elevated">プレイヤー点数マクロ生成</v-btn>
			</v-col>
		</v-row>

		<v-row>
			<v-col class="text-center">
				<v-btn @click="shuffleTeams" color="warning" variant="elevated" class="mr-2">シャッフル</v-btn>
				<v-btn @click="completeMatch" color="success" variant="elevated">試合完了</v-btn>
			</v-col>
		</v-row>

		<v-row>
			<v-col class="text-center">
				<v-btn @click="confirmCloseLobby" color="error" variant="elevated">ロビーを終了</v-btn>
			</v-col>
		</v-row>

		<v-dialog v-model="closeDialog" max-width="400">
			<v-card>
				<v-card-title class="text-h5">ロビーを終了しますか？</v-card-title>
				<v-card-text>ロビーを終了すると、データの変更ができなくなります。</v-card-text>
				<v-card-actions>
					<v-btn @click="closeLobby" color="error">終了</v-btn>
					<v-btn @click="closeDialog = false" color="primary">キャンセル</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="shareScoresDialog" max-width="500">
			<v-card>
				<v-card-title class="text-h5">各試合マクロ生成</v-card-title>
				<v-card-text>
					<v-text-field v-model="shareMatchNumber" label="試合数" type="number"
						@change="fetchPastMatchData(shareMatchNumber)"></v-text-field>
					<v-textarea v-model="shareData" label="共有データ" rows="10" readonly></v-textarea>
					<v-alert v-if="dialogErrorMessage" type="error" dismissible @click:close="dialogErrorMessage = ''">
						{{ dialogErrorMessage }}
					</v-alert>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="shareScoresDialog = false" color="secondary">閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- プレイヤー点数マクロ生成ダイアログ -->
		<v-dialog v-model="playerScoresDialog" max-width="500">
			<v-card>
				<v-card-title class="text-h5">プレイヤー点数マクロ生成</v-card-title>
				<v-card-text>
					<v-textarea v-model="displayedShareData" label="共有データ" rows="10" readonly></v-textarea>
					<v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages"
						@input="updateDisplayedShareData"></v-pagination>
					<v-alert v-if="dialogErrorMessage" type="error" dismissible @click:close="dialogErrorMessage = ''">
						{{ dialogErrorMessage }}
					</v-alert>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="playerScoresDialog = false" color="secondary">閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 待機プレイヤーとの入れ替えダイアログ -->
		<v-dialog v-model="swapDialogVisible" max-width="400">
			<v-card>
				<v-card-title class="text-h5">プレイヤーの入れ替え</v-card-title>
				<v-card-text>
					<v-select v-model="selectedSubstitute" :items="filteredSubstitutePlayers" item-title="name" item-value="id"
						label="入れ替え先の待機プレイヤーを選択"></v-select>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="performSwap" color="primary">入れ替え</v-btn>
					<v-btn @click="swapDialogVisible = false" color="secondary">キャンセル</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/utils/supabase';
import jobOptions from '@/assets/job.json';

const router = useRouter();
const route = useRoute();
const closeDialog = ref(false);
const swapDialogVisible = ref(false); // ダイアログの表示フラグ
const shareScoresDialog = ref(false); // 各試合マクロ生成ダイアログの表示フラグ
const playerScoresDialog = ref(false); // プレイヤー点数マクロ生成ダイアログの表示フラグ
const selectedPlayer = ref(null); // 入れ替え元のプレイヤー
const selectedSubstitute = ref(null); // 入れ替え先の待機プレイヤー
const jobChangeAlerts = reactive([]);
let currentMatchNumber = ref(1);
let shareMatchNumber = ref(currentMatchNumber.value); // 共有用の試合数
let shareData = ref(''); // 共有データ
const shuffleType = ref(true); // true: 全体シャッフル, false: チーム内シャッフル

const astraPlayers = reactive([]);
const umbraPlayers = reactive([]);
const substitutePlayers = reactive([]); // 待機プレイヤーを格納する配列
const errorMessage = ref('');
const successMessage = ref('');
const dialogErrorMessage = ref('');

const currentPage = ref(1); // 現在のページ
const itemsPerPage = 15; // 1ページに表示する行数
const totalPages = ref(1); // 総ページ数
let allPlayerData = ''; // 全プレイヤーの点数データ
const displayedShareData = ref(''); // 表示するデータ

const teamOptions = [
	{ label: 'Astra', value: 'Astra' },
	{ label: 'Umbra', value: 'Umbra' },
];

const lobbyUuid = route.params.lobbyUuid;

onMounted(async () => {
	if (lobbyUuid) {
		const isLobbyOpen = await checkLobbyStatus(); // ロビーが開いているか確認
		if (isLobbyOpen) {
			await fetchMatchNumber(); // 試合数を取得
			await fetchPlayers(); // プレイヤーデータを取得
		} else {
			// ロビーが閉じられている場合、データをリセット
			resetPlayers();
			currentMatchNumber.value = 1;
		}
	} else {
		errorMessage.value = 'ロビーIDが取得できませんでした。';
	}
});

watch(shareMatchNumber, async (newVal) => {
	if (validateMatchNumber(newVal)) {
		await fetchPastMatchData(newVal); // 過去の試合データを取得
	}
});

watch(currentPage, () => {
	updateDisplayedShareData();
});

// 各試合マクロ生成ダイアログを開く
const openShareScoresDialog = async () => {
	// 現在の試合番号から1を引いて最新の試合番号に設定
	shareMatchNumber.value = currentMatchNumber.value - 1;

	// 最新の試合データを取得
	if (validateMatchNumber(shareMatchNumber.value)) {
		await fetchPastMatchData(shareMatchNumber.value);
	}

	// ダイアログを表示
	shareScoresDialog.value = true;
};

// プレイヤー点数マクロ生成ダイアログを開く
const openPlayerScoresDialog = () => {
	generateAllPlayerScores();
	playerScoresDialog.value = true;
};

const checkLobbyStatus = async () => {
	try {
		const { data: lobby, error } = await supabase
			.from('lobbies')
			.select('is_closed')
			.eq('lobby_id', lobbyUuid)
			.single();

		if (error || !lobby) {
			errorMessage.value = 'ロビーの状態を確認できませんでした。';
			return false;
		}

		if (lobby.is_closed) {
			errorMessage.value = 'このロビーは終了しています。データの閲覧や操作はできません。';
			return false;
		}

		return true;
	} catch (error) {
		errorMessage.value = 'ロビーの状態確認中にエラーが発生しました。';
		return false;
	}
};

const fetchMatchNumber = async () => {
	try {
		const { data, error } = await supabase
			.from('match_histories')
			.select('match_number')
			.eq('lobby_id', lobbyUuid)
			.order('match_number', { ascending: false }) // 最新の試合番号を取得
			.limit(1); // 1行のみ取得

		if (error) {
			currentMatchNumber.value = 1; // デフォルト値として1を設定
		} else if (data.length === 0) {
			// データが存在しない場合（試合がまだ開始されていない場合）
			currentMatchNumber.value = 1;
		} else {
			// データが存在する場合、その試合番号に +1 して次の試合番号を設定
			currentMatchNumber.value = (data[0].match_number || 0) + 1;
		}
		shareMatchNumber.value = currentMatchNumber.value; // shareMatchNumberを更新
	} catch (error) {
		currentMatchNumber.value = 1; // エラー時には1に設定
	}
};

let initialPoints = reactive({
	astra: [],
	umbra: [],
	substitutes: []
});

const fetchPlayers = async () => {
	if (!lobbyUuid) {
		errorMessage.value = 'ロビーIDが未定義です。';
		return;
	}

	// プレイヤーデータを取得
	const { data: players, error: playersError } = await supabase
		.from('players')
		.select('*')
		.eq('lobby_id', lobbyUuid);

	if (playersError) {
		errorMessage.value = 'プレイヤーデータの取得に失敗しました。';
		return;
	}

	if (!players || players.length === 0) {
		errorMessage.value = 'プレイヤーデータが見つかりませんでした。';
		return;
	}

	// 最新の試合のポイントを取得
	const { data: matchHistories, error: historiesError } = await supabase
		.from('match_histories')
		.select('player_id, points')
		.eq('lobby_id', lobbyUuid)
		.eq('match_number', currentMatchNumber.value - 1);  // 最新の試合番号を指定

	if (historiesError) {
		errorMessage.value = '試合履歴データの取得に失敗しました。';
		return;
	}

	// プレイヤーデータを初期化
	resetPlayers();

	// プレイヤーごとの最新のポイントを設定
	players.forEach(player => {
		const history = matchHistories.find(mh => mh.player_id === player.id);
		if (history) {
			player.points = history.points;
		} else {
			player.points = 0;  // 試合履歴がない場合は点数を0に設定
		}

		// チームに振り分け
		if (player.team === 'Astra' && astraPlayers.length < 5) {
			astraPlayers.push(player);
		} else if (player.team === 'Umbra' && umbraPlayers.length < 5) {
			umbraPlayers.push(player);
		} else {
			substitutePlayers.push(player);
		}
	});

	initialPoints.astra = astraPlayers.map(player => player.points);
	initialPoints.umbra = umbraPlayers.map(player => player.points);
	initialPoints.substitutes = substitutePlayers.map(player => player.points);
};

const hasPointsChanged = () => {
	const astraChanged = astraPlayers.some((player, index) => player.points !== initialPoints.astra[index]);
	const umbraChanged = umbraPlayers.some((player, index) => player.points !== initialPoints.umbra[index]);
	const substitutesChanged = substitutePlayers.some((player, index) => player.points !== initialPoints.substitutes[index]);

	return astraChanged || umbraChanged || substitutesChanged;
};

const resetPlayers = () => {
	astraPlayers.length = 0;
	umbraPlayers.length = 0;
	substitutePlayers.length = 0;
};

const addSubstitutePlayer = () => {
	const newPlayer = {
		name: '',
		job: '',
		team: 'Astra', // デフォルトでAstraに設定
		points: 0    // プレイヤー追加時に点数を初期化
		// idはSupabaseが自動生成するためここでは指定しません
	};
	substitutePlayers.push(newPlayer);
};

const removeSubstitutePlayer = (index) => {
	substitutePlayers.splice(index, 1);
};

const swapWithSubstitute = (team, index) => {
	selectedPlayer.value = { team, index };
	swapDialogVisible.value = true; // ダイアログを表示
};

const performSwap = () => {
	if (!selectedPlayer.value || !selectedSubstitute.value) return;

	const { team, index } = selectedPlayer.value;

	let mainPlayer;
	let substitutePlayerIndex;

	if (team === 'Astra') {
		mainPlayer = astraPlayers[index];
		substitutePlayerIndex = substitutePlayers.findIndex(
			(player) => player.id === selectedSubstitute.value
		);
		if (substitutePlayerIndex !== -1) {
			astraPlayers.splice(index, 1, substitutePlayers[substitutePlayerIndex]);
			substitutePlayers.splice(substitutePlayerIndex, 1, mainPlayer);
		}
	} else if (team === 'Umbra') {
		mainPlayer = umbraPlayers[index];
		substitutePlayerIndex = substitutePlayers.findIndex(
			(player) => player.id === selectedSubstitute.value
		);
		if (substitutePlayerIndex !== -1) {
			umbraPlayers.splice(index, 1, substitutePlayers[substitutePlayerIndex]);
			substitutePlayers.splice(substitutePlayerIndex, 1, mainPlayer);
		}
	}

	swapDialogVisible.value = false;
	selectedSubstitute.value = null;
};

const filteredSubstitutePlayers = computed(() => {
	if (!selectedPlayer.value) return [];

	const { team } = selectedPlayer.value;

	return substitutePlayers.filter(player => player.team === team);
});

const handleJobChange = (player, newJob) => {
	player.job = newJob;

	const jobLabel = jobOptions.find(j => j.value === newJob)?.label || newJob;
	const message = `${player.name}のジョブが${jobLabel}に変更されました。`;

	const existingAlertIndex = jobChangeAlerts.findIndex(alert => alert.id === player.id);
	if (existingAlertIndex !== -1) {
		jobChangeAlerts[existingAlertIndex].message = message;
	} else {
		jobChangeAlerts.push({ id: player.id, message });
	}

	// アラートを一定時間後に自動的に消去する処理
	setTimeout(() => {
		dismissAlert(player.id);
	}, 5000);
};

const fetchPastMatchData = async (matchNumber) => {
	try {
		const { data, error } = await supabase
			.from('match_histories')
			.select('player_id, job, points, team, is_battled')
			.eq('lobby_id', lobbyUuid)
			.eq('match_number', matchNumber);

		if (error) {
			dialogErrorMessage.value = '過去の試合データの取得に失敗しました。';
			return;
		}

		if (data && data.length > 0) {
			shareData.value = generateShareData(data); // 取得したデータを共有データに変換する関数を呼び出し
			dialogErrorMessage.value = ''; // エラーメッセージをリセット
		} else {
			dialogErrorMessage.value = `試合番号 ${matchNumber} のデータは存在しません。`;
		}
	} catch (error) {
		dialogErrorMessage.value = '過去の試合データの取得中にエラーが発生しました。';
	}
};

const generateShareData = (data) => {
	let shareText = `/a ====${shareMatchNumber.value}試合====`;

	// 戦ったプレイヤーのみをフィルタリング
	const astraData = data.filter(record => record.team === 'Astra' && record.is_battled);
	const umbraData = data.filter(record => record.team === 'Umbra' && record.is_battled);

	// Astraチームの情報を生成
	if (astraData.length > 0) {
		shareText += `\n/a ====Astra====\n`;
		shareText += astraData.map(record => {
			const playerName = getPlayerName(record.player_id) || '不明'; // プレイヤー名を取得
			return `/a ${playerName} 持ち点: ${record.points}`;
		}).join('\n');
	}

	// Umbraチームの情報を生成
	if (umbraData.length > 0) {
		shareText += `\n/a ====Umbra====\n`;
		shareText += umbraData.map(record => {
			const playerName = getPlayerName(record.player_id) || '不明'; // プレイヤー名を取得
			return `/a ${playerName} 持ち点: ${record.points}`;
		}).join('\n');
	}

	// 不要な末尾の改行を削除
	return shareText.trim();
};

// プレイヤーIDからプレイヤー名を取得するヘルパー関数
const getPlayerName = (playerId) => {
	const allPlayers = [...astraPlayers, ...umbraPlayers, ...substitutePlayers];
	const player = allPlayers.find(p => p.id === playerId);
	return player ? player.name : null;
};

// 全プレイヤーの点数マクロを生成
const generateAllPlayerScores = async () => {
	await fetchPlayers();  // 最新のプレイヤーデータを取得

	shareMatchNumber.value = currentMatchNumber.value - 1;
	allPlayerData = '';
	let lineCount = 0;

	const addPlayerToAllData = (player) => {
		allPlayerData += `/a ${player.name} 持ち点: ${player.points}\n`;
		lineCount++;
	};

	astraPlayers.forEach(addPlayerToAllData);
	umbraPlayers.forEach(addPlayerToAllData);
	substitutePlayers.forEach(addPlayerToAllData);
	allPlayerData = allPlayerData.trim();

	totalPages.value = Math.ceil(lineCount / itemsPerPage);
	currentPage.value = 1;
	updateDisplayedShareData();
};

// 表示するデータを現在のページに応じて更新
const updateDisplayedShareData = () => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	const lines = allPlayerData.split('\n');

	// 指定されたページ範囲のデータを表示
	displayedShareData.value = lines.slice(start, end).join('\n');
};

const validateMatchNumber = (value) => {
	if (isNaN(value) || value < 1 || value >= currentMatchNumber.value) {
		dialogErrorMessage.value = '試合数が無効です。1から現在の試合数までの数値を入力してください。';
		return false;
	}
	dialogErrorMessage.value = '';
	return true;
};

const dismissAlert = (id) => {
	const index = jobChangeAlerts.findIndex(alert => alert.id === id);
	if (index !== -1) {
		jobChangeAlerts.splice(index, 1);
	}
};

const dismissError = () => {
	errorMessage.value = '';
};

const dismissSuccess = () => {
	successMessage.value = '';
};

const addPoint = (player) => {
	player.points += 1;
};

const removePoint = (player) => {
	if (player.points > 0) {
		player.points -= 1;
	}
};

const addTeamPoints = (team) => {
	const players = team === 'astra' ? astraPlayers : umbraPlayers;

	for (const player of players) {
		player.points += 1;
	}
};

const removeTeamPoints = (team) => {
	const players = team === 'astra' ? astraPlayers : umbraPlayers;

	for (const player of players) {
		if (player.points > 0) {
			player.points -= 1;
		}
	}
};

const shuffleTeams = () => {
	let shuffledAstraPlayers = [];
	let shuffledUmbraPlayers = [];

	if (shuffleType.value) {
		// 全体シャッフル
		const allPlayers = [...astraPlayers, ...umbraPlayers, ...substitutePlayers];

		// 配列をシャッフル
		shuffle(allPlayers);

		// シャッフル後のプレイヤーを仮のチームに割り当て
		shuffledAstraPlayers = allPlayers.slice(0, Math.min(5, allPlayers.length)); // Astraチームに最大5人割り当て
		shuffledUmbraPlayers = allPlayers.slice(5, Math.min(10, allPlayers.length)); // Umbraチームに最大5人割り当て

		// 残りは待機プレイヤーに戻す
		const remainingSubstitutes = allPlayers.slice(10);
		substitutePlayers.length = 0; // 待機プレイヤーをリセット
		substitutePlayers.push(...remainingSubstitutes);
	} else {
		// チーム内シャッフル
		// 現在のAstraとUmbraのプレイヤーをシャッフル
		shuffledAstraPlayers = shuffle([...astraPlayers]);
		shuffledUmbraPlayers = shuffle([...umbraPlayers]);
	}

	// シャッフル結果を仮のチーム配列に保存
	astraPlayers.length = 0;
	umbraPlayers.length = 0;
	astraPlayers.push(...shuffledAstraPlayers);
	umbraPlayers.push(...shuffledUmbraPlayers);

	successMessage.value = shuffleType.value ? '全体をシャッフルしました。' : 'チーム内をシャッフルしました。';
};

// 配列をシャッフルする関数
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const completeMatch = async () => {
	if (!hasPointsChanged()) {
		errorMessage.value = '点数に変更がありません。試合結果を保存する前に点数を確認してください。';
		return;
	}
	try {
		// まだUUIDが設定されていないプレイヤーをSupabaseに保存
		const playersToInsert = substitutePlayers.filter(player => !player.id);
		if (playersToInsert.length > 0) {
			const { data: insertedPlayers, error: insertError } = await supabase
				.from('players')
				.insert(playersToInsert)
				.select();

			if (insertError) {
				errorMessage.value = 'プレイヤーの保存に失敗しました。';
				return;
			}

			// 新しく生成されたUUIDを対応するプレイヤーに設定
			insertedPlayers.forEach((insertedPlayer, index) => {
				substitutePlayers[index].id = insertedPlayer.id;
			});
		}

		// 全プレイヤーの情報を集める
		const allPlayers = [...astraPlayers, ...umbraPlayers, ...substitutePlayers];

		// メインプレイヤーのIDをセットにまとめる
		const mainPlayerIds = new Set([...astraPlayers, ...umbraPlayers].map(player => player.id));

		// シャッフルされた仮のチーム情報を設定
		const matchHistory = allPlayers.map(player => ({
			lobby_id: lobbyUuid,
			player_id: player.id,
			match_number: currentMatchNumber.value,
			job: player.job || null, // jobが未定義の場合null
			points: player.points || 0, // pointsが未定義の場合は0に設定
			team: mainPlayerIds.has(player.id) ? (astraPlayers.includes(player) ? 'Astra' : 'Umbra') : player.team, // 仮のチーム情報を使用
			recorded_at: new Date(),
			is_battled: mainPlayerIds.has(player.id), // メインプレイヤーのみをバトルに参加させる
		}));

		const { error: historyError } = await supabase.from('match_histories').insert(matchHistory);
		if (historyError) {
			errorMessage.value = '対戦履歴の保存に失敗しました。';
			return;
		}

		// ロビーの試合数を更新
		currentMatchNumber.value += 1;

		// 成功メッセージを設定し、一定時間後に消去する
		successMessage.value = '試合データを保存しました';
		setTimeout(() => {
			successMessage.value = '';
		}, 5000);

	} catch (error) {
		errorMessage.value = '予期しないエラーが発生しました。';
	}
};

const confirmCloseLobby = () => {
	closeDialog.value = true;
};

const closeLobby = async () => {
	try {
		// ロビーを閉じる
		const { error } = await supabase
			.from('lobbies')
			.update({ is_closed: true })
			.eq('lobby_id', lobbyUuid);

		if (error) {
			return;
		}

		// クエリパラメータにlobbyIdを含めて/historyページに移動
		router.push({ path: '/history', query: { lobbyId: lobbyUuid } });
	} catch (error) {
		errorMessage.value = 'ロビーの終了に失敗しました。';
	}
};
</script>