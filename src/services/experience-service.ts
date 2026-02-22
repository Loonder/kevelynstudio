import { AudioService } from "./audio-service";
import { MusicService } from "./music-service";

type Client = {
    name: string;
    sensoryPreferences: {
        favoriteMusic?: string;
    };
};

export class ExperienceService {

    // The Main Orchestrator Function
    static async welcomeClient(client: Client, onVisualUpdate: (message: string) => void) {
        console.log(`[Experience] Starting welcome sequence for ${client.name}`);

        // 1. Visual Welcome
        onVisualUpdate(client.name);

        // 2. Play Fixed Welcome Audio
        await AudioService.playWelcome();

        // 3. Start Client's Favorite Music (Mock)
        if (client.sensoryPreferences?.favoriteMusic) {
            await MusicService.play(client.sensoryPreferences.favoriteMusic);
        }

        console.log(`[Experience] Welcome sequence completed.`);
    }
}





