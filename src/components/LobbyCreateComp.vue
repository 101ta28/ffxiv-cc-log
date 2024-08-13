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
const errorMessage = ref(''); // エラーメッセージを保存

const dismissError = () => {
	errorMessage.value = '';
};

const validatePlayers = (players) => {
	for (const player of players) {
		if (!player.name) { // プレイヤー名だけを必須にする
			return false;
		}
	}
	return true;
};

const createLobby = async () => {
	errorMessage.value = '';

	if (!validatePlayers(astraPlayers) || !validatePlayers(umbraPlayers)) {
		errorMessage.value = '全てのプレイヤー名を入力してください。';
		return;
	}

	try {
		// ロビーを作成する（SupabaseがUUIDを自動生成）
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

		const players = [
			...astraPlayers.map(player => ({ ...player, team: 'Astra', lobby_id: lobbyUuid })),
			...umbraPlayers.map(player => ({ ...player, team: 'Umbra', lobby_id: lobbyUuid })),
		];

		const { error: playerError } = await supabase
			.from('players')
			.insert(players);

		if (playerError) {
			errorMessage.value = 'プレイヤー保存エラーが発生しました。';
			return;
		}

		// ロビー画面に遷移する
		router.push(`/lobby/${lobbyUuid}`);
	} catch (error) {
		errorMessage.value = 'ロビーの作成中にエラーが発生しました。';
	}
};
</script>