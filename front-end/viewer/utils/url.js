/* eslint no-cond-assign: 0 */
// Dropbox shared files, converts links from:
// https://www.dropbox.com/s/isgyjgaulci4w3x/data.csv?dl=0 to:
// https://www.dropbox.com/s/isgyjgaulci4w3x/data.csv?dl=1
const dropboxShareRegexp = /^(https?:\/\/www\.dropbox\.com\/.+\?dl=)0$/;

// Google Drive shared files, converts links from:
// https://drive.google.com/file/d/0B8VUXsoIMe56bW9SaU4ycmJ1MkU/view?usp=sharing or
// https://drive.google.com/open?id=0B8VUXsoIMe56bW9SaU4ycmJ1MkU to:
// https://drive.google.com/uc?export=download&confirm=no_antivirus&id=0B8VUXsoIMe56bW9SaU4ycmJ1MkU
const googleDriveRegexp = /^https?:\/\/drive\.google\.com\/(?:.*file\/d\/|open\?id=)([^\/]+)\/?.*$/;

// Google Spreadsheets files, converts links from:
// https://docs.google.com/spreadsheets/d/1BzQjYoBnkWxR7h9jX-m5_9uUXdHHNW40K-UvlaFYvkQ/edit?usp=sharing to:
// https://docs.google.com/spreadsheets/d/1BzQjYoBnkWxR7h9jX-m5_9uUXdHHNW40K-UvlaFYvkQ/export?format=csv
const googleSpreadsheetRegexp = /^(https?:\/\/docs\.google\.com\/spreadsheets\/d\/.+)\/(.*)$/;

// Figshare files, converts links from:
// https://figshare.com/s/add1e9fd99dfcfae987f to:
// https://ndownloader.figshare.com/files/4850722?private_link=ff1c38e57795230d9c4c
const figshareRegexp = /^https?:\/\/figshare\.com\/s\/(.+)$/;

function showFigsgareWarning() {
  const snackbarContainer = document.querySelector('#mr-snackbar');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: 'Computer says no!',
    timeout: 6000,
    actionHandler: () => {},
    actionText: 'Learn more',
  });
}

function rewriteUrl(url) {
  let match = null;
  if ((match = dropboxShareRegexp.exec(url)) && match[1]) {
    return {
      type: 'dropbox',
      url: `${match[1]}1`,
    };
  }

  if ((match = googleDriveRegexp.exec(url)) && match[1]) {
    return {
      type: 'google-drive',
      url: `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${match[1]}`,
    };
  }

  if ((match = googleSpreadsheetRegexp.exec(url)) && match[1]) {
    if (/^pub/.test(match[2])) {
      return {
        type: 'google-spreadsheet',
        url: `${match[1]}/pub?output=csv&format=csv`,
      };
    }
    return {
      type: 'google-spreadsheet',
      url: `${match[1]}/export?output=csv&format=csv`,
    };
  }

  if ((match = figshareRegexp.exec(url)) && match[1]) {
    showFigsgareWarning();
    return {
      type: 'figshare',
      url: '',
    };
  }

  return {
    type: null,
    url,
  };
}

export default {
  rewriteUrl,
};
