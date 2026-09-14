use std::sync::Mutex;

pub struct Policy {
    pub allowed_paths: Mutex<Vec<String>>,
    pub allowed_commands: Vec<&'static str>,
}

impl Policy {
    pub fn new() -> Self {
        Self {
            allowed_paths: Mutex::new(vec![]),
            allowed_commands: vec![
                "ffmpeg", "ffprobe", "ls", "dir", "cp", "copy", "mkdir", "mv", "move", "cat", "echo", "pwd", "cd"
            ],
        }
    }
    
    pub fn check_executable(&self, exe: &str) -> Result<(), String> {
        if !self.allowed_commands.contains(&exe) {
            return Err(format!("Security Violation: Executable '{}' is not allowed.", exe));
        }
        Ok(())
    }

    pub fn check_args(&self, argv: &[String]) -> Result<(), String> {
        for arg in argv {
            if arg.contains(';') || arg.contains('&') || arg.contains('|') || arg.contains('$') || arg.contains('`') {
                return Err("Invalid argument: contains shell metacharacters".into());
            }
        }
        Ok(())
    }
    
    pub fn ensure_readable(&self, _path: &str) -> Result<(), String> {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
