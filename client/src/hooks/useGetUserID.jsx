// Conseguimos el ID del user que se ha logueado del local storage 
export const useGetUserID = () => {
    return window.localStorage.getItem("userID")
}