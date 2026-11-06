const repository = 'roziboyahmadaliyev1310-sy/web-programming';
const branch = 'main';
const submoduleRepositories = {
  'group project/test': 'roziboyahmadaliyev1310-sy/test',
};
const statusMessage = document.getElementById('download-status');

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function fetchGitHubJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while looking up folder files.`);
  }
  return response.json();
}

async function getRepositoryTree(repo, ref) {
  const tree = await fetchGitHubJson(
    `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
  );
  if (tree.truncated) {
    throw new Error('This folder contains too many files to prepare as a ZIP.');
  }
  return tree.tree;
}

async function addFilesToZip(zip, files, repo, ref, prefix = '') {
  const batchSize = 5;
  for (let index = 0; index < files.length; index += batchSize) {
    const batch = files.slice(index, index + batchSize);
    await Promise.all(batch.map(async (file) => {
      const url = `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(ref)}/${encodePath(file.path)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not download ${file.path} (${response.status}).`);
      }
      zip.file(`${prefix}${file.path}`, await response.arrayBuffer());
    }));
  }
}

async function downloadFolder(folder, button) {
  if (!window.JSZip) {
    throw new Error('The ZIP tool did not load. Check your internet connection and try again.');
  }

  button.disabled = true;
  statusMessage.textContent = `Preparing ${folder} ZIP…`;

  try {
    const tree = await getRepositoryTree(repository, branch);
    const prefix = `${folder}/`;
    const folderFiles = tree.filter((entry) => (
      entry.type === 'blob' && entry.path.startsWith(prefix)
    ));
    const submodules = tree.filter((entry) => (
      entry.type === 'commit' && entry.path.startsWith(prefix)
    ));
    const zip = new window.JSZip();

    await addFilesToZip(zip, folderFiles, repository, branch);

    for (const submodule of submodules) {
      const submoduleRepo = submoduleRepositories[submodule.path];
      if (!submoduleRepo) {
        throw new Error(`The ZIP does not support the nested repository at ${submodule.path}.`);
      }
      const submoduleTree = await getRepositoryTree(submoduleRepo, submodule.sha);
      const submoduleFiles = submoduleTree.filter((entry) => entry.type === 'blob');
      const zipPath = submodule.path.slice(prefix.length);
      await addFilesToZip(zip, submoduleFiles, submoduleRepo, submodule.sha, `${zipPath}/`);
    }

    if (Object.keys(zip.files).length === 0) {
      throw new Error(`No files were found for ${folder}.`);
    }

    statusMessage.textContent = `Building ${folder} ZIP…`;
    const archive = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(archive);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${folder.replaceAll('/', '-')}.zip`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    statusMessage.textContent = `${folder} ZIP downloaded.`;
  } finally {
    button.disabled = false;
  }
}

document.querySelectorAll('.download-button').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await downloadFolder(button.dataset.folder, button);
    } catch (error) {
      console.error('Folder download failed:', error);
      statusMessage.textContent = error instanceof Error
        ? `Download failed: ${error.message}`
        : 'Download failed. Please try again.';
    }
  });
});
