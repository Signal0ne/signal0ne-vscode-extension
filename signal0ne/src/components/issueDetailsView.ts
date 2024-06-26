import * as vscode from 'vscode';
import { join } from 'path';
import { Signal0neProvider } from '../auth/signal0ne.provider';
import { USER_API_URL } from '../data/const';
import markdownit from 'markdown-it';

export let issueDetailsSidePanel: vscode.WebviewPanel;

let isPanelInit = false;
const md = markdownit();

export async function createIssueDetailsView(
  issue: any,
  signal0neProvider: Signal0neProvider,
  forcePanelClose?: boolean
): Promise<void> {
  const sessions = await signal0neProvider.getSessions();
  const accessToken = sessions[0].accessToken;
  const onDiskPath = vscode.Uri.file(
    join(__dirname, '..', '..', 'resources', 'signal_img_logo.svg')
  );

  if (!isPanelInit) {
    issueDetailsSidePanel = vscode.window.createWebviewPanel(
      'signal0ne',
      'Issue Details',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
      }
    );

    issueDetailsSidePanel.onDidDispose(() => {
      issue = null;
      isPanelInit = false;
    }, null);

    issueDetailsSidePanel.iconPath = onDiskPath;
    issueDetailsSidePanel.webview.html = getWebviewContent(issue, accessToken);

    isPanelInit = true;
  } else {
    issueDetailsSidePanel.iconPath = onDiskPath;
    issueDetailsSidePanel.webview.html = getWebviewContent(issue, accessToken);
  }

  if (forcePanelClose) {
    issueDetailsSidePanel.dispose();
  }
}

const generateSources = (issue: any) => {
  if (issue.logs?.length) {
    return issue.logs
      .map((log: string) => {
        if (log) {
          return `<p class="source-paragraph">${log}</p>`;
        } else {
          return '';
        }
      })
      .join('');
  } else {
    return "<p>Sorry we couldn't generate sources for you</p>";
  }
};

const generateSourcesLinks = (issue: any) => {
  if (issue.issuePredictedSolutionsSources?.length) {
    return issue.issuePredictedSolutionsSources
      .map((link: string) => {
        return `<a class="source-link" target="blank" href="${link}">${link}</a>`;
      })
      .join('');
  } else {
    return "<p>Sorry we couldn't generate sources links for you</p>";
  }
};

function getWebviewContent(issue: any, accessToken: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Issue details</title>
      <style>
        .sources {
            overflow-y: auto;
            max-height: 100px;
            border: 1px solid white;
            padding: 12px;
            width: 90%;
        }

        .source-paragraph {
          margin-bottom: 8px;
          margin-top: 0;
        }

        .source-paragraph:last-child {
          margin-bottom: 0px;
        }

        .sources-title {
            margin-top: 0;
        }

        .source-link {
            padding: 12px;
            border: 1px solid white;
            border-radius: 8px;
            display: block;
            margin-bottom: 12px;
            width: 90%;
            word-wrap: break-word
        }

        .container {
            width: 100%;
        }

        .tooltip-text {
            visibility: hidden;
            position: absolute;
            top: 40px;
            left: -40px;
            width: max-content;
            z-index: 1;
            color: black;
            font-size: 12px;
            background-color: white;;
            border-radius: 16px;
            padding: 10px 15px 10px 15px;
            box-shadow: 0px 2px 8px 0px #0000001F;
            display: inline-block;
          }
        
          .hover-text {
            position: relative;
          }
        
          .hover-text:hover .tooltip-text {
            visibility: visible;
          }

          .icons-container {
            display: flex;
            align-items: center;
            margin-top: 16px;
          }

          .likes-container {
            align-items: center;
            border: 1px solid lightgray;
            border-radius: 8px;
            display: flex;
            font-size: 1.5rem;
            height: 3rem;
            justify-content: space-around;
            padding: 0 8px;
            width: 4rem;
          }

          .likes-container svg {
            cursor: pointer;
          }

          .divider {
            background-color: lightgray;
            height: 2rem;
            width: 1px;
          }

          .reload-button {
            align-items: center;
            border-radius: 50%;
            display: flex;
            height: 2rem;
            justify-content: center;
            margin-left: 1rem;
            width: 2rem;
          }

          .reload-button.resolved {
            background-color: #1f6e01 !important;
            color: white !important;
          }

          .btn {
            border-radius: 16px;
            padding: 4px 6px;
            transition: .5s;
            border: 1px solid lightgray;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .btn:disabled {
            background-color: #BDBDBD;
            border: none !important;
          }
        
          .btn-secondary {
            border: 1px solid white;;
            background-color: transparent !important;
            color: white;

            svg {
                fill: white;
                transition: .5s;
            }
          }

          .btn-secondary:focus-visible, .btn-secondary:hover {
            background-color: white !important;
            color: black;

            svg {
                fill: black;
            }
          }

          .btn-primary {
            border: 1px solid #3f51b5;
            background-color: #3f51b5;
          }

          .btn-primary:focus-visible, .btn-primary:hover {
            background-color: #1f3195;
          }

          .mr-10 {
            margin-right: 10px;
          }

          .d-flex {
            display: flex;
          }

          .like {
            cursor: pointer;
            opacity: .3;
            transition: 0.5s all;
          }

          .like.score-selected {
            opacity: 1;
          }

          .d-none {
            display: none !important;
          }

          .d-block {
            display: block !important;
          }

          .loader {
            position: absolute;
            top: calc(50% - 60px);
            left: calc(50% - 60px);
            border: 16px solid transparent;
            border-top: 16px solid #3f51b5;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 1s ease-in infinite;
            z-index: 10;
            display: none;
          }
          
          .loader-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: transparent;
            z-index: 2;
            opacity: .5;
            display: none;
          }
          
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
      </style>
  </head>
  <body>
    <div id="loader" class="loader"></div>
    <div id="loader-background" class="loader-background"></div> 
    <div class="container">
        <h2>Insights: </h2>
        <p id="log-summary-container">${
          issue.logSummary || "Sorry we couldn't generate summary for you"
        }</p>

        <h2 class="sources-title">Logs</h2>
        <div class="sources">
          <div id="sources-container">
            ${generateSources(issue)}
          </div>
        </div>
        <p id="predicted-solutions-containers">
          ${
            issue.predictedSolutionsSummary
              ? md.render(issue.predictedSolutionsSummary)
              : "Sorry we couldn't generate proposed solution for you"
          }
        </p>
        <h2>Sources: </h2>
        <div id="sources-links-container">
          ${generateSourcesLinks(issue)}
        </div>
    </div>
    <div class="icons-container">
        <div class="likes-container">
            <svg id="score-positive" class="${
              issue.score === 1
                ? 'bi bi-hand-thumbs-up d-flex align-items-center justify-content-center like score-selected'
                : 'bi bi-hand-thumbs-up d-flex align-items-center justify-content-center like'
            }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
            </svg>
            <div class="divider"></div>
            <svg id="score-negative" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="${
              issue.score === -1
                ? 'bi bi-hand-thumbs-up d-flex align-items-center justify-content-center like score-selected'
                : 'bi bi-hand-thumbs-up d-flex align-items-center justify-content-center like'
            }">
                <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/>
            </svg>
        </div>
        <span class="hover-text mr-10">
            <button id="resolve-button" class="${
              issue.isResolved
                ? 'btn btn-secondary reload-button resolved'
                : 'btn btn-secondary reload-button'
            }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>
                <span class="tooltip-text" id="top">Mark issue as resolved</span>
            </button>
        </span>
        <span class="hover-text mr-10">
            <button class="btn btn-secondary" id="regenerate-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
                <span class="tooltip-text" id="top">Regenerate issue</span>
            </button>   
        </span>          
    </div>
  </div>
  <script>
    const accessToken = "${accessToken}"
    const issueId = "${issue.id}";
    const USER_API_URL = "${USER_API_URL}";
    let isResolved = "${issue.isResolved}" === "true";
    let score = +"${issue.score}";

    document.getElementById('resolve-button').addEventListener('click', markIssueAsResolved)
    document.getElementById('score-negative').addEventListener('click', rateIssueNegative)
    document.getElementById('score-positive').addEventListener('click', rateIssuePositive)
    document.getElementById('regenerate-button').addEventListener('click', regenerateIssue)

    async function markIssueAsResolved() {
        const options = {
          headers: {
            'Authorization': "Bearer " + accessToken,
            'Content-Type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify({
            isResolved: !isResolved
          })
        };
        const res = await fetch(USER_API_URL + "/issues/" + issueId + "/resolve", options);
        if (res.ok) {
          isResolved = !isResolved;
          if (isResolved) {
            document.getElementById('resolve-button').classList.add('resolved');
          } else {
            document.getElementById('resolve-button').classList.remove('resolved');
          }
        }
      }

      async function rateIssuePositive() {
          const options = {
            headers: {
              'Authorization': "Bearer " + accessToken,
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
              score: score === 1 ? 0 : 1
            })
          };
          const res = await fetch(USER_API_URL + "/issues/" + issueId + "/score", options);
          if (res.ok) {
            if (score === 1) {
              score = 0;
              document.getElementById('score-positive').classList.remove('score-selected');
              document.getElementById('score-negative').classList.remove('score-selected');
            } else {
              score = 1;
              document.getElementById('score-positive').classList.add('score-selected');
              document.getElementById('score-negative').classList.remove('score-selected');
            }
          }
        }

        async function rateIssueNegative() {
            const options = {
              headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
              },
              method: 'PUT',
              body: JSON.stringify({
                score: score === -1 ? 0 : -1
              })
            };
            const res = await fetch(USER_API_URL + "/issues/" + issueId + "/score", options);
            if (res.ok) {
              if (score === -1) {
                score = 0;
                document.getElementById('score-negative').classList.remove('score-selected');
                document.getElementById('score-positive').classList.remove('score-selected');
              } else {
                score = -1;
                document.getElementById('score-negative').classList.add('score-selected');
                document.getElementById('score-positive').classList.remove('score-selected');
              }
            }
          }

          async function regenerateIssue() {
            const options = {
              headers: {
                'Authorization': "Bearer " + accessToken,
                'Content-Type': 'application/json'
              },
              method: 'PUT'
            };
            toggleLoader(true);
            const res = await fetch(USER_API_URL + "/issues/" + issueId + "/regenerate", options);
            const body = await res.json();
            toggleLoader(false);
            if (res.ok) {
              document.getElementById('log-summary-container').innerHTML = body.logSummary || "Sorry we couldn't generate summary for you";
              document.getElementById('predicted-solutions-containers').innerHTML = body.predictedSolutionsSummary || "Sorry we couldn't generate proposed solution for you";
              document.getElementById('sources-container').innerHTML = generateSources(body);
              document.getElementById('sources-links-container').innerHTML = generateSourcesLinks(body);
            }
          }

          function toggleLoader(loaderState) {
            const loader = document.getElementById('loader')
            const loaderBackground = document.getElementById('loader-background')
            if (loaderState) {
              loader.classList.add('d-block');
              loaderBackground.classList.add('d-block');
            } else {
              loader.classList.remove('d-block');
              loaderBackground.classList.remove('d-block');
            }
          }

          const generateSources = (issue) => {
            if (issue.logs?.length) {
              return issue.logs.map((log) => {
                if (log) {
                  return '<p class="source-paragraph">' + log + '</p>';
                } else {
                  return '';
                }
              }).join('');
            } else {
              return "<p>Sorry we couldn't generate sources for you</p>"
            }
          }
          
          const generateSourcesLinks = (issue) => {
            if (issue.issuePredictedSolutionsSources?.length) {
              return issue.issuePredictedSolutionsSources.map((link) => {
                return '<a class="source-link" target="blank" href="' + link + '">' + link + '</a>';
              }).join('');
            } else {
              return "<p>Sorry we couldn't generate sources links for you</p>";
            }
          }
    </script>
  </body>
  </html>`;
}
