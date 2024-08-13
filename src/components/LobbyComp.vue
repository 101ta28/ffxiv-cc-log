<template>
	<v-container>
		<v-row class="my-4">
			<v-col cols="12">
				<h2 class="text-center">試合数: {{ currentMatchNumber }}</h2>
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
											item-value="value"></v-select>
									</v-col>
								</v-row>
								<v-row class="d-flex align-center mt-2">
									<v-col cols="4">
										<v-text-field v-model="player.points" label="点数" readonly></v-text-field>
									</v-col>
									<v-col cols="8">
										<v-btn @click="addPoint(player)" color="success" variant="outlined" class="mr-2">+1点</v-btn>
										<v-btn @click="removePoint(player)" color="error" variant="outlined">-1点</v-btn>
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
											item-value="value"></v-select>
									</v-col>
								</v-row>
								<v-row class="d-flex align-center mt-2">
									<v-col cols="4">
										<v-text-field v-model="player.points" label="点数" readonly></v-text-field>
									</v-col>
									<v-col cols="8">
										<v-btn @click="addPoint(player)" color="success" variant="outlined" class="mr-2">+1点</v-btn>
										<v-btn @click="removePoint(player)" color="error" variant="outlined">-1点</v-btn>
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

		<v-row>
			<v-col class="text-center">
				<v-btn @click="shareScores" color="info" variant="elevated" class="mr-2">点数共有</v-btn>
				<v-btn @click="completeMatch" color="success" variant="elevated" class="mr-2">試合完了</v-btn>
				<v-btn @click="shuffleTeams" color="warning" variant="elevated">シャッフル</v-btn>
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

		<v-dialog v-model="shareDialog" max-width="500">
			<v-card>
				<v-card-title class="text-h5">点数共有</v-card-title>
				<v-card-text>
					<v-text-field v-model="shareMatchNumber" label="試合数" type="number"
						@change="fetchPastMatchData(shareMatchNumber)"></v-text-field>
					<v-textarea v-model="shareData" label="共有データ" rows="10" readonly></v-textarea>
					<v-alert v-if="dialogErrorMessage" type="error" dismissible @click:close="dialogErrorMessage = ''">
						{{ dialogErrorMessage }}
					</v-alert>
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
import { reactive, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/utils/supabase';
import jobOptions from '@/assets/job.json';

const router = useRouter();
const route = useRoute();
const closeDialog = ref(false);
const shareDialog = ref(false);
const jobChangeAlerts = reactive([]);
let currentMatchNumber = ref(1);
let shareMatchNumber = ref(currentMatchNumber.value); // 共有用の試合数
let shareData = ref(''); // 共有データ
let previousMatchPoints = null;

const astraPlayers = reactive([]);
const umbraPlayers = reactive([]);
const errorMessage = ref('');
const successMessage = ref('');
const dialogErrorMessage = ref('');

const lobbyUuid = route.params.lobbyUuid;

onMounted(async () => {
	if (lobbyUuid) {
		const isLobbyOpen = await checkLobbyStatus(); // ロビーが開いているか確認
		if (isLobbyOpen) {
			await fetchMatchNumber(); // 試合数を取得
			await fetchPlayers(); // プレイヤーデータを取得
		} else {
			// ロビーが閉じられている場合、データをリセット
			astraPlayers.length = 0;
			umbraPlayers.length = 0;
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
		console.error('ロビー状態の確認中にエラーが発生しました:', error);
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

const fetchPlayers = async () => {
	if (!lobbyUuid) {
		errorMessage.value = 'ロビーIDが未定義です。';
		return;
	}

	const { data: players, error } = await supabase
		.from('players')
		.select('*')
		.eq('lobby_id', lobbyUuid);

	if (error) {
		errorMessage.value = 'プレイヤーデータの取得に失敗しました。';
		return;
	}

	if (!players || players.length === 0) {
		errorMessage.value = 'プレイヤーデータが見つかりませんでした。';
		return;
	}

	astraPlayers.length = 0; // リセット
	umbraPlayers.length = 0; // リセット

	players.forEach(player => {
		if (player.team === 'Astra') {
			astraPlayers.push(player);
		} else if (player.team === 'Umbra') {
			umbraPlayers.push(player);
		}
	});
};

const handleJobChange = async (player, newJob) => {
	player.job = newJob;

	const { error } = await supabase
		.from('players')
		.update({ job: newJob })
		.eq('id', player.id);

	if (error) {
		console.error('ジョブ更新エラー:', error);
	}

	const jobLabel = jobOptions.find(j => j.value === newJob)?.label || newJob;
	const message = `${player.name}のジョブが${jobLabel}に変更されました。試合開始前であることを確認してください。`;

	const existingAlertIndex = jobChangeAlerts.findIndex(alert => alert.id === player.id);
	if (existingAlertIndex !== -1) {
		jobChangeAlerts[existingAlertIndex].message = message;
	} else {
		jobChangeAlerts.push({ id: player.id, message });
	}
};

const pastMatchData = ref([]); // 過去の試合データを保存する配列

const fetchPastMatchData = async (matchNumber) => {
	try {
		const { data, error } = await supabase
			.from('match_histories')
			.select('player_id, job, points, team')
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
		console.error('過去の試合データ取得エラー:', error);
		dialogErrorMessage.value = '過去の試合データの取得中にエラーが発生しました。';
	}
};

const generateShareData = (data) => {
	let shareText = `/a ====${shareMatchNumber.value}試合====\n`;
	const astraData = data.filter(record => record.team === 'Astra');
	const umbraData = data.filter(record => record.team === 'Umbra');

	shareText += `/a ====Astra====\n`;
	astraData.forEach(record => {
		const player = astraPlayers.concat(umbraPlayers).find(p => p.id === record.player_id);
		const playerName = player ? player.name : '不明';
		shareText += `/a ${playerName} 持ち点: ${record.points}\n`;
	});

	shareText += `/a ====Umbra====\n`;
	umbraData.forEach(record => {
		const player = astraPlayers.concat(umbraPlayers).find(p => p.id === record.player_id);
		const playerName = player ? player.name : '不明';
		shareText += `/a ${playerName} 持ち点: ${record.points}\n`;
	});

	return shareText;
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
			dialogErrorMessage.value = 'データのコピーに失敗しました。';
		});
};

const shareScores = async () => {
	await fetchPastMatchData(shareMatchNumber.value);  // 共有データを生成
	shareDialog.value = true;   // ダイアログを表示
};

const validateMatchNumber = (value) => {
	if (isNaN(value) || value < 1 || value > currentMatchNumber.value) {
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

const addPoint = async (player) => {
	player.points += 1;

	const { error } = await supabase
		.from('players')
		.update({ points: player.points })
		.eq('id', player.id);

	if (error) {
		console.error('ポイント更新エラー:', error);
	}
};

const removePoint = async (player) => {
	if (player.points > 0) {
		player.points -= 1;

		const { error } = await supabase
			.from('players')
			.update({ points: player.points })
			.eq('id', player.id);

		if (error) {
			console.error('ポイント減算エラー:', error);
		}
	}
};

const addTeamPoints = async (team) => {
	const players = team === 'astra' ? astraPlayers : umbraPlayers;

	for (const player of players) {
		player.points += 1;

		const { error } = await supabase
			.from('players')
			.update({ points: player.points })
			.eq('id', player.id);

		if (error) {
			console.error('チームポイント追加エラー:', error);
		}
	}
};

const removeTeamPoints = async (team) => {
	const players = team === 'astra' ? astraPlayers : umbraPlayers;

	for (const player of players) {
		if (player.points > 0) {
			player.points -= 1;

			const { error } = await supabase
				.from('players')
				.update({ points: player.points })
				.eq('id', player.id);

			if (error) {
				console.error('チームポイント減算エラー:', error);
			}
		}
	}
};

const shuffleTeams = () => {
	const allPlayers = [...astraPlayers, ...umbraPlayers];

	for (let i = allPlayers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
	}

	const midIndex = Math.floor(allPlayers.length / 2);
	astraPlayers.splice(0, astraPlayers.length, ...allPlayers.slice(0, midIndex));
	umbraPlayers.splice(0, umbraPlayers.length, ...allPlayers.slice(midIndex));

	astraPlayers.forEach(player => player.team = 'Astra');
	umbraPlayers.forEach(player => player.team = 'Umbra');
};

const completeMatch = async () => {
	try {
		const allPlayers = [...astraPlayers, ...umbraPlayers];

		// 名前が変更されたプレイヤーの処理
		for (const player of allPlayers) {
			const { data: existingPlayer, error: fetchError } = await supabase
				.from('players')
				.select('id, name')
				.eq('id', player.id)
				.single();

			if (fetchError || existingPlayer.name !== player.name) {
				// 新しいプレイヤーとして保存
				const newPlayer = {
					name: player.name,
					job: player.job,
					points: player.points,
					team: player.team,
					lobby_id: lobbyUuid,
				};

				const { data: insertedPlayer, error: insertError } = await supabase
					.from('players')
					.insert(newPlayer)
					.select()
					.single();

				if (insertError) {
					console.error('新しいプレイヤーの保存エラー:', insertError);
					errorMessage.value = 'プレイヤーの保存に失敗しました。';
					return;
				} else {
					// プレイヤーのIDを新しいものに更新
					player.id = insertedPlayer.id;
				}
			}
		}

		const hasPointsChanged = allPlayers.some((player, index) => {
			if (previousMatchPoints) {
				return player.points !== previousMatchPoints[index].points;
			}
			return player.points > 0;
		});

		if (!hasPointsChanged) {
			errorMessage.value = '点数が変更されていないため、試合を完了できません。';
			return;
		}

		const players = [
			...astraPlayers.map(player => ({ ...player, team: 'Astra', lobby_id: lobbyUuid })),
			...umbraPlayers.map(player => ({ ...player, team: 'Umbra', lobby_id: lobbyUuid }))
		];

		const { error: playerError } = await supabase.from('players').upsert(players);

		if (playerError) {
			console.error('プレイヤーデータの保存エラー:', playerError);
			return;
		}

		const matchHistory = players.map(player => ({
			lobby_id: lobbyUuid,
			player_id: player.id,
			match_number: currentMatchNumber.value,
			job: player.job,
			points: player.points,
			team: player.team,
			recorded_at: new Date()
		}));

		const { error: historyError } = await supabase.from('match_histories').insert(matchHistory);

		if (historyError) {
			console.error('対戦履歴の保存エラー:', historyError);
			return;
		}

		// 試合数を更新
		currentMatchNumber.value += 1;
		await supabase
			.from('lobbies')
			.update({ current_match_number: currentMatchNumber.value })
			.eq('lobby_id', lobbyUuid);

		previousMatchPoints = allPlayers.map(player => ({ id: player.id, points: player.points }));

		// 成功メッセージを設定し、一定時間後に消去する
		successMessage.value = '試合データを保存しました';
		setTimeout(() => {
			successMessage.value = '';
		}, 5000);

		shuffleTeams();

	} catch (error) {
		console.error('エラーが発生しました:', error);
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

		console.log('ロビーを終了しました。データを変更できなくなります。');
		// クエリパラメータにlobbyIdを含めて/historyページに移動
		router.push({ path: '/history', query: { lobbyId: lobbyUuid } });
	} catch (error) {
		console.error('ロビーの終了中にエラーが発生しました:', error);
	}
};
</script>