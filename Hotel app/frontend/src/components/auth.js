export function isLoggedInManager() {
    return localStorage.getItem("access_token")!==null && localStorage.getItem("access_token")!=="undefined";
  }

export function isLoggedInCustomer() {
   return sessionStorage.getItem("customer_access_token")!==null && sessionStorage.getItem("customer_access_token")!=="undefined";
}
  
  export function deleteTokens(){
      localStorage.removeItem("access_token");
      localStorage.removeItem("email");
  }

  export function deleteTokensCustomer(){
    sessionStorage.removeItem("customer_access_token");
    sessionStorage.removeItem("customer_email");
 }

  export function requiredAuth(nextState, replace) {
    if (!isLoggedInManager()) {
      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }

  export function requiredAuthCustomer(nextState, replace) {
    if (!isLoggedInCustomer()) {
      replace({
        pathname: '/customer',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }

