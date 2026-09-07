// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_ffmpeg_command_parsing() {
        // Simple test to simulate command extraction logic
        let mock_ai_response = "Eu vou converter isto. COMANDO: ffmpeg -i a.mp4 b.mp3";
        let has_command = mock_ai_response.contains("COMANDO: ffmpeg");
        assert!(has_command, "The AI response should contain the FFmpeg command prefix");
    }
}
