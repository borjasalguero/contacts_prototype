# contacts_prototype

Contacts App based on the new architecture.

If you want to try this repo:
- Fork this repo
- Execute 'bower install' in order to fetch latest version of Threads.js

The goal of this code is to test every component of the new Gaia architecture, adding performance measures and identifying possible issues asap.

Components we are going to test with this code are:
- ContentWrapper
- Threads.js (or how to have well-defined separation between UI and the 'Client' code needed)
- Navigation (based on the new Transition API)
- Render Cache
- SW


Furthermore, we are supporting other proposals for the new Architecture:
- 'Pinned' web.
Currently we have a version of our app that allow us to 'pin' a Contact Detail view without the dependencies of the 'list of contacts' (which is really cool!). You can try with the experimental branch in [1]

[1] https://github.com/borjasalguero/contacts_prototype/tree/selfcontained_views

Feel free to contribute! If you consider that we need to add any other component to the app, ping us in IRC!