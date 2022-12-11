import jwtDecode from 'jwt-decode'
export const getUserFromToken = () => {
    if (!window.localStorage.getItem("meme_token")) return false
    return jwtDecode(window.localStorage.getItem("meme_token"))
}