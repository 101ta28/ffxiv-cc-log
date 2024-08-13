import { defineStore } from 'pinia';

export const useLobbyStore = defineStore('lobby', {
	state: () => ({
		lobbyId: null,
	}),
	actions: {
		setLobbyId(id) {
			this.lobbyId = id;
		},
		clearLobbyId() {
			this.lobbyId = null;
		},
	},
});
