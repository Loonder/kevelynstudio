export class AudioService {
    private static WELCOME_AUDIO_PATH = "/assets/audio/welcome.mp3"; // Fixed audio file

    static playWelcome() {
        return new Promise<void>((resolve, reject) => {
            try {
                const audio = new Audio(this.WELCOME_AUDIO_PATH);
                audio.volume = 1.0;

                audio.onended = () => {
                    resolve();
                };

                audio.onerror = (e) => {
                    console.error("Audio playback error:", e);
                    // Don't reject, just resolve so flow continues
                    resolve();
                };

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Auto-play prevented:", error);
                        resolve();
                    });
                }
            } catch (error) {
                console.error("AudioService Error:", error);
                resolve();
            }
        });
    }
}





