<template>
	<v-container>
		<v-form>
			<v-text-field label="ロビーID" v-model="lobbyId" required></v-text-field>
			<v-btn @click="joinLobby" color="primary">参加</v-btn>
			<div class="py-4" />
			<v-alert v-if="errorMessage" type="error" dismissible @click:close="dismissError">
				{{ errorMessage }}
			</v-alert>
		</v-form>
	</v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';

const lobbyId = ref(''); // 入力されたロビーIDを保存する
const errorMessage = ref(''); // エラーメッセージの状態を管理
const router = useRouter();

const dismissError = () => {
	errorMessage.value = '';
};

const joinLobby = async () => {
	errorMessage.value = ''; // エラーメッセージをリセット

	try {
		// ロビーIDを検証して取得する
		const { data: lobby, error } = await supabase
			.from('lobbies')
			.select('lobby_id, is_closed')
			.eq('lobby_id', lobbyId.value) // lobby_idが一致するものを取得
			.single();

		if (error || !lobby) {
			errorMessage.value = 'IDが正しくないか、ロビーが存在しません。';
			return;
		}

		// ロビーが終了している場合
		if (lobby.is_closed) {
			errorMessage.value = 'このロビーは終了しているため、参加できません。';
			return;
		}

		// ロビー画面に遷移 (lobby_idをURLパスに含める)
		router.push(`/lobby/${lobby.lobby_id}`);
	} catch (err) {
		errorMessage.value = 'ロビーへの参加中にエラーが発生しました。';
	}
};
</script>