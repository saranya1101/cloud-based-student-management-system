import JSZip from 'jszip';
import { PROJECT_SOURCE_FILES } from '../data/sourceCodeFiles';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Create folder hierarchy and write files
  for (const file of PROJECT_SOURCE_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate binary zip file
  const blob = await zip.generateAsync({ type: 'blob' });

  // Trigger download in browser
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cloud-student-management-system.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
