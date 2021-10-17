const getToken = () => {
    const token = JSON.parse(localStorage.getItem("accessToken"))
    return token
}

export default getToken