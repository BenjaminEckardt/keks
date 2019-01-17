![icon](./dist/icon128.png?raw=true)

# keks
> Repeatable hijacking and transformation of cookies.

The purpose of this extension is to create a repeatable way of copying cookie from one Domain to another and/or manipulate it's content.

The current state of this tool is very raw. Improvements are very welcome.

## Installation
Since this extension is currently not published, you need to install it by cloning and building this repo and add it to chrome extensions manually:
1. Clone this repository.
1. Run the following command in the base path of you cloned repository `npm i && npm run build`. 
1. Open chrome.
1. Navigate to chrome://extensions in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
1. Check the box next to Developer Mode.
1. Click Load Unpacked Extension and select the `dist` directory for your cloned repository.

## Thanks
Thanks to my employer [Webtrekk](https://www.webtrekk.com) for setting up the hackathon that enabled me to write this tool.

Thanks to [Joe Marella](http://martellaj.github.io) for creating [the seed project I used](https://github.com/martellaj/chrome-extension-react-typescript-boilerplate).