// ==UserScript==
// @name     Zendesk auto-login
// @version  1
// @grant    none
// @include  https://rollbar-us.zendesk.com/login/
// @include  https://rollbar-en.zendesk.com/login/
// @include  https://accounts.google.com/signin/oauth/*
// @include  https://zendesk.slack.com/
// @include  https://github.com/*
// @include  https://samson.zende.sk/*
// ==/UserScript==

(() => {
  
  let haveClicked = false;
    
  const withOne = (xpath, func) => {
    let s = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
    if (s.snapshotLength === 1) func(s.snapshotItem(0));
  };
  
  const clickIfOne = xpath => {
    withOne(xpath, a => {
      a.click();
      haveClicked = true;
      console.log("Used Zendesk auto-login on", window.location.href);
    });
  }; 
  
  const tryLogin = () => {
    if (haveClicked) return;
    // console.log(window.location.host);

    if (window.location.host.match(/^rollbar-(us|eu)\.zendesk\.com$/)) {
	    clickIfOne('.//a[contains(., "Log in with Google")]');
    }

    if (window.location.host === 'accounts.google.com') {
	    if (window.location.href.match(/&destination=(https%3A%2F%2F(rollbar-(us|eu)\.zendesk\.com|monitor\.zendesk-staging\.com|samson\.zende\.sk))&/)) {
		    clickIfOne('//div[@data-email="revans@zendesk.com"]');
      }   
    }
    
    if (window.location.host === 'zendesk.slack.com') {
	    clickIfOne('.//a[contains(., "Sign in with Okta")]');
    }
    
    if (window.location.host === 'samson.zende.sk') {
      clickIfOne('//a[contains(., "Login with Google")]');
    }

    if (window.location.host === 'github.com') {
      withOne('//h1[contains(., "Single sign-on to")][contains(., "Zendesk")]', () => {
        clickIfOne('//button[contains(@class, "primary")][contains(., "Continue")]');
      });
    }
      
  };
  
  window.setTimeout(tryLogin, 1000);
  
})();
