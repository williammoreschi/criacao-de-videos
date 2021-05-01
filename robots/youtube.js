const express = require('express');
const google = require('googleapis').google;
const fs = require('fs');
const youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;
const state = require('./state');

async function robot(){
  console.log('> [youtube-robot] Starting...');
  const content = state.load();

  await authenticationWithOAuth();
  const videoInformation = await uploadVideo(content);
  await uploadThumbnail(videoInformation);
  
  async function authenticationWithOAuth(){
    const webServer = await startWebServer();
    const OAuthClient = await createOAuthClient();
    requestUserContent(OAuthClient);
    const authorizationToken = await waitForGoogleCallback(webServer);
    await requestGoogleForAccessTokens(OAuthClient,authorizationToken);
    setGlobalGoogleAuthentication(OAuthClient);
    await stopWebServer(webServer);
   

    async function startWebServer() {
      return new Promise((resolve, reject) => {
        const port = 5000;
        const app = express();

        const server = app.listen(port, () => {
          console.log(`> [youtube-robot] Listening on http://localhost:${port}`);
          resolve({
            app,
            server,
            port
          })
        })
      })
    }
  
    async function createOAuthClient(){
      const credentials = require('../credentials/google-youtube.json');
      const OAuthClient = new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
      );
      return OAuthClient;
    }

    function requestUserContent(OAuthClient){
      const consentUrl = OAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube']
      });

      console.log(`> [youtube-robot] Please give your consent: ${consentUrl}`);
    }

    async function waitForGoogleCallback(webServer){
      return new Promise((resolve,reject) => {
        console.log('> [youtube-robot] Waiting for user consent...');

        webServer.app.get('/oauth2callback',(req,res) => {
          const authCode = req.query.code;
          console.log(`> [youtube-robot] Consent given: ${authCode}`);

          res.send(`<h1>Thank you!!!</h1><p>Now close this tab.</p>`);
          resolve(authCode);
        });
      });
    } 

    async function requestGoogleForAccessTokens(OAuthClient,authorizationToken){
      return new Promise((resolve,reject) => {
        OAuthClient.getToken(authorizationToken, (error,tokens) => {
          if(error){
            return reject(error);
          }
          
          console.log('> [youtube-robot] Access tokens received!');
          
          OAuthClient.setCredentials(tokens);
          resolve();
        });
      });
    } 

    function setGlobalGoogleAuthentication(OAuthClient) {
      google.options({
        auth: OAuthClient
      });
    }

    async function stopWebServer(webServer) {
      return new Promise((resolve, reject) => {
        webServer.server.close(() => {
          resolve();
        })
      })
    }

  }

  async function uploadVideo(content){
    const videoFilePath = './content/video-maker.mov';
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `${content.prefix} ${content.searchTerm}`;
    const videoTags = [content.searchTerm, ...content.sentences[0].keywords];
    const videoDescription = content.sentences.map((sentence) => {
      return sentence.text;
    }).join('\n\n');

    const requestParameters = {
      part: 'snippet, status',
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags
        },
        status:{
          privacyStatus: 'unlisted'
        }
      },
      media: {
        body: fs.createReadStream(videoFilePath)
      }
    };
    console.log('> [youtube-robot] Starting to upload the video to YouTube');

    const youtubeResponse = await youtube.videos.insert(requestParameters,{
        onUploadProgress: onUploadProgress
      }
    );

    console.log(`> [youtube-robot] Video available at: https://youtu.be/${youtubeResponse.data.id}`);
    return youtubeResponse.data;

    function onUploadProgress(event){
      const progress = Math.round((event.bytesRead / videoFileSize) * 100 );
      console.log(`> [youtube-robot] ${progress}% completed`);
    }
  }
  
  async function uploadThumbnail(videoInformation) {
    const videoId = videoInformation.id
    const videoThumbnailFilePath = './content/youtube-thumbnail.jpg'

    const requestParameters = {
      videoId: videoId,
      media: {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(videoThumbnailFilePath)
      }
    }

    await youtube.thumbnails.set(requestParameters)
    console.log(`> [youtube-robot] Thumbnail uploaded!`);
  }
}

module.exports = robot;