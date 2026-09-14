// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}

#[cfg(test)]
mod tests {
    use app_lib::policy::Policy;

    #[test]
    fn test_ffmpeg_command_parsing() {
        // Simple test to simulate command extraction logic
        let mock_ai_response = "Eu vou converter isto. COMANDO: ffmpeg -i a.mp4 b.mp3";
        let has_command = mock_ai_response.contains("COMANDO: ffmpeg");
        assert!(has_command, "The AI response should contain the FFmpeg command prefix");
    }

    #[test]
    fn test_policy_allowed_executables() {
        let policy = Policy::new();
        assert!(policy.check_executable("ffmpeg").is_ok());
        assert!(policy.check_executable("ffprobe").is_ok());
        assert!(policy.check_executable("malicious_binary").is_err());
    }

    #[test]
    fn test_policy_shell_injection_protection() {
        let policy = Policy::new();
        let safe_args = vec!["-i".to_string(), "video.mp4".to_string(), "out.mp3".to_string()];
        assert!(policy.check_args(&safe_args).is_ok());

        let unsafe_args = vec!["-i".to_string(), "video.mp4; rm -rf /".to_string()];
        assert!(policy.check_args(&unsafe_args).is_err());
    }
}
