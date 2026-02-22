export class MusicService {
    // Mock 'play' function that simulates connecting to Spotify
    static async play(preference: string) {
        console.log(`[MusicService] 🎵 Playing music based on preference: ${preference}`);

        // In the future, this will call Spotify Web API
        // await spotifyApi.play({ context_uri: getPlaylistForGenre(preference) });

        return Promise.resolve();
    }

    static async pause() {
        console.log(`[MusicService] ⏸️ Paused`);
    }
}





