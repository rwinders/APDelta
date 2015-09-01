# APDelta
Riot Games API Challenge 2.0 - Analysis of AP item changes

Built by Lahzerahl and Squid767, AP Delta is an application which procures and processes League of Legends match data to present the changes in AP item usage between patch 5.11 and 5.14.

Visit our website here: [www.apdelta.co](http://www.apdelta.co) 

###Tech Stack
* Node.js
* Express.js
* MongoDB
* AngularJS
* Foundation


###Data Set

Data were taken from the Riot Games API from August 21st to 28th. The data set is composed of 77653 Solo Queue ranked games from NA, EUW, EUNE, and KR.

* NA Ranked 5-11: 9598
* NA Ranked 5-14: 9979
* EUW Ranked 5-11: 9286
* EUW Ranked 5-14: 9944
* EUNE Ranked 5-11: 9973
* EUNE Ranked 5-14: 8975
* KR Ranked 5-11: 9912
* KR Ranked 5-14: 9986

###Methodology:

AP Delta utilizes an algorithm written specifically for the Riot Games API Challenge 2 to collect and process data within the project limitations resulting from limited access to database storage (500mb). For both the 5.11 and 5.14 patches, the algorithm calls the API’s matchDetail category using a matchID JSON object provided in the challenge’s datasets. The algorithm then parses through the matchDetail’s event data to determine at what times AP items were purchased. If an AP item was purchased, the timestamp of the purchase event is used to increment a counter representing a champion’s item purchases across all games in which that champion was picked. Purchase events are sorted into buckets representing 15 seconds of game time each. If a champion purchases an AP item in any given game, then the participantId of that champion’s player is used to store the player’s relevant stats for that game within the corresponding champion’s data objects.

The AP item purchase and usage data collected by the algorithm is presented across all purchases on the homepage and for individual champions on the champion specific pages. Champions who had AP item purchases below the significance threshold did not provide meaningful data and are not represented within the program.

While the changes between statistics and usage are largely due to the AP item changes, keep in mind that the changes from 5.12, 5.14, non-AP item usage changes in 5.13, and the consistently evolving meta also impacted the state of the game and may have contributed to the recorded changes.

AP Delta isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.