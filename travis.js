const travisLogoUrl = 'https://travis-ci.com/images/logos/TravisCI-Full-Color.png';
const branchIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Octicons-git-branch.svg/480px-Octicons-git-branch.svg.png';
const pullRequestIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Octicons-git-pull-request.svg/768px-Octicons-git-pull-request.svg.png';

const travisLogoRequest = new Request(travisLogoUrl);
const travisLogo = await travisLogoRequest.loadImage();
const branchIconRequest = new Request(branchIconUrl);
const branchIcon = await branchIconRequest.loadImage();
const prIconRequest = new Request(pullRequestIconUrl);
const prIcon = await prIconRequest.loadImage();

const requestLimits = {
  small: 5,
  medium: 8,
  large: 20,
};

const buildStatus = {
  passed: '🟢',
  cancelled: '⚪️',
  failed: '🔴',
  unknown: '❓'
};

const widget = new ListWidget()

try {
  const params = JSON.parse(args.widgetParameter);

  if (checkRequiredParams(params)) {
    await buildWidget(params)
  } else {
    displayMessage('Missing config data, repository and token required.');
  }
} catch (e) {
  displayMessage(`Invalid config: ${e.message}`);
}

if (!config.runsInWidget) {
  switch (config.widgetFamily) {
    case 'small':
      await widget.presentSmall();
      break;
    case 'medium':
      await widget.presentMedium();
      break;
    case 'large':
      await widget.presentLarge();
      break;
    default:
      await widget.presentLarge();
    }
}
Script.setWidget(widget)
Script.complete()

async function buildWidget(params) {
    widget.setPadding(10,10,10,10)
    widget.spacing = 3;
    
    await displayHeader(params.repository);
    
    const buildData = await fetchBuilds(params.repository, params.token);
    if (buildData) {
      const buildSummary = listBuilds(buildData);
      for (const build of buildSummary) {
        displayBuildInfo(build);
      }
    } else {
      displayMessage('No data!');
    }
}

function listBuilds(jsonData) {
  const { builds } = jsonData;
  if (!builds) {
    return [];
  } else {
    return builds.reduce((acc, curr) => {
      const { state, pull_request_number: prId, repository, commit, branch } = curr;
      const { slug: repoSlug } = repository;
      const { message: commitMessage } = commit;
      const { name: branchName } = branch;
    
      acc.push({ state, repoSlug, commitMessage, branchName, prId});
      return acc;
    }, []);
  }
}

async function fetchBuilds(repo, accessToken) {
  const uriEncodedRepo = encodeURIComponent(repo);
  const baseUrl = "https://api.travis-ci.com";
  const buildsUrl = `${baseUrl}/repo/${uriEncodedRepo}/builds?limit=${requestLimits[config.widgetFamily] || 5}`;
  const req = new Request(buildsUrl);
  req.headers = {
    'Travis-API-Version': '3',
    'User-Agent': 'ci-widget',
    'Authorization': `token ${accessToken}`
  };
  return await req.loadJSON();
}

async function displayHeader(repoName) {  
  const titleFontSize = 12;

  const header = widget.addStack();
  if (repoName) {
    const repoText = header.addText(repoName);
    repoText.font = Font.mediumRoundedSystemFont(titleFontSize);
  }
  header.addSpacer();
  const logoImage = header.addImage(travisLogo)
  logoImage.imageSize = new Size(40, 12)
}

function displayBuildInfo(build) {
  const branchFontSize = 10;
  const iconSize = 8;

  const infoStack = widget.addStack();
  let typeIcon;
  if (build.prId) {
    typeIcon = infoStack.addImage(prIcon);
  } else {
    typeIcon = infoStack.addImage(branchIcon);
  }
  typeIcon.imageSize = new Size(12, 12)
  const textWidget = infoStack.addText(build.branchName);
  textWidget.font = Font.mediumRoundedSystemFont(branchFontSize);
  infoStack.addSpacer();
  const buildState = buildStatus[build.state] || buildStatus.unknown;
  const statusWidget = infoStack.addText(buildState);
  statusWidget.font = Font.mediumRoundedSystemFont(iconSize);
}

function displayMessage(messageText) {
  const messageFontSize = 10;

  const textWidget = widget.addText(messageText);
  textWidget.font = Font.mediumRoundedSystemFont(messageFontSize);
}

function checkRequiredParams(params) {
  if (!params) {
    return false;
  }
  
  if ('token' in params && 'repository' in params) {
    return true;
  }
  return false;
}
