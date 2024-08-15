<template>
	<v-container>
		<v-row>
			<v-col>
				<h3>Astra</h3>
				<v-row v-for="(player, index) in astraPlayers" :key="index">
					<v-col cols="6">
						<v-text-field label="プレイヤー名" v-model="player.name" :rules="[v => !!v || 'プレイヤー名は必須です']"
							required></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-select :items="jobOptions" label="ジョブ" v-model="player.job" item-title="label"
							item-value="value"></v-select>
					</v-col>
				</v-row>
			</v-col>
			<v-col>
				<h3>Umbra</h3>
				<v-row v-for="(player, index) in umbraPlayers" :key="index">
					<v-col cols="6">
						<v-text-field label="プレイヤー名" v-model="player.name" :rules="[v => !!v || 'プレイヤー名は必須です']"
							required></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-select :items="jobOptions" label="ジョブ" v-model="player.job" item-title="label"
							item-value="value"></v-select>
					</v-col>
				</v-row>
			</v-col>
		</v-row>

		<!-- 待機プレイヤー -->
		<h4>待機プレイヤー</h4>
		<v-row v-for="(player, index) in substitutePlayers" :key="'substitute-player-' + index">
			<v-col>
				<v-text-field label="プレイヤー名" v-model="player.name"></v-text-field>
			</v-col>
			<v-col>
				<v-select :items="jobOptions" label="ジョブ" v-model="player.job" item-title="label" item-value="value"></v-select>
			</v-col>
			<v-col>
				<v-select :items="teamOptions" label="チーム" v-model="player.team" item-title="label"
					item-value="value"></v-select>
			</v-col>
			<v-col>
				<v-btn @click="removeSubstitutePlayer(index)" color="error">削除</v-btn>
			</v-col>
		</v-row>
		<v-btn @click="addSubstitutePlayer" color="secondary">待機プレイヤー追加</v-btn>

		<div class="py-4" />
		<v-btn @click="createLobby" color="primary">ロビー作成</v-btn>
	</v-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';
import jobOptions from '@/assets/job.json';

const router = useRouter();
const astraPlayers = reactive(Array(5).fill().map(() => ({ name: '', job: '' })));
const umbraPlayers = reactive(Array(5).fill().map(() => ({ name: '', job: '' })));
const substitutePlayers = reactive([]); // 待機プレイヤーを格納する配列
const errorMessage = ref('');

const teamOptions = [
	{ label: 'Astra', value: 'Astra' },
	{ label: 'Umbra', value: 'Umbra' },
];

const dismissError = () => {
	errorMessage.value = '';
};

const validatePlayers = (players) => {
	for (const player of players) {
		if (!player.name) {
			return false;
		}
	}
	return true;
};

const addSubstitutePlayer = () => {
	const newPlayer = { name: '', job: '', team: 'Astra' }; // デフォルトでAstra
	substitutePlayers.push(newPlayer);
};

const removeSubstitutePlayer = (index) => {
	substitutePlayers.splice(index, 1);
};

const createLobby = async () => {
	errorMessage.value = '';

	if (!validatePlayers(astraPlayers) || !validatePlayers(umbraPlayers)) {
		errorMessage.value = '全てのプレイヤー名を入力してください。';
		return;
	}

	try {
		const { data: lobbyData, error: lobbyError } = await supabase
			.from('lobbies')
			.insert({ created_at: new Date() })
			.select()
			.single();

		if (lobbyError) {
			errorMessage.value = 'ロビー作成エラーが発生しました。';
			return;
		}

		const lobbyUuid = lobbyData.lobby_id;

		// 各チームに5人のプレイヤーを割り当て、それ以外は待機プレイヤーとして扱う
		const remainingSubstitutes = [];

		substitutePlayers.forEach(player => {
			if (player.team === 'Astra' && astraPlayers.length < 5) {
				astraPlayers.push({ ...player, team: 'Astra', lobby_id: lobbyUuid });
			} else if (player.team === 'Umbra' && umbraPlayers.length < 5) {
				umbraPlayers.push({ ...player, team: 'Umbra', lobby_id: lobbyUuid });
			} else {
				remainingSubstitutes.push({ ...player, team: player.team, lobby_id: lobbyUuid });
			}
		});

		const players = [
			...astraPlayers.map(player => ({ ...player, team: 'Astra', lobby_id: lobbyUuid })),
			...umbraPlayers.map(player => ({ ...player, team: 'Umbra', lobby_id: lobbyUuid })),
			...remainingSubstitutes, // ここに余った待機プレイヤーを追加
		];

		const { error: playerError } = await supabase
			.from('players')
			.insert(players);

		if (playerError) {
			errorMessage.value = 'プレイヤー保存エラーが発生しました。';
			return;
		}

		router.push(`/lobby/${lobbyUuid}`);
	} catch (error) {
		errorMessage.value = 'ロビーの作成中にエラーが発生しました。';
	}
};
</script>