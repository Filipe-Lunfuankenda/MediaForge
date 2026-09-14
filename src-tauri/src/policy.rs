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
