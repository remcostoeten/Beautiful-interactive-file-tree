import os
import json
import argparse
from pathlib import Path
from typing import Dict, Any

def detect_language(file_path: str) -> str:
    """Detect programming language based on file extension."""
    extensions = {
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.py': 'python',
        '.go': 'go',
        '.rs': 'rust',
        '.json': 'json',
        '.css': 'css',
        '.scss': 'scss',
        '.html': 'html',
        '.md': 'markdown',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.lock': 'yaml'
    }
    return extensions.get(Path(file_path).suffix.lower(), 'plaintext')

def read_file_content(file_path: str, max_length: int = 500000) -> str:
    """Read file content with proper encoding handling and length limit."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read(max_length)
            
            if len(content) >= max_length:
                return "// File content too large to display"
            
            file_ext = Path(file_path).suffix.lower()
            
            # For CSS files, return the content directly
            if file_ext == '.css':
                return content
            
            # For TypeScript/TSX/JavaScript files
            if file_ext in ['.ts', '.tsx', '.js', '.jsx']:
                # Normalize line endings and split into lines
                lines = content.replace('\r\n', '\n').split('\n')
                # Join with explicit newline characters
                return '\n'.join(lines)
            
            # For other files, use standard JSON escaping
            return json.dumps(content)[1:-1]
            
    except UnicodeDecodeError:
        return "Binary file not shown"
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}")
        return ""

def should_ignore(path: str) -> bool:
    """Check if path should be ignored."""
    ignore_patterns = {
        '.git', 'node_modules', '__pycache__', 
        'build', 'dist', '.next', '.env',
        '.DS_Store', 'thumbs.db'
    }
    parts = Path(path).parts
    return any(part in ignore_patterns for part in parts)

def scan_directory(path: str, max_file_size: int = 1024 * 1024) -> Dict[str, Any]:
    """Recursively scan directory and create IDE-compatible structure."""
    path_obj = Path(path)
    
    if should_ignore(path):
        return None
        
    if path_obj.is_file():
        # Skip files larger than max_file_size
        if path_obj.stat().st_size > max_file_size:
            content = "// File too large to display"
        else:
            content = read_file_content(str(path_obj))
        
        language = detect_language(path_obj.name)
        
        return {
            'name': path_obj.name,
            'type': 'file',
            'content': content,
            'language': language
        }
    
    children = []
    try:
        for item in sorted(path_obj.iterdir()):
            result = scan_directory(str(item), max_file_size)
            if result:
                children.append(result)
    except Exception as e:
        print(f"Error scanning directory {path}: {e}")
        return None
    
    return {
        'name': path_obj.name,
        'type': 'directory',
        'children': children
    }

def generate_ide_props(directory: str) -> str:
    """Generate IDE props from directory structure."""
    structure = scan_directory(directory)
    
    # Create the complete structure with project root
    ide_props = {
        'name': 'project-root',
        'type': 'directory',
        'children': [structure] if structure['name'] != 'project-root' else structure['children']
    }
    
    # Generate TypeScript output with proper formatting
    ts_output = """// This file is auto-generated. Do not edit manually.
export type FileExplorer = {
  name: string;
  type: "file" | "directory";
  children?: FileExplorer[];
  content?: string;
  language?: string;
}

export const projectStructure: FileExplorer = """

    def process_content(obj):
        if isinstance(obj, dict):
            result = {}
            for key, value in obj.items():
                if key == 'content' and isinstance(value, str):
                    # Don't escape already prepared content
                    result[key] = value
                else:
                    result[key] = process_content(value)
            return result
        elif isinstance(obj, list):
            return [process_content(item) for item in obj]
        else:
            return obj

    # Process the content before JSON encoding
    processed_props = process_content(ide_props)
    
    # Convert to JSON with proper indentation
    json_str = json.dumps(processed_props, indent=2, ensure_ascii=False)
    
    ts_output += json_str

    return ts_output

def main():
    parser = argparse.ArgumentParser(description='Generate IDE props from directory structure')
    parser.add_argument('directory', help='Directory to scan')
    parser.add_argument('--output', '-o', help='Output file (defaults to tree-object.ts)')
    args = parser.parse_args()
    
    output_file = args.output or 'src/core/config/tree-object.ts'
    
    try:
        props = generate_ide_props(args.directory)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(props)
        print(f"Successfully generated IDE structure in {output_file}")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == '__main__':
    main()
