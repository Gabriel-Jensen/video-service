import Signup from "./views/Signup.js";
import Home from "./views/Home.js"


// Makes the page not refresh everytime you go to another nav tag
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {
    // All paths
    const routes = [
        { path: "/", view: Home },
        { path: "/signup", view: Signup }
        ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    });
    // stores the route found
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);
    
    // this defaults any routes that don't exist to the default "/"
    if(!match){
        match = {
            route: routes[0],
            isMatch: true
        };
    }
    const view = new match.route.view();
    // grabs the html from the file and injects it into our page
    document.querySelector('#app').innerHTML = await view.getHtml();

    //console.log(match.route.view());
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    // this listener allows for this to be an SPA
    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link]")) {
            
            e.preventDefault(); // Allows us to change the default behaviour
            navigateTo(e.target.href);
        }
    })


    router();
});



