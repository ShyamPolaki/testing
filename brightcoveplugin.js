videojs("myPlayerID").ready(function () {
                        var myPlayer,
                            requestData,
                            apiBaseURL = 'https://edge.api.brightcove.com/playback/v1/accounts/',
                            policyKey =
                                "BCpkADawqM1iQwn_T-28lpe64p6ilWOzcKyvvAwIv0Pl40UjwcJyRfBF1qMts5Io-uzhg5_j4kH61pW8j-OyrgDyBVMNUAG1XYQFjlMj2GY7W50IgUXCJoeWFC2JCgR49BkAIqb0sFnTyydh",
                            videoData = [];
                        /**
                         * wait for the video metadata to load
                         */
                        videojs("myPlayerID").one('loadedmetadata', function () {
                            myPlayer = this;
                            // set up the Playback API request
                            requestData = setRequestData();
                            // make the Playback API request
                            getRelatedVideos(requestData, function (relatedVideos) {
                                // extract the needed video data into an array
                                videoData = extractVideoData(relatedVideos);
                                // generate the HTML for the overlay
                                videoList = createVideoList(videoData);
                                // add the overlay
                                addOverlayText(videoList);
                            });
                        });
                        /**
                         * set up the Playback API request
                         */
                        function setRequestData() {
                            var endPoint = '',
                                accountId,
                                videoName,
                                requestURL,
                                endPoint,
                                tagValue,
                                requestData = {},
                                dataReturned = false;
                            // use the mediainfo object to get the account id, tag value and video name for the video currently loaded in the player
                            accountId = myPlayer.mediainfo.account_id;
                            //tagValue = myPlayer.mediainfo.tags[0];
                            videoName = myPlayer.mediainfo.name;
                            // add the account id and videos search term to the base URL. Note that your policy key needs to be enabled for search or you will get an error with the request.
                            requestURL = apiBaseURL + accountId + '/videos';
                            // return up to 9 videos which have a tag value equal to the current video, excluding the current video by name
                            //endPoint = '?q=tags:"' + "gg" + '" -name:"' + videoName + '"&limit=9';
                            // add the query string to the request URL
                            requestData.url = requestURL;
                            //requestData.url = requestURL + endPoint;
                            // set the request type to GET
                            requestData.requestType = 'GET';
                            return requestData;
                        }
                        /**
                         * request data from the Playback API
                         */
                        getRelatedVideos = function (options, callback) {
                            var httpRequest = new XMLHttpRequest(),
                                responseData,
                                parsedData,
                                // response handler
                                getResponse = function () {
                                    try {
                                        if (httpRequest.readyState === 4) {
                                            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                                                responseData = httpRequest.responseText;
                                                parsedData = JSON.parse(responseData);
                                                callback(parsedData);
                                            } else {
                                                alert('There was a problem with the request. Request returned ' + httpRequest.status);
                                            }
                                        }
                                    } catch (e) {
                                        alert('Caught Exception: ' + e);
                                    }
                                };
                            // set the response handler
                            httpRequest.onreadystatechange = getResponse;
                            // open the request
                            httpRequest.open('GET', requestData.url);
                            // set the headers
                            httpRequest.setRequestHeader('Accept', 'application/json;pk=' + policyKey);
                            // open and send the request
                            httpRequest.send();
                        };
                        /**
                         * extract video data from Playback API response
                         * @param {array} playbackData the data from the Playback API
                         * @return {array} videoData array of video info
                         */
                        function extractVideoData(playbackData) {
                            var i,
                                iMax = playbackData.videos.length,
                                videoItem;
                            for (i = 0; i < iMax; i++) {
                                if (playbackData.videos[i].id !== null || playbackData.videos[i].thumbnail !== null) {
                                    videoItem = {};
                                    videoItem.id = playbackData.videos[i].id;
                                    videoItem.name = playbackData.videos[i].name;
                                    videoItem.thumbnail = playbackData.videos[i].thumbnail;
                                    videoData.push(videoItem);
                                }
                            }
                            return videoData;
                        }
                        /**
                         * create the html for the overlay
                         * @param {array} videoData array of video objects
                         * @return {HTMLElement} videoList the div element containing the overlay
                         */
                        function createVideoList(videoData) {
                            var i,
                                iMax = videoData.length,
                                videoList = createEl('div', {
                                    id: 'videoList'
                                }),
                                videoWrapper = createEl('div'),
                                thumbnailLink,
                                thumbnailImage;
                            videoList.appendChild(videoWrapper);
                            for (i = 0; i < iMax; i++) {
                                thumbnailLink = createEl('a', {
                                    href: 'javascript:loadAndPlay(' + i + ')'
                                })
                                thumbnailImage = createEl('img', {
                                    class: 'video-thumbnail',
                                    src: videoData[i].thumbnail
                                });
                                videoWrapper.appendChild(thumbnailLink);
                                thumbnailLink.appendChild(thumbnailImage);
                            }
                            return videoList;
                        }
                        /**
                         * create an element
                         *
                         * @param  {string} type - the element type
                         * @param  {object} attributes - attributes to add to the element
                         * @return {HTMLElement} the HTML element
                         */
                        function createEl(type, attributes) {
                            var el,
                                attr;
                            el = document.createElement(type);
                            if (attributes !== null) {
                                for (attr in attributes) {
                                    el.setAttribute(attr, attributes[attr]);
                                }
                                return el;
                            }
                        }
                        /**
                         * add text content to an element
                         * @param {HTMLElement} el the element
                         * @param {string} str the text content
                         */
                        function addText(el, str) {
                            el.appendChild(document.createTextNode(str));
                        }
                        /**
                         * intialize the overlay plugin with the related video thumbnails
                         * @param {HTML} overlayContent the HTML for the overlay
                         */
                        function addOverlayText(overlayContent) {
                            myPlayer.overlay({
                                overlays: [{
                                    align: 'top',
                                    content: overlayContent,
                                    start: 'pause',
                                    end: 'play'
                                },
                                {
                                    start: 'end',
                                    end: 'play'
                                }
                                ]
                            });
                        }
                        /**
                         * load and play a video
                         * this function called when thumbnails in the overlay are clicked
                         * @param {integer} idx the index of the video object in the videoData array
                         */
                        loadAndPlay = function (idx) {
                            var currentId = videoData[idx].id;
                            myPlayer.catalog.getVideo(currentId, function (error, video) {
                                try {
                                    myPlayer.catalog.load(video);
                                } catch (e) {
                                    myPlayer.catalog.load(video);
                                }
                                myPlayer.play();
                            });
                        }
                  });
